import {
  customersService,
  productsService,
  ordersService,
  invoicesService,
  paymentsService,
  kpiService,
  narrativesService,
} from '../services/firestoreService';

// Inline seed data to avoid type import issues
const seedCustomers = [
  {
    name: 'Acme Corporation',
    segment: 'A',
    creditLimit: 500000,
    riskScore: 15,
    dso: 25,
    email: 'contact@acme.com',
    phone: '+90 212 555 0001',
    address: 'İstanbul, Turkey',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    name: 'Tech Solutions Ltd',
    segment: 'A',
    creditLimit: 350000,
    riskScore: 20,
    dso: 30,
    email: 'info@techsolutions.com',
    phone: '+90 216 555 0002',
    address: 'Ankara, Turkey',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    name: 'Global Trading Co',
    segment: 'B',
    creditLimit: 200000,
    riskScore: 35,
    dso: 45,
    email: 'sales@globaltrading.com',
    phone: '+90 232 555 0003',
    address: 'İzmir, Turkey',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    name: 'Metro Retail',
    segment: 'B',
    creditLimit: 150000,
    riskScore: 40,
    dso: 50,
    email: 'orders@metroretail.com',
    phone: '+90 312 555 0004',
    address: 'Bursa, Turkey',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
  },
  {
    name: 'Small Business Inc',
    segment: 'C',
    creditLimit: 50000,
    riskScore: 60,
    dso: 65,
    email: 'contact@smallbiz.com',
    phone: '+90 224 555 0005',
    address: 'Antalya, Turkey',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01'),
  },
];

