import { useState, useEffect, useRef } from 'react';
import { auth } from '../services/firebase';

export default function AIChat() {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [erpContext, setErpContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadERPContext();
    loadInitialMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadERPContext = async () => {
    setIsLoading(true);
    try {
      const {
        ordersService,
        productsService,
        invoicesService,
        paymentsService,
        kpiService,
      } = await import('../services/firestoreService');

      const [orders, products, invoices, payments, kpis] = await Promise.all([
        ordersService.getAll(),
        productsService.getAll(),
        invoicesService.getAll(),
        paymentsService.getAll(),
        kpiService.getAll(),
      ]);

      setErpContext({
        orders,
        products,
        invoices,
        payments,
        kpi: kpis[0] || null,
      });
    } catch (error) {
      console.error('Error loading ERP context:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialMessages = async () => {
    try {
      const { chatsService } = await import('../services/firestoreService');
      const userId = auth.currentUser?.uid || 'anonymous';

      // Get or create chat session for user
      const existingChats = await chatsService.getAll();
      const userChat = existingChats.find((chat: any) => chat.userId === userId);

      if (userChat && userChat.messages && userChat.messages.length > 0) {
        // Load last 10 messages
        const lastMessages = userChat.messages.slice(-10);
        setMessages(lastMessages);
      } else {
        // Default welcome message
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: 'Merhaba! Ben Gemini AI destekli ERP asistanınızım. Gerçek verilerinizi analiz edebilirim. Size nasıl yardımcı olabilirim?',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Fallback to default message
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Merhaba! Ben Gemini AI destekli ERP asistanınızım. Gerçek verilerinizi analiz edebilirim. Size nasıl yardımcı olabilirim?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const getGeminiResponse = async (userMessage: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return 'Gemini API key bulunamadı. Lütfen .env.local dosyasına VITE_GEMINI_API_KEY ekleyin.\n\nAPI key almak için: https://makersuite.google.com/app/apikey';
    }

    // Build context from real Firestore data
    const contextSummary = erpContext
      ? `
ERP SİSTEM VERİLERİ:

STOK DURUMU:
${erpContext.products
  .map(
    (p: any) =>
      `- ${p.name} (${p.sku}): ${p.stock} adet (Min: ${p.minStockLevel}, Fiyat: ₺${p.price})`
  )
  .join('\n')}

SİPARİŞLER:
${erpContext.orders
  .map(
    (o: any) =>
      `- ${o.orderNumber}: ${o.customerName}, Durum: ${o.status}, Tutar: ₺${o.total}`
  )
  .join('\n')}

FATURALAR:
${erpContext.invoices
  .map(
    (i: any) =>
      `- ${i.invoiceNumber}: ${i.customerName}, Durum: ${i.paymentStatus}, Tutar: ₺${i.total}${
        i.hasAnomaly ? ` [ANOMALI: ${i.anomalyReason}]` : ''
      }`
  )
  .join('\n')}

ÖDEMELER:
${erpContext.payments
  .map(
    (p: any) =>
      `- ${p.invoiceNumber}: ${p.customerName}, ₺${p.amount}, Yöntem: ${p.paymentMethod}, Durum: ${p.status}`
  )
  .join('\n')}

KPI ÖZET:
${
  erpContext.kpi
    ? `- Toplam Sipariş: ${erpContext.kpi.totalOrders}
- Toplam Gelir: ₺${erpContext.kpi.totalRevenue}
- DSO: ${erpContext.kpi.dso} gün
- Bekleyen Ödemeler: ₺${erpContext.kpi.pendingPayments}
- Düşük Stok Uyarıları: ${erpContext.kpi.lowStockAlerts}`
    : 'KPI verisi yok'
}
`
      : 'Henüz ERP verisi yüklenmedi.';

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Sen yardımcı ve arkadaş canlısı bir ERP sistemi asistanısın. Türkçe konuşuyorsun.

SİSTEM HAKKINDA BİLGİ:
Bu bir demo ERP (Enterprise Resource Planning) sistemidir. Şu teknolojilerle çalışıyor:
- Frontend: React + TypeScript + Vite
- Veritasen: Firebase Firestore (gerçek zamanlı NoSQL veritabanı)
- AI: Google Gemini 2.0 Flash (sensin!)
- Tasarım: Tailwind CSS (Matrix/Hacker temalı - siyah/yeşil)
- Sayfalar: Dashboard, Siparişler, Stok, Faturalar, Ödemeler, AI Chat (burasın!)

Sen Firestore'daki GERÇEK verileri analiz edip kullanıcıya yardımcı oluyorsun.

ERP SİSTEM VERİLERİ:
${contextSummary}

KULLANICI: ${userMessage}

GÖREV:
- Eğer kullanıcı sistem/proje hakkında soruyorsa, yukarıdaki sistem bilgisini kullan
- Eğer kullanıcı ERP/iş ile ilgili soruyorsa, yukarıdaki GERÇEK verilerden yararlan
- Eğer kullanıcı genel sohbet ediyorsa (selam, naber vb.), samimi yanıt ver
- Her durumda Türkçe, doğal ve samimi ol
- Sayısal verileri net göster
- Kısa ve öz olsun`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 800,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Gemini API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url: response.url
        });

        if (response.status === 404) {
          return 'API endpoint bulunamadı. Gemini API erişiminizi Google AI Studio\'da kontrol edin:\n\n1. API key kısıtlamalarını kontrol edin\n2. "Generative Language API" etkin olmalı\n3. Proje ayarlarını kontrol edin';
        }

        return `API Hatası (${response.status}): ${errorData?.error?.message || response.statusText}`;
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0]) {
        console.error('Unexpected API response:', data);
        return 'API yanıtı beklenmedik formatta. Lütfen daha sonra tekrar deneyin.';
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error: unknown) {
      console.error('Gemini API request failed:', error);
      return `Üzgünüm, bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}\n\nLütfen:\n- İnternet bağlantınızı kontrol edin\n- API key'in doğru olduğundan emin olun\n- Google AI Studio'da API kısıtlamalarını kontrol edin`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await getGeminiResponse(currentMessage);
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      const newMessages = [...messages, userMessage, assistantMessage];
      setMessages(newMessages);

      // Save to Firestore (chats collection)
      try {
        const { chatsService } = await import('../services/firestoreService');
        const userId = auth.currentUser?.uid || 'anonymous';

        // Get existing chat or create new one
        const existingChats = await chatsService.getAll();
        const userChat = existingChats.find((chat: any) => chat.userId === userId);

        if (userChat) {
          // Update existing chat with new messages (keep last 10)
          const allMessages = [...(userChat.messages || []), userMessage, assistantMessage];
          const last10Messages = allMessages.slice(-10);
          await chatsService.update(userChat.id, {
            messages: last10Messages,
            updatedAt: new Date(),
          });
        } else {
          // Create new chat session
          await chatsService.create({
            userId,
            messages: [userMessage, assistantMessage],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (firestoreError) {
        console.error('Error saving to Firestore:', firestoreError);
        // Continue even if Firestore save fails
      }
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, yanıt alırken bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="rounded-lg p-8 text-center">
          <div className="text-emerald-400 text-xl">⏳ AI asistan yükleniyor...</div>
        </div>
      </div>
    );
  }

  const handleClearChat = () => {
    setMessages([]);
    loadInitialMessages();
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            🤖 AI Asistan
          </h2>
          <button
            onClick={handleClearChat}
            className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            🗑️ Yeni Sohbet
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg flex flex-col h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-800 text-gray-100 border border-emerald-500/20'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-2 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-gray-100 border border-emerald-500/20 rounded-lg p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-emerald-500/30 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 bg-gray-800 border border-emerald-500/30 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium px-6 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-emerald-400 mb-3">Hızlı Sorular</h3>
              <div className="space-y-2">
                {[
                  'Siparişlerin durumu nedir?',
                  'Hangi ürünlerin stoğu düşük?',
                  'Bekleyen faturalar var mı?',
                  'Bu ay için rapor ver',
                  'En çok sipariş veren müşteri kimdir?',
                  'Toplam gelir ne kadar?',
                  'DSO değeri kaç gün?',
                  'Anomali tespit edilen faturalar hangileri?',
                  'Ödeme yöntemlerinin dağılımı nasıl?',
                  'En düşük stoklu ürünler hangileri?',
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputMessage(question);
                    }}
                    className="w-full text-left text-sm text-gray-300 hover:text-emerald-400 bg-gray-800/50 hover:bg-gray-800 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg px-3 py-2 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
