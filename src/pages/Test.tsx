import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function Test() {
  const { setCurrentKPI, setProducts } = useStore();
  const [seedMessage, setSeedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="rounded-lg p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent mb-6">
          🧪 Test Paneli
        </h2>

        {/* Seed Data Button */}
        <button
          onClick={async () => {
            setIsLoading(true);
            setSeedMessage('🌱 Firebase yükleniyor...');

            try {
              // Dynamic import to avoid initial load issues
              const { seedAllData } = await import('../utils/seedFirestore');
              const { getLatestKPI, getLowStockProducts } = await import('../services/firestoreService');

              setSeedMessage('📦 Veriler yükleniyor...');
              const result = await seedAllData();

              setSeedMessage(`✅ Başarılı! ${result.counts.customers} müşteri, ${result.counts.products} ürün, ${result.counts.orders} sipariş eklendi!`);

              // Reload data
              const kpi = await getLatestKPI();
              setCurrentKPI(kpi);

              const lowStock = await getLowStockProducts();
              setProducts(lowStock);

            } catch (error: any) {
              setSeedMessage(`❌ Hata: ${error.message || 'Beklenmeyen hata'}`);
              console.error('Seed error:', error);
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 border border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳ Yükleniyor...' : '🚀 Test Verilerini Yükle'}
        </button>

        {seedMessage && (
          <div className="mt-4 bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg p-4 text-emerald-400">
            {seedMessage}
          </div>
        )}
      </div>
    </div>
  );
}
