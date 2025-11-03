import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import CreateOrderModal from '../components/CreateOrderModal';

export default function Orders() {
  const { orders, setOrders } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const { ordersService } = await import('../services/firestoreService');
      const data = await ordersService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('tr-TR');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      delivered: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Teslim Edildi' },
      processing: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'İşleniyor' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'İptal' },
      pending: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Bekliyor' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border border-emerald-500/30`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="rounded-lg p-8 text-center">
          <div className="text-emerald-400 text-xl">⏳ Siparişler yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            📦 Siparişler
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-gray-400">
              Toplam: <span className="text-emerald-400 font-bold">{orders.length}</span> sipariş
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              + Yeni Sipariş
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-500/20">
              <thead className="bg-emerald-950/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Sipariş No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      Henüz sipariş bulunmuyor. Dashboard'dan test verilerini yükleyin.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-emerald-950/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-300">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          Detay →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-emerald-950 border-b border-emerald-500/30 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-400">
                      {selectedOrder.orderNumber}
                    </h3>
                    <p className="text-gray-400 mt-1">{selectedOrder.customerName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Sipariş Tarihi</p>
                    <p className="text-emerald-300 font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Durum</p>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-emerald-400 font-semibold mb-3">Sipariş Kalemleri</h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-900/50 border border-emerald-500/20 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-emerald-300 font-medium">{item.productName}</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {item.quantity} adet × {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-semibold">{formatCurrency(item.total)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-emerald-500/20 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Ara Toplam:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>KDV (%18):</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-emerald-400 border-t border-emerald-500/30 pt-2">
                    <span>Toplam:</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Order Modal */}
        {showCreateModal && (
          <CreateOrderModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              loadOrders();
              setShowCreateModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
