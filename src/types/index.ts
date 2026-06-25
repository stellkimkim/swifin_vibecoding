export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  onboarding_completed: boolean;
  created_at: string;
}

export interface ReceiptItem {
  name: string;
  price: number;
}

export interface Receipt {
  id: string;
  user_id: string;
  store_name: string;
  total_amount: number;
  receipt_date: string;
  receipt_time?: string;
  image_url?: string;
  category: 'food' | 'cafe' | 'shopping' | 'transport' | 'culture' | 'subscription' | 'etc';
  items?: ReceiptItem[];
  memo?: string;
  ocr_raw?: any;
  created_at: string;
}

export interface Swipe {
  id: string;
  user_id: string;
  receipt_id: string;
  direction: 'worth' | 'regret';
  tag?: string;
  swiped_at: string;
}

export interface CategoryStats {
  [category: string]: {
    total: number;
    worth_count: number;
    regret_count: number;
    total_amount: number;
  };
}

export interface MonthlyReport {
  id: string;
  user_id: string;
  year_month: string;
  score: number;
  total_worth: number;
  total_regret: number;
  category_stats: CategoryStats;
  persona: string;
  persona_description: string;
  ai_insights: string[];
  ai_suggestions: string[];
  ai_coach_message: string;
  generated_at: string;
}
