import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { logEvent } from '../services/firestoreService';

export default function Narrative() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [narratives, setNarratives] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedNarratives, setExpandedNarratives] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadNarratives();
  }, []);

  const toggleNarrative = (id: string) => {
    setExpandedNarratives(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const loadNarratives = async () => {
    try {
      setIsLoading(true);
      const { narrativesService } = await import('../services/firestoreService');
      const data = await narrativesService.getAll();

      // Sort by createdAt descending (newest first)
      const sortedData = data.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      console.log('📊 Loaded narratives from Firestore (newest first):', sortedData);
      setNarratives(sortedData);
    } catch (error) {
      console.error('❌ Error loading narratives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      // Import services
      const {
        narrativesService,
        kpiService,
        ordersService,
        productsService,
        invoicesService,
        paymentsService
      } = await import('../services/firestoreService');

      // Get ALL current data for AI analysis
      const [kpis, orders, products, invoices, payments] = await Promise.all([
        kpiService.getAll(),
        ordersService.getAll(),
        productsService.getAll(),
        invoicesService.getAll(),
        paymentsService.getAll(),
      ]);

      const currentKPI = kpis[0];
      const period = new Date();

      // Build context for Gemini AI
      const contextData = `
ERP SİSTEM VERİLERİ:

KPI ÖZET:
- Toplam Sipariş: ${currentKPI?.totalOrders || 0}
- Toplam Gelir: ₺${currentKPI?.totalRevenue || 0}
- DSO: ${currentKPI?.dso || 0} gün
- Bekleyen Ödemeler: ₺${currentKPI?.pendingPayments || 0}
- Düşük Stok Uyarıları: ${currentKPI?.lowStockAlerts || 0}

SİPARİŞLER (${orders.length} adet):
${orders.map(o => `- ${o.orderNumber}: ${o.customerName}, Durum: ${o.status}, Tutar: ₺${o.total}`).join('\n')}

ÜRÜNLER (${products.length} adet):
${products.map(p => `- ${p.name}: Stok ${p.stock}/${p.minStockLevel}, Fiyat: ₺${p.price}`).join('\n')}

FATURALAR (${invoices.length} adet):
${invoices.map(i => `- ${i.invoiceNumber}: ${i.customerName}, Durum: ${i.paymentStatus}, Tutar: ₺${i.total}${i.hasAnomaly ? ' [ANOMALI]' : ''}`).join('\n')}

ÖDEMELER (${payments.length} adet):
${payments.map(p => `- ${p.invoiceNumber}: ₺${p.amount}, Yöntem: ${p.paymentMethod}, Durum: ${p.status}`).join('\n')}
`;

      // Call Gemini API
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        toast.error('Gemini API key bulunamadı. Lütfen .env.local dosyasına VITE_GEMINI_API_KEY ekleyin.');
        return;
      }

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Sen profesyonel bir ERP sistem analistisin. Türkçe analiz yapıyorsun.

GÖREV: Aşağıdaki ERP sistem verilerini DETAYLIca analiz et ve JSON formatında bir rapor oluştur.

${contextData}

ÖNEMLİ TALİMATLAR:
1. ÖZET BÖLÜMÜNÜ MADDE MADDE YAZ (her madde ayrı satır, "-" ile başlasın)
2. Her maddede SPESIFIK RAKAMLAR kullan (örn: "12 sipariş", "₺35,000 ödeme", "8 ürün")
3. GENEL CÜMLELER KULLANMA! Spesifik müşteri/ürün adları, tutar, sayılar belirt
4. Hangi müşteriden, hangi üründen, ne kadar olduğunu açıkça yaz
5. Sorunları ve başarıları SOMUT ÖRNEKLERLE açıkla

ÇIKTI FORMATI (TAM OLARAK BU FORMATTA):
{
  "summary": "- İlk bulgu (örn: 'Acme Corporation'dan 5 adet ORD-2024-001 siparişi bekliyor, toplam ₺436,600')\n- İkinci bulgu (örn: 'Tech Solutions Ltd firmasından ₺69,325'lik ödeme 15 gün gecikmiş')\n- Üçüncü bulgu (örn: 'Wireless Mouse stoğu kritik: 5/20')\n- Dördüncü bulgu (örn: 'Toplam 142 siparişten 12'si detayları eksik')\n- Beşinci bulgu (isteğe bağlı, spesifik rakam içermeli)",
  "dataPoints": [
    {"label": "Toplam Sipariş", "value": "sayı", "change": "+X% veya -X%"},
    {"label": "Toplam Gelir", "value": "₺X", "change": "+X% veya -X%"},
    {"label": "Bekleyen Ödemeler", "value": "₺X", "change": "+X% veya -X%"},
    {"label": "DSO", "value": "X gün", "change": "-X gün veya +X gün"},
    {"label": "Düşük Stok Uyarıları", "value": "sayı", "change": "+X veya -X"},
    {"label": "Ödeme Başarı Oranı", "value": "%X", "change": "+X% veya -X%"}
  ],
  "recommendedActions": [
    "SPESIFIK aksiyon (müşteri/ürün adı + tutar/miktar içermeli, örn: 'TechStart firmasından ₺28,500'lik ödemeyi 3 gün içinde takip edin')",
    "SPESIFIK aksiyon (örn: 'Wireless Mouse için acil 50 adet sipariş verin, stok 5/30 seviyesinde')",
    "SPESIFIK aksiyon (örn: 'Acme Corp ile yüksek hacim nedeniyle (₺125,000) aylık toplantı planlayın')",
    "SPESIFIK aksiyon (örn: 'ORD-0123 numaralı siparişin sevkiyatını hızlandırın, 7 gündür bekliyor')",
    "SPESIFIK aksiyon (örn: 'INV-0456 faturası için %10 erken ödeme indirimi önerin, ₺35,000')"
  ]
}

ÖNEMLİ UYARILAR:
1. "summary" alanında SADECE maddeleri yaz, başlık YAZMA!
2. "MADDE MADDE ÖZET" gibi açıklayıcı metinler YAZMA!
3. Direkt "-" ile başla, örneği taklit et
4. Her madde spesifik rakam içermeli

ÖRNEKLER:
✅ DOĞRU summary formatı:
"- Acme Corp'dan 5 sipariş bekliyor (₺436,600)\n- Tech Solutions ₺69,325 ödeme gecikmiş\n- Wireless Mouse stoğu 5/20"

❌ YANLIŞ - Başlık ekleme:
"MADDE MADDE ÖZET:\n- Acme Corp'dan..."

SADECE JSON DÖNDÜR, BAŞKA BİR ŞEY YAZMA!`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1500,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        toast.error(`Gemini API Hatası (${response.status}): ${errorData?.error?.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponseText) {
        toast.error('Gemini API yanıtı boş geldi');
        return;
      }

      console.log('🤖 GEMINI AI YANITI:', aiResponseText);

      // Parse AI response
      let aiResponse;
      try {
        const cleanedText = aiResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        aiResponse = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('AI yanıtı parse edilemedi:', aiResponseText);
        toast.error('AI yanıtı beklenmedik formatta');
        return;
      }

      // Create narrative with AI-generated content
      const narrative = {
        period,
        summary: aiResponse.summary,
        dataPoints: aiResponse.dataPoints,
        recommendedActions: aiResponse.recommendedActions,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await narrativesService.create(narrative);

      // Log event
      await logEvent({
        type: 'narrativeGenerated',
        details: 'Gemini AI ile Narrative oluşturuldu',
        userId: user?.uid || 'system',
      });

      // Reload narratives
      await loadNarratives();

      toast.success('✅ Gemini AI ile yeni rapor oluşturuldu!');
    } catch (error: any) {
      console.error('Error refreshing narrative:', error);
      toast.error(`Hata: ${error.message || 'Beklenmeyen hata'}`);
    } finally {
      setRefreshing(false);
    }
  };

  const handleActionCheck = async (narrative: any, actionIndex: number) => {
    try {
      const action = narrative.recommendedActions[actionIndex];

      await logEvent({
        type: 'narrativeActionReviewed',
        narrativeId: narrative.id,
        action: action,
        userId: user?.uid || 'unknown',
        details: `Aksiyon gözden geçirildi: ${action}`,
      });

      console.log('Action reviewed:', action);
    } catch (error) {
      console.error('Error logging action review:', error);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="rounded-lg p-8 text-center">
          <div className="text-emerald-400 text-xl">⏳ AI Narrative yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            🤖 AI Narrative
          </h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {refreshing ? '⏳ Yenileniyor...' : '🔄 Raporu Yenile'}
          </button>
        </div>

        {narratives.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              Henüz AI narrative bulunmuyor. Dashboard'dan test verilerini yükleyin.
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {narratives.map((narrative) => {
              const isExpanded = expandedNarratives.has(narrative.id);

              return (
                <div
                  key={narrative.id}
                  className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all"
                >
                  {/* Clickable Header */}
                  <div
                    onClick={() => toggleNarrative(narrative.id)}
                    className="cursor-pointer p-6 hover:bg-emerald-500/5 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-emerald-300">
                            {formatDate(narrative.period)}
                          </h3>
                          <span className="text-emerald-400">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Oluşturulma: {new Date(narrative.createdAt).toLocaleString('tr-TR')}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        AI Generated
                      </span>
                    </div>

                    {/* Summary - always visible */}
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-400 mb-2">📊 Özet</h4>
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {narrative.summary}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Details - only shown when expanded */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-emerald-500/20 pt-6">
                      {/* Data Points */}
                      {narrative.dataPoints && narrative.dataPoints.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-emerald-400 mb-3">
                            📈 Önemli Veriler
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {narrative.dataPoints.map((point: any, index: number) => (
                              <div
                                key={index}
                                className="bg-gray-900/50 border border-emerald-500/20 rounded-lg p-3"
                              >
                                <p className="text-xs text-gray-400 uppercase">{point.label}</p>
                                <p className="text-lg font-bold text-emerald-300 mt-1">
                                  {point.value}
                                </p>
                                {point.change && (
                                  <p
                                    className={`text-xs mt-1 ${
                                      point.change.startsWith('+')
                                        ? 'text-green-400'
                                        : point.change.startsWith('-')
                                        ? 'text-red-400'
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {point.change}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommended Actions */}
                      {narrative.recommendedActions && narrative.recommendedActions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-emerald-400 mb-3">
                            💡 Önerilen Aksiyonlar
                          </h4>
                          <div className="space-y-2">
                            {narrative.recommendedActions.map((action: string, index: number) => (
                              <label
                                key={index}
                                className="flex items-start gap-3 p-3 bg-gray-900/50 border border-emerald-500/20 rounded-lg hover:bg-gray-900 cursor-pointer transition-all"
                              >
                                <input
                                  type="checkbox"
                                  onChange={() => handleActionCheck(narrative, index)}
                                  className="mt-0.5 w-4 h-4 rounded border-emerald-500/30 bg-gray-800 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                                />
                                <span className="text-sm text-gray-300 flex-1">{action}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
