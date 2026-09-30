import fs from 'fs';
import path from 'path';
import { PlanRecord, PlanType, User } from '../src/types';

interface StoredUser extends User {
  password_hash: string;
}

interface StoredContact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  plans: PlanRecord[];
  contacts: StoredContact[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Helper to format currency
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Generate shopping links helper
export function generateShoppingLinks(itemName: string) {
  const query = encodeURIComponent(itemName);
  return [
    {
      title: 'Google Shopping',
      url: `https://www.google.com/search?tbm=shop&q=${query}`,
      platform: 'google' as const,
    },
    {
      title: 'Amazon India',
      url: `https://www.amazon.in/s?k=${query}`,
      platform: 'amazon' as const,
    },
    {
      title: 'Flipkart',
      url: `https://www.flipkart.com/search?q=${query}`,
      platform: 'flipkart' as const,
    },
  ];
}

// Initial seed data
const initialData: DatabaseSchema = {
  users: [
    {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      password_hash: 'demo12345',
      created_at: '2026-01-15T10:00:00.000Z',
    },
  ],
  plans: [
    {
      id: 'demo-plan-home-1',
      user_id: 'demo-user-123',
      plan_type: 'home',
      title: 'Modern Living Room Refresh (₹50,000)',
      budget: 50000,
      budget_used: 47200,
      budget_remaining: 2800,
      request_data: {
        plan_type: 'home',
        total_budget: 50000,
        details: {
          room: 'Living Room',
          homeType: '2/3 BHK Apartment',
          requiredItems: 'Sofa, Coffee Table, Ambient Lighting, Ceiling Fan',
          stylePreference: 'Modern',
          priority: 'Balanced',
          additionalRequirements: 'Neutral warm tones, durable fabrics, and energy-efficient lighting.',
        },
      },
      result_data: {
        title: 'Modern Living Room Setup for ₹50,000',
        summary: 'A curated modern living room setup prioritizing high-comfort seating, smart ambient lighting, and elegant minimalist accent tables within budget.',
        budget_used: 47200,
        budget_remaining: 2800,
        budget_breakdown: [
          {
            category: 'Furniture',
            allocated_budget: 18000,
            percentage_of_budget: 36,
            items: [
              {
                name: '3-Seater Fabric Sofa in Charcoal Grey',
                category: 'Furniture',
                estimated_price: 13500,
                quantity: 1,
                total_price: 13500,
                reason: 'Durable linen upholstery with solid wood frame matching modern aesthetic.',
                shopping_links: generateShoppingLinks('3 Seater Fabric Sofa Modern'),
              },
              {
                name: 'Minimalist Nesting Coffee Table Pair',
                category: 'Furniture',
                estimated_price: 4500,
                quantity: 1,
                total_price: 4500,
                reason: 'Space-saving dual nesting design with matte black iron legs and warm oak top.',
                shopping_links: generateShoppingLinks('Modern Nesting Coffee Table set'),
              },
            ],
          },
          {
            category: 'Lighting',
            allocated_budget: 7500,
            percentage_of_budget: 15,
            items: [
              {
                name: 'Smart Dimmable LED Ceiling Flush Mount (36W)',
                category: 'Lighting',
                estimated_price: 3200,
                quantity: 1,
                total_price: 3200,
                reason: 'Tunable warm-to-cool white light controllable via phone app.',
                shopping_links: generateShoppingLinks('Smart LED Ceiling Light 36W'),
              },
              {
                name: 'Nordic Arc Floor Standing Lamp',
                category: 'Lighting',
                estimated_price: 4300,
                quantity: 1,
                total_price: 4300,
                reason: 'Creates cozy evening ambient illumination beside the sofa.',
                shopping_links: generateShoppingLinks('Nordic Arc Floor Lamp living room'),
              },
            ],
          },
          {
            category: 'Fans & Ventilation',
            allocated_budget: 5700,
            percentage_of_budget: 11,
            items: [
              {
                name: 'BLDC Ultra Energy Efficient Ceiling Fan with Remote',
                category: 'Fans & Ventilation',
                estimated_price: 3800,
                quantity: 1,
                total_price: 3800,
                reason: 'Saves up to 65% electricity with silent aerodynamic blades.',
                shopping_links: generateShoppingLinks('BLDC Ceiling Fan Remote control'),
              },
              {
                name: 'Compact Silent Air Circulator Table Fan',
                category: 'Fans & Ventilation',
                estimated_price: 1900,
                quantity: 1,
                total_price: 1900,
                reason: 'Improves cross-ventilation during warm afternoons.',
                shopping_links: generateShoppingLinks('Air circulator table fan silent'),
              },
            ],
          },
          {
            category: 'Dining & Accent',
            allocated_budget: 8500,
            percentage_of_budget: 17,
            items: [
              {
                name: 'Compact 2-Seater Breakfast High Table with Stools',
                category: 'Dining & Accent',
                estimated_price: 8500,
                quantity: 1,
                total_price: 8500,
                reason: 'Multi-purpose dining and casual work-from-home nook.',
                shopping_links: generateShoppingLinks('2 Seater Bar Dining Table Stools set'),
              },
            ],
          },
          {
            category: 'Decor & Essentials',
            allocated_budget: 7500,
            percentage_of_budget: 15,
            items: [
              {
                name: 'Handwoven Geometric Area Rug (5x7 ft)',
                category: 'Decor & Essentials',
                estimated_price: 4200,
                quantity: 1,
                total_price: 4200,
                reason: 'Ties the seating area together and adds plush underfoot texture.',
                shopping_links: generateShoppingLinks('Handwoven Area Rug 5x7 feet modern'),
              },
              {
                name: 'Ceramic Indoor Planters with Metal Stands (Set of 2)',
                category: 'Decor & Essentials',
                estimated_price: 1800,
                quantity: 1,
                total_price: 1800,
                reason: 'Adds vibrant natural greenery and elevation to empty corners.',
                shopping_links: generateShoppingLinks('Ceramic Planters with metal stand set of 2'),
              },
              {
                name: 'Textured Velvet Cushion Covers (Pack of 4)',
                category: 'Decor & Essentials',
                estimated_price: 1500,
                quantity: 1,
                total_price: 1500,
                reason: 'Inexpensive pops of mustard and slate to complement the sofa.',
                shopping_links: generateShoppingLinks('Velvet Cushion Covers Pack of 4'),
              },
            ],
          },
        ],
        tips: [
          'Compare prices on major e-commerce platforms during weekend promotional sales to save an extra 10-15%.',
          'Prioritize the sofa and BLDC fan first as core everyday essentials.',
          'Keep ₹2,800 buffer for delivery charges and installation fittings.',
          'Always measure doorway clearances before ordering larger furniture pieces.',
        ],
        disclaimer: 'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.',
      },
      created_at: '2026-02-10T14:30:00.000Z',
    },
    {
      id: 'demo-plan-party-2',
      user_id: 'demo-user-123',
      plan_type: 'party',
      title: 'College Farewell & Celebration (₹30,000)',
      budget: 30000,
      budget_used: 28400,
      budget_remaining: 1600,
      request_data: {
        plan_type: 'party',
        total_budget: 30000,
        details: {
          partyType: 'College Event',
          guests: 35,
          location: 'Terrace / Rooftop',
          foodPreference: 'Finger Foods & Snacks',
          decorationPreference: 'Balloon & Fairy Lights Theme',
          entertainmentPreference: 'DJ / Music System',
          date: '2026-03-20',
          additionalRequirements: 'Instagrammable photo booth, energetic playlist, vegetarian & non-vegetarian snacks.',
        },
      },
      result_data: {
        title: 'College Farewell Celebration for ₹30,000',
        summary: 'A vibrant, budget-optimized rooftop college farewell party designed for 35 guests with delicious catered finger foods, immersive fairy light decor, and sound rental.',
        budget_used: 28400,
        budget_remaining: 1600,
        budget_breakdown: [
          {
            category: 'Venue & Seating Rental',
            allocated_budget: 7000,
            percentage_of_budget: 23,
            items: [
              {
                name: 'Rooftop Canopy & Ambient Seating Rugs Rental',
                category: 'Venue & Seating Rental',
                estimated_price: 7000,
                quantity: 1,
                total_price: 7000,
                reason: 'Comfortable bohemian rooftop floor seating with cushions and low tables.',
                shopping_links: generateShoppingLinks('Rooftop event seating and canopy rental'),
              },
            ],
          },
          {
            category: 'Food & Drinks',
            allocated_budget: 10500,
            percentage_of_budget: 35,
            items: [
              {
                name: 'Assorted Gourmet Snack Platters (Paneer Tikka, Chicken Wings, Spring Rolls)',
                category: 'Food & Drinks',
                estimated_price: 7500,
                quantity: 1,
                total_price: 7500,
                reason: 'Pre-ordered party platters designed for easy self-serve mingling (₹215/person).',
                shopping_links: generateShoppingLinks('Party snack platters catering bulk'),
              },
              {
                name: 'Chilled Mocktail Dispensers & Soft Drinks Station',
                category: 'Food & Drinks',
                estimated_price: 3000,
                quantity: 1,
                total_price: 3000,
                reason: 'Includes 2 glass dispensers with Lemon Mint Mojito & Blue Curacao Punch.',
                shopping_links: generateShoppingLinks('Glass Drink Dispenser 5 Liter party'),
              },
            ],
          },
          {
            category: 'Decorations & Photo Booth',
            allocated_budget: 4500,
            percentage_of_budget: 15,
            items: [
              {
                name: 'LED Warm White Fairy Curtain Lights (10x10 ft)',
                category: 'Decorations & Photo Booth',
                estimated_price: 1200,
                quantity: 2,
                total_price: 2400,
                reason: 'Creates the perfect illuminated backdrop for evening farewell photos.',
                shopping_links: generateShoppingLinks('Fairy curtain lights 10x10 feet warm white'),
              },
              {
                name: 'Farewell Memory Photo Booth Props & Balloon Garland Kit',
                category: 'Decorations & Photo Booth',
                estimated_price: 2100,
                quantity: 1,
                total_price: 2100,
                reason: 'Black and gold celebratory balloons, customized college placards, and polaroid string.',
                shopping_links: generateShoppingLinks('Farewell party balloon arch kit props'),
              },
            ],
          },
          {
            category: 'Entertainment & Audio',
            allocated_budget: 4500,
            percentage_of_budget: 15,
            items: [
              {
                name: 'High-Power Party PA Bluetooth Speaker with Dual Mic Rental',
                category: 'Entertainment & Audio',
                estimated_price: 3500,
                quantity: 1,
                total_price: 3500,
                reason: 'Crisp party audio with wireless microphones for batch speeches and DJ playlist.',
                shopping_links: generateShoppingLinks('Portable party speaker with microphone rental'),
              },
              {
                name: 'Karaoke & Party Games Bundle (Trivia, Charades, Memento Awards)',
                category: 'Entertainment & Audio',
                estimated_price: 1000,
                quantity: 1,
                total_price: 1000,
                reason: 'Organized interactive entertainment to keep energy high.',
                shopping_links: generateShoppingLinks('Fun group party card games'),
              },
            ],
          },
          {
            category: 'Contingency & Supplies',
            allocated_budget: 1900,
            percentage_of_budget: 6,
            items: [
              {
                name: 'Eco-Friendly Areca Palm Plates, Cups & Napkins Kit',
                category: 'Contingency & Supplies',
                estimated_price: 1900,
                quantity: 1,
                total_price: 1900,
                reason: 'Biodegradable disposable dinnerware for fast rooftop cleanup.',
                shopping_links: generateShoppingLinks('Areca palm leaf disposable plates set 50'),
              },
            ],
          },
        ],
        tips: [
          'Pre-chill all mocktails and beverages 3 hours prior so ice consumption is reduced.',
          'Assign a dedicated friend to manage the Spotify playlist to avoid music interruptions.',
          'Keep ₹1,600 buffer for extra ice bags and sudden late-night snack refills.',
        ],
        disclaimer: 'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.',
      },
      created_at: '2026-02-18T18:45:00.000Z',
    },
    {
      id: 'demo-plan-jewelry-3',
      user_id: 'demo-user-123',
      plan_type: 'jewelry',
      title: 'Festive Gold & Diamond Bridal Ensemble (₹1,00,000)',
      budget: 100000,
      budget_used: 94500,
      budget_remaining: 5500,
      request_data: {
        plan_type: 'jewelry',
        total_budget: 100000,
        details: {
          jewelryType: 'Complete Set',
          occasion: 'Wedding',
          preferredMetal: 'Gold',
          style: 'Elegant',
          mainPiece: 'Statement Choker Necklace',
          matchingRequirements: 'Matching Jhumka Earrings & Maang Tikka',
          additionalRequirements: '22K BIS Hallmarked gold with subtle pearl drops, timeless heirloom styling.',
        },
      },
      result_data: {
        title: 'Festive Gold & Pearl Bridal Set for ₹1,00,000',
        summary: 'A regal yet contemporary 22K hallmarked gold bridal collection featuring an intricate filigree choker necklace, coordinating chandbali earrings, and protective keepsake packaging.',
        budget_used: 94500,
        budget_remaining: 5500,
        budget_breakdown: [
          {
            category: 'Main Statement Piece',
            allocated_budget: 52000,
            percentage_of_budget: 52,
            items: [
              {
                name: '22K Hallmarked Gold Filigree Choker with Freshwater Pearl Drops',
                category: 'Main Statement Piece',
                estimated_price: 52000,
                quantity: 1,
                total_price: 52000,
                reason: 'Exquisite handcrafted floral filigree work certified by BIS hallmark, ideal for weddings.',
                shopping_links: generateShoppingLinks('22K gold filigree choker necklace bridal'),
              },
            ],
          },
          {
            category: 'Matching Companion Pieces',
            allocated_budget: 25000,
            percentage_of_budget: 25,
            items: [
              {
                name: 'Matching 22K Gold Chandbali Earrings with Pearl Tassels',
                category: 'Matching Companion Pieces',
                estimated_price: 19500,
                quantity: 1,
                total_price: 19500,
                reason: 'Harmonizes perfectly with the choker motif while remaining comfortable for long wear.',
                shopping_links: generateShoppingLinks('22K gold chandbali earrings bridal pearl'),
              },
              {
                name: 'Delicate Gold Plated Floral Maang Tikka',
                category: 'Matching Companion Pieces',
                estimated_price: 5500,
                quantity: 1,
                total_price: 5500,
                reason: 'Completes the traditional bridal headwear look with secure clasp.',
                shopping_links: generateShoppingLinks('Gold bridal maang tikka traditional'),
              },
            ],
          },
          {
            category: 'Accent Piece & Ring',
            allocated_budget: 10500,
            percentage_of_budget: 11,
            items: [
              {
                name: 'Adjustable Solitaire Moissanite / Kundan Cocktail Ring',
                category: 'Accent Piece & Ring',
                estimated_price: 10500,
                quantity: 1,
                total_price: 10500,
                reason: 'Bold statement cocktail ring that catches light during celebratory ceremonies.',
                shopping_links: generateShoppingLinks('Kundan cocktail ring adjustable gold'),
              },
            ],
          },
          {
            category: 'Care, Packaging & Insurance',
            allocated_budget: 7000,
            percentage_of_budget: 7,
            items: [
              {
                name: 'Velvet-Lined Anti-Tarnish Heirloom Jewelry Vault Box',
                category: 'Care, Packaging & Insurance',
                estimated_price: 3200,
                quantity: 1,
                total_price: 3200,
                reason: 'Multi-layer wooden jewelry organizer with moisture absorbing lining.',
                shopping_links: generateShoppingLinks('Anti tarnish jewelry box wooden velvet'),
              },
              {
                name: 'Ultrasonic Jewelry Cleaner & Gold Polishing Cloth Set',
                category: 'Care, Packaging & Insurance',
                estimated_price: 3800,
                quantity: 1,
                total_price: 3800,
                reason: 'Safely removes lotion and dust residues to keep 22K gold lustrous at home.',
                shopping_links: generateShoppingLinks('Ultrasonic jewelry cleaner machine portable'),
              },
            ],
          },
        ],
        tips: [
          'Verify the BIS hallmark laser engraving and HUID (Hallmark Unique Identification) number at purchase.',
          'Inquire about the jeweller\'s making charge percentage (aim for under 12-14% during bridal festivals).',
          'Retain the original invoice with gold weight and purity breakdown for future exchange value.',
          'Keep ₹5,500 buffer for daily gold spot price fluctuations and state GST.',
        ],
        disclaimer: 'Gold and precious gem prices fluctuate daily based on international bullion rates and making charges. Verify live market rates and hallmarks before purchase.',
      },
      created_at: '2026-02-25T11:20:00.000Z',
    },
  ],
  contacts: [],
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (e) {
        console.warn('Could not create data dir, using in-memory only', e);
      }
    }
  }

  private loadData(): DatabaseSchema {
    try {
      this.ensureDir();
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.users && parsed.plans) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading db file, initializing with seed data', e);
    }
    this.saveData(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }

  private saveData(data: DatabaseSchema) {
    try {
      this.ensureDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Error saving db file', e);
    }
  }

  // User methods
  getUserByEmail(email: string): StoredUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): StoredUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  createUser(name: string, email: string, password_hash: string): User {
    const newUser: StoredUser = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash,
      created_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData(this.data);
    const { password_hash: _, ...safeUser } = newUser;
    return safeUser;
  }

  updateUserName(id: string, newName: string): User | null {
    const user = this.getUserById(id);
    if (!user) return null;
    user.name = newName.trim();
    this.saveData(this.data);
    const { password_hash: _, ...safeUser } = user;
    return safeUser;
  }

  // Plan methods
  getUserPlans(userId: string): PlanRecord[] {
    return this.data.plans
      .filter(p => p.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getPlanById(id: string, userId?: string): PlanRecord | undefined {
    const plan = this.data.plans.find(p => p.id === id);
    if (!plan) return undefined;
    if (userId && plan.user_id !== userId) return undefined;
    return plan;
  }

  createPlan(planData: Omit<PlanRecord, 'id' | 'created_at'>): PlanRecord {
    const newPlan: PlanRecord = {
      ...planData,
      id: 'plan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      created_at: new Date().toISOString(),
    };
    this.data.plans.unshift(newPlan);
    this.saveData(this.data);
    return newPlan;
  }

  deletePlan(id: string, userId: string): boolean {
    const initialLen = this.data.plans.length;
    this.data.plans = this.data.plans.filter(p => !(p.id === id && p.user_id === userId));
    if (this.data.plans.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Contact messages
  saveContact(name: string, email: string, message: string) {
    const contact: StoredContact = {
      id: 'contact-' + Date.now(),
      name,
      email,
      message,
      created_at: new Date().toISOString(),
    };
    this.data.contacts.push(contact);
    this.saveData(this.data);
    return contact;
  }
}

export const db = new Database();
