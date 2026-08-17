import { create } from 'zustand';
import { Scanner } from '@/data/scannersData';

interface CartItem extends Scanner {
  quantity: number;
}

interface ShopState {
  cart: CartItem[];
  comparisonList: string[];
  isCartOpen: boolean;
  isComparisonOpen: boolean;
  selectedCategory: string;
  quizAnswers: Record<string, string>;
  quizCompleted: boolean;
  recommendedScanners: string[];
  
  // Actions
  addToCart: (scanner: Scanner) => void;
  removeFromCart: (scannerId: string) => void;
  updateQuantity: (scannerId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  addToComparison: (scannerId: string) => void;
  removeFromComparison: (scannerId: string) => void;
  clearComparison: () => void;
  toggleComparison: () => void;
  setCategory: (category: string) => void;
  setQuizAnswer: (questionId: string, answer: string) => void;
  completeQuiz: (recommendedIds: string[]) => void;
  resetQuiz: () => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
}

export const useShopStore = create<ShopState>((set, get) => ({
  cart: [],
  comparisonList: [],
  isCartOpen: false,
  isComparisonOpen: false,
  selectedCategory: 'all',
  quizAnswers: {},
  quizCompleted: false,
  recommendedScanners: [],

  addToCart: (scanner) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === scanner.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === scanner.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...scanner, quantity: 1 }] };
    }),

  removeFromCart: (scannerId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== scannerId),
    })),

  updateQuantity: (scannerId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === scannerId ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    })),

  clearCart: () => set({ cart: [] }),

  toggleCart: () =>
    set((state) => ({ isCartOpen: !state.isCartOpen })),

  addToComparison: (scannerId) =>
    set((state) => {
      if (state.comparisonList.includes(scannerId)) {
        return state;
      }
      if (state.comparisonList.length >= 3) {
        return state;
      }
      return { comparisonList: [...state.comparisonList, scannerId] };
    }),

  removeFromComparison: (scannerId) =>
    set((state) => ({
      comparisonList: state.comparisonList.filter((id) => id !== scannerId),
    })),

  clearComparison: () => set({ comparisonList: [] }),

  toggleComparison: () =>
    set((state) => ({ isComparisonOpen: !state.isComparisonOpen })),

  setCategory: (category) => set({ selectedCategory: category }),

  setQuizAnswer: (questionId, answer) =>
    set((state) => ({
      quizAnswers: { ...state.quizAnswers, questionId: answer },
    })),

  completeQuiz: (recommendedIds) =>
    set({ quizCompleted: true, recommendedScanners: recommendedIds }),

  resetQuiz: () =>
    set({ quizAnswers: {}, quizCompleted: false, recommendedScanners: [] }),

  getTotalPrice: () =>
    get().cart.reduce((total, item) => total + item.price * item.quantity, 0),

  getCartCount: () =>
    get().cart.reduce((count, item) => count + item.quantity, 0),
}));
