import { PlanRecord, PlanRequestData, PlanResultData, User, DashboardStats } from '../types';

const TOKEN_KEY = 'pocketsmart_auth_token';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'A network error occurred. Please try again.');
  }

  return data as T;
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string): Promise<{ user: User; token: string; message: string }> {
    return apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async login(email: string, password: string): Promise<{ user: User; token: string; message: string }> {
    return apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe(): Promise<{ user: User }> {
    return apiFetch('/api/auth/me');
  },

  async updateProfile(name: string): Promise<{ user: User; message: string }> {
    return apiFetch('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  // AI & Plans
  async generatePlan(request: PlanRequestData): Promise<{ result: PlanResultData }> {
    return apiFetch('/api/plans/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async savePlan(planData: {
    plan_type: string;
    title: string;
    budget: number;
    budget_used: number;
    budget_remaining: number;
    request_data: PlanRequestData;
    result_data: PlanResultData;
  }): Promise<{ plan: PlanRecord; message: string }> {
    return apiFetch('/api/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  },

  async getPlans(): Promise<{ plans: PlanRecord[] }> {
    return apiFetch('/api/plans');
  },

  async getPlanById(id: string): Promise<{ plan: PlanRecord }> {
    return apiFetch(`/api/plans/${id}`);
  },

  async deletePlan(id: string): Promise<{ message: string }> {
    return apiFetch(`/api/plans/${id}`, {
      method: 'DELETE',
    });
  },

  async getDashboardStats(): Promise<{ stats: DashboardStats }> {
    return apiFetch('/api/plans/stats');
  },

  // Contact
  async sendContact(name: string, email: string, message: string): Promise<{ message: string }> {
    return apiFetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email, message }),
    });
  },
};
