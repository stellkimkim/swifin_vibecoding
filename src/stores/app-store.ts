import { create } from 'zustand';
import { Profile, Receipt, Swipe, MonthlyReport } from '../types';
import { mockProfile, mockReceipts, mockSwipes, mockReport } from '../lib/mock-data';

interface AppState {
  profile: Profile;
  receipts: Receipt[];
  swipes: Swipe[];
  report: MonthlyReport;
  
  // Onboarding action
  completeOnboarding: () => void;
  
  // Receipt actions
  addReceipt: (receipt: Omit<Receipt, 'id' | 'user_id' | 'created_at'>) => Receipt;
  updateReceipt: (id: string, updates: Partial<Receipt>) => void;
  
  // Swipe actions
  addSwipe: (receiptId: string, direction: 'worth' | 'regret', tag?: string) => void;
  getPendingSwipes: () => Receipt[];
  
  // Reset store (for testing)
  resetData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  profile: { ...mockProfile },
  receipts: [...mockReceipts],
  swipes: [...mockSwipes],
  report: { ...mockReport },

  completeOnboarding: () => set((state) => ({
    profile: { ...state.profile, onboarding_completed: true }
  })),

  addReceipt: (receiptData) => {
    const id = `rec-${Date.now()}`;
    const newReceipt: Receipt = {
      ...receiptData,
      id,
      user_id: get().profile.id,
      created_at: new Date().toISOString(),
    };
    
    set((state) => ({
      receipts: [newReceipt, ...state.receipts],
    }));
    
    return newReceipt;
  },

  updateReceipt: (id, updates) => set((state) => ({
    receipts: state.receipts.map((r) => (r.id === id ? { ...r, ...updates } : r)),
  })),

  addSwipe: (receiptId, direction, tag) => {
    const newSwipe: Swipe = {
      id: `sw-${Date.now()}`,
      user_id: get().profile.id,
      receipt_id: receiptId,
      direction,
      tag,
      swiped_at: new Date().toISOString(),
    };

    set((state) => {
      const updatedSwipes = [newSwipe, ...state.swipes];
      
      // Dynamic updates for the mock report to reflect newly swiped transactions in the UI
      const evaluatedReceipt = state.receipts.find((r) => r.id === receiptId);
      let totalWorth = state.report.total_worth;
      let totalRegret = state.report.total_regret;
      
      if (evaluatedReceipt) {
        if (direction === 'worth') {
          totalWorth += evaluatedReceipt.total_amount;
        } else {
          totalRegret += evaluatedReceipt.total_amount;
        }
      }
      
      // Recalculate score based on worth vs total ratio
      const totalAmount = totalWorth + totalRegret;
      const score = totalAmount > 0 ? Math.round((totalWorth / totalAmount) * 100) : 100;

      return {
        swipes: updatedSwipes,
        report: {
          ...state.report,
          total_worth: totalWorth,
          total_regret: totalRegret,
          score,
        }
      };
    });
  },

  getPendingSwipes: () => {
    const { receipts, swipes } = get();
    const swipedIds = new Set(swipes.map((s) => s.receipt_id));
    return receipts.filter((r) => !swipedIds.has(r.id));
  },

  resetData: () => set({
    profile: { ...mockProfile },
    receipts: [...mockReceipts],
    swipes: [...mockSwipes],
    report: { ...mockReport },
  }),
}));
