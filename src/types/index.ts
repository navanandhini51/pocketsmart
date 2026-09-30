export type PlanType = 'home' | 'party' | 'jewelry';

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface ShoppingLink {
  title: string;
  url: string;
  platform: 'google' | 'amazon' | 'flipkart';
}

export interface BudgetItem {
  name: string;
  category: string;
  estimated_price: number;
  quantity: number;
  total_price: number;
  reason: string;
  shopping_links: ShoppingLink[];
}

export interface CategoryBreakdown {
  category: string;
  allocated_budget: number;
  percentage_of_budget: number;
  items: BudgetItem[];
}

export interface PlanResultData {
  title: string;
  summary: string;
  budget_used: number;
  budget_remaining: number;
  budget_breakdown: CategoryBreakdown[];
  tips: string[];
  disclaimer?: string;
  isFallback?: boolean;
}

export interface PlanRequestData {
  plan_type: PlanType;
  total_budget: number;
  title?: string;
  details: Record<string, any>;
}

export interface PlanRecord {
  id: string;
  user_id: string;
  plan_type: PlanType;
  title: string;
  budget: number;
  budget_used: number;
  budget_remaining: number;
  request_data: PlanRequestData;
  result_data: PlanResultData;
  created_at: string;
}

export interface DashboardStats {
  totalPlans: number;
  recentPlan: PlanRecord | null;
  totalBudgetPlanned: number;
  totalRemainingBudget: number;
}
