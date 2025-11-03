import { useStore } from '../store/useStore';

export default function Dashboard() {
  const { currentKPI, products } = useStore();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="rounded-lg p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent mb-6">
          Dashboard
        </h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg p-5">
            <p className="text-sm font-medium text-gray-400">Toplam Sipariş</p>
            <p className="text-2xl font-bold text-emerald-400">{currentKPI?.totalOrders || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-emerald-500/30 rounded-lg p-5">
            <p className="text-sm font-medium text-gray-400">Toplam Gelir</p>
            <p className="text-2xl font-bold text-green-400">
              {currentKPI ? formatCurrency(currentKPI.totalRevenue) : '₺0'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-yellow-500/30 rounded-lg p-5">
            <p className="text-sm font-medium text-gray-400">Bekleyen Ödemeler</p>
            <p className="text-2xl font-bold text-yellow-400">
              {currentKPI ? formatCurrency(currentKPI.pendingPayments) : '₺0'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/30 rounded-lg p-5">
            <p className="text-sm font-medium text-gray-400">Düşük Stoklu Ürünler</p>
            <p className="text-2xl font-bold text-red-400">{products.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
