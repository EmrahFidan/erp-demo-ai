import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function Payment() {
  const { payments, setPayments } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const { paymentsService } = await import('../services/firestoreService');
      const data = await paymentsService.getAll();
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
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

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      bank_transfer: '🏦 Banka Transferi',
      credit_card: '💳 Kredi Kartı',
      cash: '💵 Nakit',
      check: '📝 Çek',
    };
    return labels[method] || method;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      completed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Tamamlandı' },
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Bekliyor' },
      failed: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Başarısız' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border border-emerald-500/30`}>
        {config.label}
      </span>
    );
  };

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedAmount = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="rounded-lg p-8 text-center">
          <div className="text-emerald-400 text-xl">⏳ Ödemeler yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            💰 Ödemeler
          </h2>
          <div className="text-gray-400">
            Toplam: <span className="text-emerald-400 font-bold">{payments.length}</span> ödeme
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 uppercase">Toplam Ödeme</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">{formatCurrency(totalAmount)}</p>
              </div>
              <div className="text-5xl">💵</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-green-950/50 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 uppercase">Tamamlanan Ödemeler</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{formatCurrency(completedAmount)}</p>
              </div>
              <div className="text-5xl">✅</div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-500/20">
              <thead className="bg-emerald-950/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Fatura No
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
                    Yöntem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    İşlem ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      Henüz ödeme bulunmuyor. Dashboard'dan test verilerini yükleyin.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-emerald-950/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-300">
                        {payment.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {payment.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {getPaymentMethodLabel(payment.paymentMethod)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                        {payment.transactionId || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods Summary */}
        {payments.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {['bank_transfer', 'credit_card', 'cash', 'check'].map((method) => {
              const methodPayments = payments.filter((p) => p.paymentMethod === method);
              const methodTotal = methodPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

              if (methodPayments.length === 0) return null;

              return (
                <div
                  key={method}
                  className="bg-gradient-to-br from-gray-900 to-emerald-950/30 border border-emerald-500/20 rounded-lg p-4"
                >
                  <p className="text-xs text-gray-400 uppercase mb-2">{getPaymentMethodLabel(method)}</p>
                  <p className="text-lg font-bold text-emerald-400">{formatCurrency(methodTotal)}</p>
                  <p className="text-xs text-gray-500 mt-1">{methodPayments.length} işlem</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
