import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { customersService, productsService, ordersService, logEvent } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';

interface CreateOrderModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOrderModal({ onClose, onSuccess }: CreateOrderModalProps) {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [orderItems, setOrderItems] = useState<
    Array<{ productId: string; quantity: number }>
  >([{ productId: '', quantity: 1 }]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersData, productsData] = await Promise.all([
        customersService.getAll(),
        productsService.getAll(),
      ]);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  const calculateOrder = () => {
    let subtotal = 0;
    const items = orderItems
      .filter((item) => item.productId && item.quantity > 0)
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        const unitPrice = product.price;
        const total = unitPrice * item.quantity;
        subtotal += total;

        return {
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice,
          total,
        };
      })
      .filter(Boolean);

    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    return { items, subtotal, tax, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || orderItems.length === 0) return;

    setSubmitting(true);
    try {
      const customer = customers.find((c) => c.id === selectedCustomer);
      const { items, subtotal, tax, total } = calculateOrder();

      if (items.length === 0) {
        toast.error('Lütfen en az bir ürün seçin!');
        setSubmitting(false);
        return;
      }

      // Generate order number
      const orderNumber = `ORD-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 9999)
      ).padStart(4, '0')}`;

      // Create order
      const orderId = await ordersService.create({
        orderNumber,
        customerId: customer.id,
        customerName: customer.name,
        items,
        subtotal,
        tax,
        total,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user?.uid || 'unknown',
      });

      // Log event
      await logEvent({
        type: 'orderCreated',
        orderId,
        orderNumber,
        customerId: customer.id,
        customerName: customer.name,
        total,
        userId: user?.uid || 'unknown',
        details: `Yeni sipariş oluşturuldu: ${orderNumber} - ${customer.name} - ₺${total.toFixed(2)}`,
      });

      toast.success('Sipariş başarıyla oluşturuldu!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Sipariş oluşturulurken hata oluştu!');
    } finally {
      setSubmitting(false);
    }
  };

  const { subtotal, tax, total } = calculateOrder();

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-emerald-950 border-b border-emerald-500/30 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-emerald-400">📦 Yeni Sipariş Oluştur</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-emerald-400 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-8 text-center text-emerald-400">⏳ Yükleniyor...</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer Selection */}
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-2">
                Müşteri Seçin *
              </label>
              <select
                required
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full bg-gray-900 border border-emerald-500/30 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Müşteri Seçin --</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.segment})
                  </option>
                ))}
              </select>
            </div>

            {/* Order Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-emerald-400">
                  Sipariş Kalemleri *
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded transition-colors"
                >
                  + Ürün Ekle
                </button>
              </div>

              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/50 border border-emerald-500/20 rounded-lg p-4 flex gap-3 items-end"
                  >
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">Ürün</label>
                      <select
                        required
                        value={item.productId}
                        onChange={(e) => updateItem(index, 'productId', e.target.value)}
                        className="w-full bg-gray-900 border border-emerald-500/30 rounded px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">-- Ürün Seçin --</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ₺{product.price} (Stok: {product.stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-32">
                      <label className="block text-xs text-gray-400 mb-1">Adet</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, 'quantity', parseInt(e.target.value) || 1)
                        }
                        className="w-full bg-gray-900 border border-emerald-500/30 rounded px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {orderItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-300 px-3 py-2"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-900/50 border border-emerald-500/20 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Ara Toplam:</span>
                <span>₺{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>KDV (%18):</span>
                <span>₺{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-emerald-400 border-t border-emerald-500/30 pt-2">
                <span>Toplam:</span>
                <span>₺{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedCustomer || orderItems.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '⏳ Oluşturuluyor...' : '✅ Sipariş Oluştur'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
