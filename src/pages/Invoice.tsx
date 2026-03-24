import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function Invoice() {
  const { invoices, setInvoices } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const { invoicesService } = await import('../services/firestoreService');
      const data = await invoicesService.getAll();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
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

  const formatDate = (date: { toDate: () => Date } | Date | null | undefined) => {
    if (!date) return '-';
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleDateString('tr-TR');
  };

  const getPaymentBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      paid: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Ödendi' },
      partial: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Kısmi' },
      unpaid: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Ödenmedi' },
      overdue: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Gecikmiş' },
    };

    const config = statusConfig[status] || statusConfig.unpaid;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border border-emerald-500/30`}>
        {config.label}
      </span>
    );
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (filter === 'paid') return invoice.paymentStatus === 'paid';
    if (filter === 'unpaid') return invoice.paymentStatus === 'unpaid';
    if (filter === 'overdue') return invoice.paymentStatus === 'overdue';
    return true;
  });

  const paidCount = invoices.filter((i) => i.paymentStatus === 'paid').length;
  const unpaidCount = invoices.filter((i) => i.paymentStatus === 'unpaid').length;

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="rounded-lg p-8 text-center">
          <div className="text-emerald-400 text-xl">⏳ Faturalar yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            📄 Faturalar
          </h2>
          <div className="text-gray-400">
            Toplam: <span className="text-emerald-400 font-bold">{invoices.length}</span> fatura
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Tümü ({invoices.length})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'paid'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Ödendi ({paidCount})
          </button>
          <button
            onClick={() => setFilter('unpaid')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'unpaid'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Ödenmedi ({unpaidCount})
          </button>
        </div>

        {/* Invoices Table */}
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
                    Vade
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
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                      {filter === 'all'
                        ? 'Henüz fatura bulunmuyor. Dashboard\'dan test verilerini yükleyin.'
                        : 'Bu filtrede fatura bulunmuyor.'}
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-emerald-950/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-300">
                        {invoice.invoiceNumber}
                        {invoice.hasAnomaly && (
                          <span className="ml-2 text-orange-400" title={invoice.anomalyReason}>
                            ⚠️
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {invoice.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getPaymentBadge(invoice.paymentStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoice(invoice);
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

        {/* Invoice Detail Modal */}
        {selectedInvoice && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedInvoice(null)}
          >
            <div
              className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-emerald-950 border-b border-emerald-500/30 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-400">
                      {selectedInvoice.invoiceNumber}
                    </h3>
                    <p className="text-gray-400 mt-1">{selectedInvoice.customerName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Invoice Info */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Fatura Tarihi</p>
                    <p className="text-emerald-300 font-medium">{formatDate(selectedInvoice.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Vade Tarihi</p>
                    <p className="text-emerald-300 font-medium">{formatDate(selectedInvoice.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Durum</p>
                    <div className="mt-1">{getPaymentBadge(selectedInvoice.paymentStatus)}</div>
                  </div>
                </div>

                {/* Anomaly Warning */}
                {selectedInvoice.hasAnomaly && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-orange-400 text-xl">⚠️</span>
                      <div>
                        <p className="text-orange-400 font-semibold">Anomali Tespit Edildi</p>
                        <p className="text-gray-300 text-sm mt-1">{selectedInvoice.anomalyReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Invoice Lines */}
                <div>
                  <h4 className="text-emerald-400 font-semibold mb-3">Fatura Kalemleri</h4>
                  <div className="space-y-2">
                    {selectedInvoice.lines?.map((line: import('../data/types').InvoiceLine, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-900/50 border border-emerald-500/20 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-emerald-300 font-medium">{line.description}</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {line.quantity} adet × {formatCurrency(line.unitPrice)} + KDV ({(line.taxRate * 100).toFixed(0)}%)
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-semibold">{formatCurrency(line.total + line.taxAmount)}</p>
                            <p className="text-xs text-gray-400">KDV: {formatCurrency(line.taxAmount)}</p>
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
                    <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>KDV:</span>
                    <span>{formatCurrency(selectedInvoice.taxTotal)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-emerald-400 border-t border-emerald-500/30 pt-2">
                    <span>Toplam:</span>
                    <span>{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>

                {/* Payment Info */}
                {selectedInvoice.paymentStatus === 'paid' && selectedInvoice.paidDate && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <p className="text-emerald-400 font-semibold">
                      ✅ Ödeme Alındı: {formatDate(selectedInvoice.paidDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
