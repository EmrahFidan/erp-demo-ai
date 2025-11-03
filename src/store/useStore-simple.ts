import { create } from 'zustand';

// Simplified types
interface Product {
  id: string;
  name: string;
  stock: number;
}

interface KPI {
  totalOrders: number;
  totalRevenue: number;
  pendingPayments: number;
}

interface AppState {
  products: Product[];
  currentKPI: KPI | null;
  setProducts: (products: Product[]) => void;
  setCurrentKPI: (kpi: KPI | null) => void;
}

export const useStore = create<AppState>((set) => ({
  products: [],
  currentKPI: null,
  setProducts: (products) => set({ products }),
  setCurrentKPI: (kpi) => set({ currentKPI: kpi }),
}));
