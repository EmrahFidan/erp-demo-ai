// Firestore Data Models for ERP Demo

// User Roles
export type UserRole = 'sales' | 'finance' | 'admin';

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  roles: {
    [key in UserRole]?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Customer
export interface Customer {
  id: string;
  name: string;
  segment: 'A' | 'B' | 'C'; // Customer segments
  creditLimit: number;
  riskScore: number; // 0-100
  dso: number; // Days Sales Outstanding
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  minStockLevel?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order Item
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Order
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Invoice Line Item
export interface InvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate: number;
  taxAmount: number;
}

// Invoice
export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerId: string;
  customerName: string;
  lines: InvoiceLine[];
  subtotal: number;
  taxTotal: number;
  total: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'overdue';
  dueDate: Date;
  paidDate?: Date;
  notes?: string;
  hasAnomaly?: boolean; // AI detected anomaly flag
  anomalyReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment
export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'check';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  notes?: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// KPI Monthly Metrics
export interface KPI {
  id: string;
  month: string; // Format: "YYYY-MM"
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  dso: number; // Average DSO for the month
  stockRiskItems: number;
  pendingPayments: number;
  customerCount: number;
  lowStockAlerts: number;
  createdAt: Date;
  updatedAt: Date;
}

// AI Narrative
export interface Narrative {
  id: string;
  month: string; // Format: "YYYY-MM"
  summaryPoints: string[]; // Key insights
  recommendedActions: string[]; // Suggested next steps
  dataSource: {
    ordersAnalyzed: number;
    invoicesAnalyzed: number;
    kpiReferences: string[];
  };
  confidence: number; // 0-100
  generatedAt: Date;
  createdBy: string;
}

// Chat Message
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Chat Session
export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  lastMessageAt: Date;
  createdAt: Date;
}

// Event Types
export type EventType =
  | 'orderCreated'
  | 'orderUpdated'
  | 'orderCancelled'
  | 'stockChecked'
  | 'stockLow'
  | 'invoiceIssued'
  | 'invoiceUpdated'
  | 'paymentReceived'
  | 'paymentFailed'
  | 'reminderSent'
  | 'narrativeGenerated';

// Event (Audit Log)
export interface Event {
  id: string;
  type: EventType;
  entityType: 'order' | 'invoice' | 'payment' | 'stock' | 'narrative';
  entityId: string;
  userId: string;
  userName: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

// Note: ChatSession and ChatMessage are already exported above
