import { create } from 'zustand';

// Import types directly - avoid circular dependencies
type Customer = any;
type Product = any;
type Order = any;
type Invoice = any;
type Payment = any;
type KPI = any;
type Narrative = any;
type ChatSession = any;

// Main Store Interface
interface AppState {
  // Data
  customers: Customer[];
  products: Product[];
  orders: Order[];
  invoices: Invoice[];
  payments: Payment[];
  currentKPI: KPI | null;
  currentNarrative: Narrative | null;
  chatSessions: ChatSession[];

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions - Customers
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Actions - Products
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getLowStockProducts: () => Product[];

  // Actions - Orders
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrdersByCustomer: (customerId: string) => Order[];

  // Actions - Invoices
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getPendingInvoices: () => Invoice[];

  // Actions - Payments
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;

  // Actions - KPI & Narrative
  setCurrentKPI: (kpi: KPI | null) => void;
  setCurrentNarrative: (narrative: Narrative | null) => void;

  // Actions - Chat
  setChatSessions: (sessions: ChatSession[]) => void;
  addChatSession: (session: ChatSession) => void;
  updateChatSession: (id: string, session: Partial<ChatSession>) => void;

  // Actions - Loading & Error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Create Zustand Store
export const useStore = create<AppState>((set, get) => ({
  // Initial state
  customers: [],
  products: [],
  orders: [],
  invoices: [],
  payments: [],
  currentKPI: null,
  currentNarrative: null,
  chatSessions: [],
  isLoading: false,
  error: null,

  // Customer actions
  setCustomers: (customers) => set({ customers }),
  addCustomer: (customer) =>
    set((state) => ({ customers: [...state.customers, customer] })),
  updateCustomer: (id, customer) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...customer } : c
      ),
    })),
  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),

  // Product actions
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...product } : p
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  getLowStockProducts: () => {
    const { products } = get();
    return products.filter(
      (p) => p.minStockLevel && p.stock <= p.minStockLevel
    );
  },

  // Order actions
  setOrders: (orders) => set({ orders }),
  addOrder: (order) =>
    set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (id, order) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...order } : o)),
    })),
  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
    })),
  getOrdersByCustomer: (customerId) => {
    const { orders } = get();
    return orders.filter((o) => o.customerId === customerId);
  },

  // Invoice actions
  setInvoices: (invoices) => set({ invoices }),
  addInvoice: (invoice) =>
    set((state) => ({ invoices: [...state.invoices, invoice] })),
  updateInvoice: (id, invoice) =>
    set((state) => ({
      invoices: state.invoices.map((i) =>
        i.id === id ? { ...i, ...invoice } : i
      ),
    })),
  deleteInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((i) => i.id !== id),
    })),
  getPendingInvoices: () => {
    const { invoices } = get();
    return invoices.filter((i) =>
      ['unpaid', 'partial', 'overdue'].includes(i.paymentStatus)
    );
  },

  // Payment actions
  setPayments: (payments) => set({ payments }),
  addPayment: (payment) =>
    set((state) => ({ payments: [...state.payments, payment] })),
  updatePayment: (id, payment) =>
    set((state) => ({
      payments: state.payments.map((p) =>
        p.id === id ? { ...p, ...payment } : p
      ),
    })),
  deletePayment: (id) =>
    set((state) => ({
      payments: state.payments.filter((p) => p.id !== id),
    })),

  // KPI & Narrative actions
  setCurrentKPI: (kpi) => set({ currentKPI: kpi }),
  setCurrentNarrative: (narrative) => set({ currentNarrative: narrative }),

  // Chat actions
  setChatSessions: (sessions) => set({ chatSessions: sessions }),
  addChatSession: (session) =>
    set((state) => ({ chatSessions: [...state.chatSessions, session] })),
  updateChatSession: (id, session) =>
    set((state) => ({
      chatSessions: state.chatSessions.map((s) =>
        s.id === id ? { ...s, ...session } : s
      ),
    })),

  // Loading & Error actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
