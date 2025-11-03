import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { getLatestKPI, getLowStockProducts } from '../services/firestoreService';
import { seedAllData } from '../utils/seedFirestore';

export default function Dashboard() {
  const { currentKPI, setCurrentKPI, products, setProducts } = useStore();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  useEffect(() => {
    // Load KPI data
    const loadData = async () => {
      try {
        const kpi = await getLatestKPI();
        setCurrentKPI(kpi);

        const lowStock = await getLowStockProducts();
        setProducts(lowStock);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, [setCurrentKPI, setProducts]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle seed data
  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedMessage('🌱 Veriler yükleniyor...');

    try {
      const result = await seedAllData();
      setSeedMessage(`✅ Veriler başarıyla yüklendi! ${result.counts.customers} müşteri, ${result.counts.products} ürün, ${result.counts.orders} sipariş eklendi.`);

      // Reload dashboard data
      const kpi = await getLatestKPI();
      setCurrentKPI(kpi);
      const lowStock = await getLowStockProducts();
      setProducts(lowStock);
    } catch (error) {
      setSeedMessage('❌ Hata: Veriler yüklenemedi. Console\'u kontrol edin.');
      console.error('Seed error:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="rounded-lg p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent mb-6">
          Dashboard
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* KPI Cards - Matrix/Hacker Theme */}
          <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 overflow-hidden shadow-2xl rounded-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 hover:border-emerald-400">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-emerald-600 to-green-700 p-3 rounded-lg shadow-lg">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Total Orders
                    </dt>
                    <dd className="text-2xl font-bold text-emerald-400">
                      {currentKPI?.totalOrders || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-emerald-500/30 overflow-hidden shadow-2xl rounded-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 hover:border-emerald-400">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-green-600 to-emerald-700 p-3 rounded-lg shadow-lg">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Revenue
                    </dt>
                    <dd className="text-2xl font-bold text-green-400">
                      {currentKPI
                        ? formatCurrency(currentKPI.totalRevenue)
                        : '₺0'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-yellow-500/30 overflow-hidden shadow-2xl rounded-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 hover:border-yellow-400">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-yellow-600 to-amber-700 p-3 rounded-lg shadow-lg">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Pending Payments
                    </dt>
                    <dd className="text-2xl font-bold text-yellow-400">
                      {currentKPI
                        ? formatCurrency(currentKPI.pendingPayments)
                        : '₺0'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/30 overflow-hidden shadow-2xl rounded-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 hover:border-red-400">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-red-600 to-rose-700 p-3 rounded-lg shadow-lg">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Low Stock Items
                    </dt>
                    <dd className="text-2xl font-bold text-red-400">
                      {products.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {/* Seed Data Button */}
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 border border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              {isSeeding ? 'Yükleniyor...' : 'Test Verilerini Yükle'}
            </span>
          </button>

          {/* Seed Message */}
          {seedMessage && (
            <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg p-4 text-emerald-400">
              {seedMessage}
            </div>
          )}

          {/* Generate AI Narrative Button */}
          <button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 border border-emerald-500/50">
            <span className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Generate AI Narrative
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