const seedProducts = [
  {
    sku: 'PROD-001',
    name: 'Laptop Pro 15"',
    description: 'High-performance laptop for professionals',
    price: 25000,
    stock: 45,
    category: 'Electronics',
    minStockLevel: 10,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    sku: 'PROD-002',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 350,
    stock: 5,
    category: 'Accessories',
    minStockLevel: 20,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    sku: 'PROD-003',
    name: 'USB-C Hub',
    description: '7-in-1 USB-C Hub with HDMI',
    price: 850,
    stock: 120,
    category: 'Accessories',
    minStockLevel: 30,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    sku: 'PROD-004',
    name: 'Monitor 27" 4K',
    description: '4K UHD Professional Monitor',
    price: 12000,
    stock: 8,
    category: 'Electronics',
    minStockLevel: 15,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    sku: 'PROD-005',
    name: 'Mechanical Keyboard',
    description: 'RGB Mechanical Gaming Keyboard',
    price: 2500,
    stock: 65,
    category: 'Accessories',
    minStockLevel: 25,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    sku: 'PROD-006',
    name: 'Webcam HD',
    description: '1080p HD Webcam',
    price: 1200,
    stock: 3,
    category: 'Electronics',
    minStockLevel: 15,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    sku: 'PROD-007',
    name: 'Desk Lamp LED',
    description: 'Adjustable LED Desk Lamp',
    price: 450,
    stock: 85,
    category: 'Office',
    minStockLevel: 20,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    sku: 'PROD-008',
    name: 'External SSD 1TB',
    description: 'Portable External SSD',
    price: 3500,
    stock: 40,
    category: 'Storage',
    minStockLevel: 20,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const seedOrders = [
  {
    orderNumber: 'ORD-2024-001',
    customerId: 'customer-1',
    customerName: 'Acme Corporation',
    items: [
      {
        productId: 'product-1',
        productName: 'Laptop Pro 15"',
        quantity: 10,
        unitPrice: 25000,
        total: 250000,
      },
      {
        productId: 'product-4',
        productName: 'Monitor 27" 4K',
        quantity: 10,
        unitPrice: 12000,
        total: 120000,
      },
    ],
    subtotal: 370000,
    tax: 66600,
    total: 436600,
    status: 'delivered',
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-15'),
    createdBy: 'user-1',
  },
  {
    orderNumber: 'ORD-2024-002',
    customerId: 'customer-2',
    customerName: 'Tech Solutions Ltd',
    items: [
      {
        productId: 'product-5',
        productName: 'Mechanical Keyboard',
        quantity: 20,
        unitPrice: 2500,
        total: 50000,
      },
      {
        productId: 'product-2',
        productName: 'Wireless Mouse',
        quantity: 25,
        unitPrice: 350,
        total: 8750,
      },
    ],
    subtotal: 58750,
    tax: 10575,
    total: 69325,
    status: 'processing',
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-25'),
    createdBy: 'user-1',
  },
];

const seedInvoices = [
  {
    invoiceNumber: 'INV-2024-001',
    orderId: 'order-1',
    customerId: 'customer-1',
    customerName: 'Acme Corporation',
    lines: [
      {
        description: 'Laptop Pro 15" x10',
        quantity: 10,
        unitPrice: 25000,
        total: 250000,
        taxRate: 0.18,
        taxAmount: 45000,
      },
      {
        description: 'Monitor 27" 4K x10',
        quantity: 10,
        unitPrice: 12000,
        total: 120000,
        taxRate: 0.18,
        taxAmount: 21600,
      },
    ],
    subtotal: 370000,
    taxTotal: 66600,
    total: 436600,
    paymentStatus: 'paid',
    dueDate: new Date('2024-11-01'),
    paidDate: new Date('2024-10-28'),
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-28'),
  },
  {
    invoiceNumber: 'INV-2024-002',
    orderId: 'order-2',
    customerId: 'customer-2',
    customerName: 'Tech Solutions Ltd',
    lines: [
      {
        description: 'Mechanical Keyboard x20',
        quantity: 20,
        unitPrice: 2500,
        total: 50000,
        taxRate: 0.18,
        taxAmount: 9000,
      },
      {
        description: 'Wireless Mouse x25',
        quantity: 25,
        unitPrice: 350,
        total: 8750,
        taxRate: 0.18,
        taxAmount: 1575,
      },
    ],
    subtotal: 58750,
    taxTotal: 10575,
    total: 69325,
    paymentStatus: 'unpaid',
    dueDate: new Date('2024-11-30'),
    hasAnomaly: true,
    anomalyReason: 'Unusual discount pattern detected',
    createdAt: new Date('2024-10-25'),
    updatedAt: new Date('2024-10-25'),
  },
];

const seedPayments = [
  {
    invoiceId: 'invoice-1',
    invoiceNumber: 'INV-2024-001',
    customerId: 'customer-1',
    customerName: 'Acme Corporation',
    amount: 436600,
    paymentMethod: 'bank_transfer',
    status: 'completed',
    transactionId: 'TXN-20241028-001',
    paymentDate: new Date('2024-10-28'),
    createdAt: new Date('2024-10-28'),
    updatedAt: new Date('2024-10-28'),
  },
];

const seedKPI = [
  {
    month: '2024-10',
    totalOrders: 142,
    totalRevenue: 2840000,
    averageOrderValue: 20000,
    dso: 35,
    stockRiskItems: 12,
    pendingPayments: 450000,
    customerCount: 45,
    lowStockAlerts: 6,
    createdAt: new Date('2024-10-31'),
    updatedAt: new Date('2024-10-31'),
  },
];

const seedNarratives = [
  {
    month: '2024-10',
    summaryPoints: [
      'Revenue increased by 15% compared to previous month',
      'Average DSO improved from 42 to 35 days',
      '6 products are below minimum stock levels',
      'Customer segment A showing strong growth',
    ],
    recommendedActions: [
      'Restock low-inventory items: Wireless Mouse, Monitor 27", Webcam HD',
      'Follow up on 3 overdue invoices totaling ₺125,000',
      'Review pricing strategy for segment C customers',
      'Implement automatic reorder points for critical items',
    ],
    dataSource: {
      ordersAnalyzed: 142,
      invoicesAnalyzed: 138,
      kpiReferences: ['kpi-2024-10'],
    },
    confidence: 87,
    generatedAt: new Date('2024-10-31'),
    createdBy: 'ai-system',
  },
];

// Seed all collections with test data
export async function seedAllData() {
  console.log('🌱 Starting data seeding...');

  try {
    // 1. Seed Customers
    console.log('📋 Seeding customers...');
    const customerIds: string[] = [];
    for (const customer of seedCustomers) {
      const id = await customersService.create(customer);
      customerIds.push(id);
      console.log(`✅ Created customer: ${customer.name}`);
    }

    // 2. Seed Products
    console.log('📦 Seeding products...');
    const productIds: string[] = [];
    for (const product of seedProducts) {
      const id = await productsService.create(product);
      productIds.push(id);
      console.log(`✅ Created product: ${product.name}`);
    }

    // 3. Seed Orders (update with real customer/product IDs)
    console.log('🛒 Seeding orders...');
    const orderIds: string[] = [];
    for (let i = 0; i < seedOrders.length; i++) {
      const order = {
        ...seedOrders[i],
        customerId: customerIds[i % customerIds.length],
        items: seedOrders[i].items.map((item, idx) => ({
          ...item,
          productId: productIds[idx % productIds.length],
        })),
      };
      const id = await ordersService.create(order);
      orderIds.push(id);
      console.log(`✅ Created order: ${order.orderNumber}`);
    }

    // 4. Seed Invoices (update with real order/customer IDs)
    console.log('📄 Seeding invoices...');
    const invoiceIds: string[] = [];
    for (let i = 0; i < seedInvoices.length; i++) {
      const invoice = {
        ...seedInvoices[i],
        orderId: orderIds[i % orderIds.length],
        customerId: customerIds[i % customerIds.length],
      };
      const id = await invoicesService.create(invoice);
      invoiceIds.push(id);
      console.log(`✅ Created invoice: ${invoice.invoiceNumber}`);
    }

    // 5. Seed Payments (update with real invoice/customer IDs)
    console.log('💰 Seeding payments...');
    for (let i = 0; i < seedPayments.length; i++) {
      const payment = {
        ...seedPayments[i],
        invoiceId: invoiceIds[i % invoiceIds.length],
        customerId: customerIds[i % customerIds.length],
      };
      await paymentsService.create(payment);
      console.log(`✅ Created payment for invoice: ${payment.invoiceNumber}`);
    }

    // 6. Seed KPI
    console.log('📊 Seeding KPI data...');
    for (const kpi of seedKPI) {
      await kpiService.create(kpi);
      console.log(`✅ Created KPI for month: ${kpi.month}`);
    }

    // 7. Seed Narratives
    console.log('🤖 Seeding AI narratives...');
    for (const narrative of seedNarratives) {
      await narrativesService.create(narrative);
      console.log(`✅ Created narrative for month: ${narrative.month}`);
    }

    console.log('🎉 Data seeding completed successfully!');
    return {
      success: true,
      counts: {
        customers: customerIds.length,
        products: productIds.length,
        orders: orderIds.length,
        invoices: invoiceIds.length,
        payments: seedPayments.length,
        kpi: seedKPI.length,
        narratives: seedNarratives.length,
      },
    };
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// Clear all data (use with caution!)
export async function clearAllData() {
  console.log('🗑️ Clearing all data...');

  try {
    // Get all documents and delete them
    const collections = [
      { service: customersService, name: 'customers' },
      { service: productsService, name: 'products' },
      { service: ordersService, name: 'orders' },
      { service: invoicesService, name: 'invoices' },
      { service: paymentsService, name: 'payments' },
      { service: kpiService, name: 'kpi' },
      { service: narrativesService, name: 'narratives' },
    ];

    for (const { service, name } of collections) {
      const items = await service.getAll();
      for (const item of items) {
        await service.delete(item.id);
      }
      console.log(`✅ Cleared ${name}: ${items.length} items deleted`);
    }

    console.log('🎉 All data cleared successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}
