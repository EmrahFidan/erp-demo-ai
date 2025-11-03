import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { logEvent } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';

export default function Stock() {
  const { products, setProducts } = useStore();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'low' | 'ok'>('all');

  const handleStockOrder = async (product: any) => {
    try {
      await logEvent({
        type: 'stockOrderRequested',
        productId: product.id,
        productName: product.name,
        currentStock: product.stock,
        minStockLevel: product.minStockLevel,
        userId: user?.uid || 'unknown',
        details: `Stok sipariş talebi: ${product.name} - Mevcut: ${product.stock}, Min: ${product.minStockLevel}`,
      });
      toast.success(`${product.name} için stok sipariş talebi oluşturuldu!`);
    } catch (error) {
      console.error('Error logging stock order:', error);
      toast.error('Hata oluştu!');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const { productsService } = await import('../services/firestoreService');
      const data = await productsService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
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

  const getStockStatus = (product: any) => {
    if (product.stock <= product.minStockLevel) {
      return { label: 'Düşük Stok', color: 'red', icon: '⚠️' };
    }
    return { label: 'Normal', color: 'emerald', icon: '✅' };
  };

  const filteredProducts = products.filter((product) => {
    if (filter === 'low') return product.stock <= product.minStockLevel;
    if (filter === 'ok') return product.stock > product.minStockLevel;
    return true;
  });

  const lowStockCount = products.filter((p) => p.stock <= p.minStockLevel).length;

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="rounded-lg p-8 text-center">
          <div className="text-emerald-400 text-xl">⏳ Stok verileri yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            📊 Stok Yönetimi
          </h2>
          <div className="text-gray-400">
            Toplam: <span className="text-emerald-400 font-bold">{products.length}</span> ürün
            {lowStockCount > 0 && (
              <span className="ml-3 text-red-400">
                | Düşük Stok: <span className="font-bold">{lowStockCount}</span>
              </span>
            )}
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
            Tümü ({products.length})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'low'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Düşük Stok ({lowStockCount})
          </button>
          <button
            onClick={() => setFilter('ok')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'ok'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Normal Stok ({products.length - lowStockCount})
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              {filter === 'all'
                ? 'Henüz ürün bulunmuyor. Dashboard\'dan test verilerini yükleyin.'
                : 'Bu filtrede ürün bulunmuyor.'}
            </div>
          ) : (
            filteredProducts.map((product) => {
              const status = getStockStatus(product);
              return (
                <div
                  key={product.id}
                  className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg p-6 hover:shadow-xl hover:shadow-emerald-500/10 transition-all"
                >
                  {/* Product Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-emerald-300">{product.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{product.sku}</p>
                    </div>
                    <span className="text-2xl">{status.icon}</span>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 uppercase">Kategori</p>
                      <p className="text-sm text-gray-300">{product.category}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 uppercase">Fiyat</p>
                      <p className="text-lg font-bold text-green-400">{formatCurrency(product.price)}</p>
                    </div>

                    {/* Stock Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-400 uppercase">Stok Durumu</p>
                        <span
                          className={`text-xs font-semibold text-${status.color}-400`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full bg-${status.color}-500 transition-all`}
                          style={{
                            width: `${Math.min((product.stock / product.minStockLevel) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          Mevcut: <span className="font-semibold text-emerald-300">{product.stock}</span>
                        </span>
                        <span className="text-xs text-gray-400">
                          Min: <span className="font-semibold text-yellow-300">{product.minStockLevel}</span>
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {product.description && (
                      <div>
                        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {product.stock <= product.minStockLevel && (
                    <div className="mt-4 pt-4 border-t border-emerald-500/20">
                      <button
                        onClick={() => handleStockOrder(product)}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                      >
                        🔔 Stok Sipariş Et
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
