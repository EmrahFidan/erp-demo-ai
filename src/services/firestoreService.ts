import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

// Use any type to avoid import issues
type Customer = any;
type Product = any;
type Order = any;
type Invoice = any;
type Payment = any;
type KPI = any;
type Narrative = any;
type ChatSession = any;
type Event = any;

// Generic Firestore Service Class
class FirestoreService<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Convert Firestore timestamps to Date objects
  private convertTimestamps(data: any): T {
    const converted = { ...data };
    Object.keys(converted).forEach((key) => {
      if (converted[key] instanceof Timestamp) {
        converted[key] = converted[key].toDate();
      }
    });
    return converted as T;
  }

  // Get all documents
  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const collectionRef = collection(db, this.collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) =>
        this.convertTimestamps({ id: doc.id, ...doc.data() })
      );
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get single document by ID
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return this.convertTimestamps({ id: docSnap.id, ...docSnap.data() });
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      throw error;
    }
  }

  // Create new document
  async create(data: Omit<T, 'id'>): Promise<string> {
    try {
      const collectionRef = collection(db, this.collectionName);
      const docRef = await addDoc(collectionRef, data);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Update document
  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, data as any);
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Query documents
  async query(constraints: QueryConstraint[]): Promise<T[]> {
    return this.getAll(constraints);
  }
}

// Export service instances for each collection
export const customersService = new FirestoreService<Customer>('customers');
export const productsService = new FirestoreService<Product>('products');
export const ordersService = new FirestoreService<Order>('orders');
export const invoicesService = new FirestoreService<Invoice>('invoices');
export const paymentsService = new FirestoreService<Payment>('payments');
export const kpiService = new FirestoreService<KPI>('kpi');
export const narrativesService = new FirestoreService<Narrative>('narratives');
export const chatsService = new FirestoreService<ChatSession>('chats');
export const eventsService = new FirestoreService<Event>('events');

// Specialized query functions

// Get low stock products
export const getLowStockProducts = async (): Promise<Product[]> => {
  return productsService.query([
    where('stock', '<=', 10),
    orderBy('stock', 'asc'),
  ]);
};

// Get pending invoices
export const getPendingInvoices = async (): Promise<Invoice[]> => {
  return invoicesService.query([
    where('paymentStatus', 'in', ['unpaid', 'partial', 'overdue']),
    orderBy('dueDate', 'asc'),
  ]);
};

// Get recent orders
export const getRecentOrders = async (limitCount: number = 10): Promise<Order[]> => {
  return ordersService.query([
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  ]);
};

// Get customer orders
export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
  return ordersService.query([
    where('customerId', '==', customerId),
    orderBy('createdAt', 'desc'),
  ]);
};

// Get latest KPI
export const getLatestKPI = async (): Promise<KPI | null> => {
  const kpis = await kpiService.query([
    orderBy('month', 'desc'),
    limit(1),
  ]);
  return kpis.length > 0 ? kpis[0] : null;
};

// Get latest narrative
export const getLatestNarrative = async (): Promise<Narrative | null> => {
  const narratives = await narrativesService.query([
    orderBy('generatedAt', 'desc'),
    limit(1),
  ]);
  return narratives.length > 0 ? narratives[0] : null;
};

// Create event log
export const logEvent = async (eventData: Omit<Event, 'id' | 'timestamp'>): Promise<void> => {
  await eventsService.create({
    ...eventData,
    timestamp: new Date(),
  } as Omit<Event, 'id'>);
};
