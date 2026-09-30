import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { generateAIPlan } from './server/ai-generator';
import { PlanRequestData } from './src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Simple token utility for lightweight auth session
// In production or prototype, tokens encode userId safely
function createToken(userId: string): string {
  const payload = { userId, timestamp: Date.now() };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyToken(token: string): string | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.userId) {
      return parsed.userId;
    }
  } catch (e) {
    // invalid token
  }
  return null;
}

// Authentication middleware
interface AuthenticatedRequest extends Request {
  userId?: string;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Please log in to continue.' });
  }

  const token = authHeader.split(' ')[1];
  const userId = verifyToken(token);

  if (!userId) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }

  const user = db.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'User account not found.' });
  }

  req.userId = userId;
  next();
}

// Optional Auth (for generation without login or with login)
function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const userId = verifyToken(token);
    if (userId) {
      req.userId = userId;
    }
  }
  next();
}

/* ==========================================================================
   AUTH ROUTES
   ========================================================================== */

// Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please log in.' });
    }

    const user = db.createUser(name, email, password);
    const token = createToken(user.id);

    return res.status(201).json({
      message: 'Account created successfully!',
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Unable to complete registration. Please try again.' });
  }
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const user = db.getUserByEmail(email);
    if (!user || user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
    }

    const token = createToken(user.id);
    const { password_hash: _, ...safeUser } = user;

    return res.json({
      message: 'Login successful!',
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Unable to log in at this time. Please try again.' });
  }
});

// Current User Profile
app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = db.getUserById(req.userId!);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const { password_hash: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

// Update Profile
app.put('/api/auth/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters.' });
    }

    const updated = db.updateUserName(req.userId!, name);
    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ message: 'Profile updated successfully!', user: updated });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Could not update profile.' });
  }
});

/* ==========================================================================
   AI & PLANNER ROUTES
   ========================================================================== */

// Generate Plan using Gemini AI (with fallback)
app.post('/api/plans/generate', optionalAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { plan_type, total_budget, details, title } = req.body;

    if (!plan_type || !['home', 'party', 'jewelry'].includes(plan_type)) {
      return res.status(400).json({ error: 'Invalid plan type. Must be home, party, or jewelry.' });
    }

    const budget = Number(total_budget);
    if (isNaN(budget) || budget <= 0) {
      return res.status(400).json({ error: 'Please enter a valid budget amount greater than 0.' });
    }

    const planRequest: PlanRequestData = {
      plan_type,
      total_budget: budget,
      title: title || `Smart ${plan_type.toUpperCase()} Plan`,
      details: details || {},
    };

    const result = await generateAIPlan(planRequest);
    return res.json({ result });
  } catch (error) {
    console.error('Plan generation failed:', error);
    return res.status(500).json({ error: 'Something went wrong while generating your plan. Please try again.' });
  }
});

// Save Plan to User Database
app.post('/api/plans', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { plan_type, title, budget, budget_used, budget_remaining, request_data, result_data } = req.body;

    if (!plan_type || !title || budget === undefined || !result_data) {
      return res.status(400).json({ error: 'Missing required plan data to save.' });
    }

    const plan = db.createPlan({
      user_id: req.userId!,
      plan_type,
      title,
      budget: Number(budget),
      budget_used: Number(budget_used || budget),
      budget_remaining: Number(budget_remaining || 0),
      request_data: request_data || { plan_type, total_budget: budget, details: {} },
      result_data,
    });

    return res.status(201).json({ message: 'Plan saved to your history!', plan });
  } catch (error) {
    console.error('Error saving plan:', error);
    return res.status(500).json({ error: 'Failed to save plan to database.' });
  }
});

// List User's Saved Plans
app.get('/api/plans', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const plans = db.getUserPlans(req.userId!);
    return res.json({ plans });
  } catch (error) {
    console.error('Error retrieving plans:', error);
    return res.status(500).json({ error: 'Unable to retrieve plan history.' });
  }
});

// Get User Dashboard Stats
app.get('/api/plans/stats', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const plans = db.getUserPlans(req.userId!);
    const totalPlans = plans.length;
    const recentPlan = plans[0] || null;
    const totalBudgetPlanned = plans.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalRemainingBudget = recentPlan ? recentPlan.budget_remaining : 0;

    return res.json({
      stats: {
        totalPlans,
        recentPlan,
        totalBudgetPlanned,
        totalRemainingBudget,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Unable to load dashboard statistics.' });
  }
});

// Get Single Plan by ID
app.get('/api/plans/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const plan = db.getPlanById(req.params.id, req.userId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found or access denied.' });
    }
    return res.json({ plan });
  } catch (error) {
    console.error('Error fetching plan:', error);
    return res.status(500).json({ error: 'Unable to load plan.' });
  }
});

// Delete Plan by ID
app.delete('/api/plans/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deletePlan(req.params.id, req.userId!);
    if (!success) {
      return res.status(404).json({ error: 'Plan not found or could not be removed.' });
    }
    return res.json({ message: 'Plan deleted successfully.' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return res.status(500).json({ error: 'Unable to delete plan.' });
  }
});

/* ==========================================================================
   CONTACT ROUTE
   ========================================================================== */

app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide your name, email, and message.' });
    }
    db.saveContact(name, email, message);
    return res.json({ message: 'Thank you! Your message has been received. Our team will get back to you shortly.' });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({ error: 'Could not send message. Please try again later.' });
  }
});

/* ==========================================================================
   DEV VITE MIDDLEWARE & PROD STATIC SERVING
   ========================================================================== */

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.warn('Production build dist folder not found. Please run "npm run build" first.');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PocketSmart AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
