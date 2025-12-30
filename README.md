# 💼 ERP Demo - Enterprise Resource Planning System

> **🔒 Security Note:** Firebase API keys in this project are intentionally public. This is by design - Firebase security is enforced through Security Rules, not by hiding API keys. [Learn more](https://firebase.google.com/docs/projects/api-keys)

Modern bir ERP demo uygulaması. React, TypeScript, Firebase ve Gemini AI ile geliştirilmiştir.

## 🎯 Proje Amacı

Bu proje, bir işletme için sipariş, stok, fatura ve ödeme yönetimi yapabilen, AI destekli analizler sunan tam teşekküllü bir ERP demo sistemidir. Gerçek zamanlı veri senkronizasyonu, rol tabanlı erişim kontrolü ve AI destekli iş analitiği özellikleri içerir.

## ✨ Özellikler

- 🔐 **Kullanıcı Yönetimi**: Firebase Authentication ile Email/Password girişi
- 🎭 **Rol Tabanlı Erişim**: Admin, Sales ve Finance rolleri
- 📊 **Dashboard**: KPI'lar ve genel sistem özeti
- 📦 **Sipariş Yönetimi**: Yeni sipariş oluşturma, müşteri ve ürün seçimi
- 📈 **Stok Takibi**: Düşük stok uyarıları, risk analizi
- 🧾 **Fatura Yönetimi**: Anomali tespiti, otomatik KDV hesaplama
- 💰 **Ödeme Takibi**: Ödeme durumları, hatırlatmalar
- 🤖 **AI Narrative**: Gemini AI ile gerçek zamanlı iş analizleri ve öneriler (mock değil!)
- 💬 **AI Chat**: Gemini AI ile gerçek zamanlı sohbet
- 🔔 **Bildirimler**: React Hot Toast ile modern bildirim sistemi
- 🎨 **Modern UI**: Tailwind CSS ile Matrix/Hacker temalı arayüz

## 🗂️ Veri Modeli (Firestore Koleksiyonları)

### **users** - Kullanıcı Profilleri
```typescript
{
  email: string
  roles: {
    admin?: boolean
    sales?: boolean
    finance?: boolean
  }
  displayName: string
  createdAt: Date
}
```

### **customers** - Müşteriler
```typescript
{
  name: string
  segment: 'enterprise' | 'mid-market' | 'smb'
  creditLimit: number
  riskScore: number
  dso: number
}
```

### **products** - Ürünler
```typescript
{
  sku: string
  name: string
  price: number
  stock: number
  minStockLevel: number
  category: string
  description?: string
}
```

### **orders** - Siparişler
```typescript
{
  orderNumber: string
  customerId: string
  customerName: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'delivered' | 'cancelled'
  createdAt: Date
  createdBy: string
}
```

### **invoices** - Faturalar
```typescript
{
  invoiceNumber: string
  orderRef: string
  customerName: string
  items: Array<object>
  subtotal: number
  tax: number
  total: number
  paymentStatus: 'paid' | 'pending' | 'overdue'
  hasAnomaly?: boolean
  anomalyReason?: string
  dueDate: Date
}
```

### **payments** - Ödemeler
```typescript
{
  invoiceRef: string
  invoiceNumber: string
  customerName: string
  amount: number
  paymentMethod: 'bank_transfer' | 'credit_card' | 'cash' | 'check'
  status: 'completed' | 'pending' | 'failed'
  paymentDate: Date
}
```

### **kpi** - KPI Metrikleri
```typescript
{
  period: Date
  totalOrders: number
  totalRevenue: number
  dso: number
  pendingPayments: number
  lowStockAlerts: number
}
```

### **narratives** - AI Analizleri
```typescript
{
  period: Date
  summary: string
  dataPoints: Array<{
    label: string
    value: string
    change?: string
  }>
  recommendedActions: string[]
  createdAt: Date
}
```

### **chats** - AI Sohbet Geçmişi
```typescript
{
  userId: string
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  createdAt: Date
  updatedAt: Date
}
```

### **events** - Denetim Kayıtları (Append-Only)
```typescript
{
  type: string
  userId: string
  details: string
  timestamp: Date
  // Additional event-specific fields
}
```

## 🎭 Roller ve Yetkiler

### Admin
- ✅ Tüm sayfalara erişim
- ✅ Kullanıcı yönetimi
- ✅ KPI düzenleme
- ✅ Tüm koleksiyonlarda okuma/yazma

### Sales (Satış)
- ✅ Dashboard görüntüleme
- ✅ Sipariş oluşturma ve görüntüleme
- ✅ Stok görüntüleme
- ✅ Müşteri ve ürün yönetimi
- ❌ Fatura ve ödeme sayfalarına erişim yok

### Finance (Finans)
- ✅ Dashboard görüntüleme
- ✅ Fatura yönetimi
- ✅ Ödeme takibi
- ✅ Finansal raporlar
- ❌ Sipariş oluşturma yetkisi yok

## 📦 Teknoloji Stack'i

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool ve dev server
- **React Router v7** - Routing
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **React Hot Toast** - Bildirimler

### Backend
- **Firebase Authentication** - Kullanıcı yönetimi
- **Cloud Firestore** - NoSQL veritabanı
- **Firestore Rules** - Güvenlik kuralları

### AI Integration
- **Google Gemini 2.0 Flash** - AI Chat
- **AI Narratives** - İş analizleri (mock data)

## 🚀 Kurulum

### 1. Proje Klonlama
```bash
git clone <repo-url>
cd erp-demo-clean
```

### 2. Bağımlılıkları Yükleme
```bash
npm install
```

### 3. Firebase Yapılandırması
`.env.local` dosyası oluşturun:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Development Server
```bash
npm run dev
```

### 5. Firebase Emulator (Opsiyonel)
```bash
firebase emulators:start
```

## 🎮 Demo Akışı

### İlk Kurulum
1. **Uygulamayı başlatın**: `npm run dev`
2. **Login sayfası** görüntülenecek
3. **Demo kullanıcıları oluşturun**: Dashboard'a geçici erişim için korumayı kaldırın veya Firebase Console'dan manuel kullanıcı oluşturun

### Demo Kullanıcıları
Dashboard'daki "👥 Demo Kullanıcıları Oluştur" butonuna tıklayın:

- **Admin**: admin@erp.com / admin123
- **Sales**: sales@erp.com / sales123
- **Finance**: finance@erp.com / finance123

### Test Verilerini Yükleme
Dashboard'daki "🚀 Test Verilerini Yükle" butonuna tıklayın:
- 5 müşteri
- 8 ürün
- 2 sipariş
- Faturalar ve ödemeler
- KPI metrikleri

### Sayfa Turu

#### 1. **Dashboard**
- KPI kartları (Sipariş, Gelir, Bekleyen Ödemeler, Düşük Stok)
- Test verisi yükleme butonları
- AI Narrative oluştur butonu

#### 2. **Siparişler** (Sales Rolü Gerekli)
- Sipariş listesi tablosu
- "Yeni Sipariş" butonu
- Müşteri ve ürün seçimi
- Otomatik toplam hesaplama
- Event logging

#### 3. **Stok**
- Ürün kartları
- Düşük stok uyarıları
- Risk etiketleri (🟢 Normal, ⚠️ Düşük Stok)
- "Stok Sipariş Et" butonu
- Event logging

#### 4. **Faturalar** (Finance Rolü Gerekli)
- Fatura listesi
- Ödeme durumu
- Anomaly detection (⚠️ işaretli faturalar)
- Detaylı fatura görüntüleme

#### 5. **Ödemeler** (Finance Rolü Gerekli)
- Ödeme listesi
- Ödeme yöntemi özeti
- Durum filtreleme
- Tarih bilgileri

#### 6. **AI Chat**
- Gemini AI ile sohbet
- Gerçek ERP verilerini analiz eder
- Hızlı soru önerileri
- Sohbet geçmişi Firestore'a kaydedilir

#### 7. **AI Narrative**
- **Gemini AI ile gerçek zamanlı iş analizleri** (Test sayfasından "AI Anlatı Oluştur" ile)
- AI tarafından oluşturulan özet analiz
- AI tarafından hesaplanan önemli veri noktaları ve değişim yüzdeleri
- AI tarafından önerilen aksiyon maddeleri
- **Katlanabilir rapor görünümü** - detayları görmek için tıklayın
- "Raporu Yenile" butonu ile Firestore'dan yeni raporları çekin
- Checkbox ile aksiyon takibi
- Console log ile AI yanıtlarının kanıtı

## 🔐 Güvenlik

### Firestore Rules
```javascript
// Rol bazlı erişim kontrolleri
- Users: Kullanıcılar kendi profillerini okuyabilir
- Orders: Sales ve Admin yazabilir
- Invoices/Payments: Finance ve Admin yazabilir
- Events: Append-only (silme/güncelleme yasak)
```

### Authentication Flow
1. Email/Password ile giriş
2. Firebase Auth token alınır
3. Kullanıcı profili Firestore'dan çekilir
4. Rol kontrolü yapılır
5. ProtectedRoute ile sayfa erişimi kontrol edilir

## 📊 Performans

- **Code Splitting**: Dynamic imports ile lazy loading
- **Firestore Optimization**: Sayfalama ve indexleme
- **Cache Strategy**: Kritik listeler için önbellek
- **HMR**: Vite ile hızlı geliştirme

## 🐛 Bilinen Kısıtlamalar

- Composite indexes manuel oluşturulmalı
- Emulator yerine production Firebase kullanılıyor
- Offline support henüz implemente edilmedi

## 🔮 Gelecek Adımlar

- [x] ~~Gerçek AI servislerine geçiş~~ ✅ Gemini AI entegre edildi (Chat ve Narrative)
- [ ] Offline support (Firestore persistence)
- [ ] Analytics/Performance Monitoring
- [ ] Export/Import özellikleri (CSV, Excel)
- [ ] Çok dilli destek (i18n)
- [ ] Dark/Light tema
- [ ] Push bildirimleri
- [ ] Mobile responsive geliştirmeleri

## 📝 Lisans

Bu proje demo amaçlıdır ve eğitim için kullanılabilir.

## 👨‍💻 Geliştirici

Claude Code tarafından geliştirilmiştir.
