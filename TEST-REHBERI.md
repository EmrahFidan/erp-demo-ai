# 🧪 ERP Demo - Test Rehberi

## 📍 Şu Anda Neredesin?

✅ Proje tamamlandı ve dev server çalışıyor!
✅ URL: http://localhost:5174

---

## 🎯 ADIM ADIM TEST

### ADIM 1: Yeni Kullanıcı Oluştur

1. **Tarayıcını aç ve bu URL'e git:**
   ```
   http://localhost:5174/signup
   ```

2. **Formu doldur:**
   - Email: `admin@erp.com`
   - Şifre: `admin123`
   - Tüm roller işaretli kalacak (Admin, Sales, Finance)

3. **"Hesap Oluştur" butonuna tıkla**
   - ✅ Başarılı mesajı göreceksin
   - Otomatik olarak Dashboard'a yönlendirileceksin

---

### ADIM 2: Dashboard - Test Verilerini Yükle

Dashboard açıldı! Şimdi:

1. **"🚀 Test Verilerini Yükle" butonuna tıkla**
   - Bekle... (5-10 saniye sürer)
   - ✅ Başarı mesajı göreceksin

2. **KPI kartlarına bak:**
   - Total Orders: 142
   - Revenue: ₺2,840,000
   - Pending Payments: ₺450,000
   - Low Stock Items: 9

3. **"🤖 AI Anlatı Oluştur (Gerçek AI)" butonuna tıkla**
   - 🤖 Gemini AI gerçek verilerinizi analiz edecek (5-10 saniye sürer)
   - ✅ Toast bildirimi görünecek (sağ üstte)
   - "AI Anlatı başarıyla oluşturuldu!"
   - **ÖNEMLİ**: Bu gerçek Gemini AI kullanır, mock/template veri değil!

---

### ADIM 3: Siparişler Sayfası

1. **Üst menüden "Siparişler" linkine tıkla**

2. **Mevcut siparişleri gör:**
   - Tabloda 2 sipariş göreceksin
   - Sipariş numarası, müşteri, tarih, tutar, durum

3. **Yeni sipariş oluştur:**
   - **"+ Yeni Sipariş" butonuna tıkla**
   - Modal açılacak

4. **Modal'da:**
   - **Müşteri seç**: "Acme Corp" veya başka bir müşteri
   - **Ürün seç**: "Laptop - Dell XPS 15"
   - **Miktar**: 2
   - **"+ Ürün Ekle" butonuna tıklayarak** birden fazla ürün ekleyebilirsin
   - **"✅ Sipariş Oluştur" butonuna tıkla**

5. **Sonuç:**
   - ✅ Sağ üstte yeşil toast: "Sipariş başarıyla oluşturuldu!"
   - Modal kapanacak
   - Yeni sipariş listede görünecek

---

### ADIM 4: Stok Sayfası

1. **Üst menüden "Stok" linkine tıkla**

2. **Ne göreceksin:**
   - 8 ürün kartı
   - Her kartta: Ürün adı, SKU, fiyat, stok durumu
   - Bazılarında ⚠️ "Düşük Stok" etiketi

3. **Filtreleri dene:**
   - **"Tümü (8)"** → Tüm ürünler
   - **"Düşük Stok (X)"** → Sadece düşük stoklu ürünler
   - **"Normal Stok (X)"** → Normal stoktaki ürünler

4. **Stok siparişi ver:**
   - Düşük stoklu bir üründe **"🔔 Stok Sipariş Et" butonuna tıkla**
   - ✅ Toast: "Ürün için stok sipariş talebi oluşturuldu!"

---

### ADIM 5: Faturalar Sayfası

1. **Üst menüden "Faturalar" linkine tıkla**

2. **Ne göreceksin:**
   - Fatura listesi tablosu
   - Bazı faturalarda ⚠️ "Anomaly Detected" badge'i var

3. **Fatura detayına bak:**
   - Herhangi bir fatura satırına tıkla
   - Modal açılacak
   - Fatura kalemleri, ara toplam, KDV, toplam göreceksin
   - **"✕" ile kapat**

---

### ADIM 6: Ödemeler Sayfası

1. **Üst menüden "Ödemeler" linkine tıkla**

2. **Ne göreceksin:**
   - Üstte 4 özet kartı:
     - Toplam Ödemeler
     - Tamamlanan
     - Banka Transferi
     - Kredi Kartı
   - Altta ödeme listesi tablosu
   - Her ödemede: Fatura no, müşteri, tutar, yöntem, durum

---

### ADIM 7: AI Narrative Sayfası

1. **Üst menüden "AI Narrative" linkine tıkla**

2. **Ne göreceksin:**
   - Aylık iş analizi kartı
   - **📊 Özet**: Gemini AI tarafından gerçek verilerinizi analiz ederek yazılmış özet metin
   - **📈 Önemli Veriler**: 6 metrik kartı (Sipariş, Gelir, DSO vb.) - AI tarafından hesaplanan değişim yüzdeleri
   - **💡 Önerilen Aksiyonlar**: 5 checkbox - AI tarafından önerilen gerçek aksiyon maddeleri

3. **Checkbox'ları dene:**
   - Herhangi bir checkbox'ı işaretle
   - Event Firestore'a yazılır (console'da log göreceksin)

4. **"🔄 Raporu Yenile" butonuna tıkla:**
   - ✅ Toast: "Rapor başarıyla yenilendi!"

---

### ADIM 8: AI Chat Sayfası

1. **Üst menüden "AI Chat" linkine tıkla**

2. **Ne göreceksin:**
   - Sol tarafta chat alanı
   - Sağ tarafta hızlı sorular

3. **Hızlı sorulardan birini seç:**
   - "Siparişlerin durumu nedir?"
   - "Hangi ürünlerin stoğu düşük?"
   - "Bekleyen faturalar var mı?"

4. **Veya kendi sorunu sor:**
   - Alt tarafta input box'a yaz
   - Enter'a bas veya "Gönder" butonuna tıkla

5. **AI Cevap verecek:**
   - Gemini AI gerçek ERP verilerinizi analiz eder
   - 3-5 saniye içinde cevap gelir
   - Mesajlar Firestore'a kaydedilir

---

## 🎨 GÖRSEL KONTROLÜ

### ✅ Şunları görmeli:
- [ ] Matrix/Hacker teması (siyah-yeşil renkler)
- [ ] Gradient'ler ve parlayan kenarlıklar
- [ ] Hover efektleri (butonların üzerine gel)
- [ ] Toast bildirimleri (sağ üstte)
- [ ] Rol badge'leri (üst menü sağ tarafta: Admin, Sales, Finance)

### 🎯 İnteraktif Öğeler:
- [ ] Butonlar tıklanınca büyüyor (scale effect)
- [ ] Kartlar hover'da gölge artıyor
- [ ] Modal'lar açılıp kapanıyor
- [ ] Filter butonları aktif/pasif renk değiştiriyor

---

## 🔐 ROL BAZLI ERİŞİM TESTİ (OPSİYONEL)

### Farklı Rollerle Test Et:

#### 1. Sales Kullanıcısı Oluştur

1. **Çıkış yap** (sağ üstte "🚪 Çıkış" butonuna tıkla)

2. **http://localhost:5174/signup** adresine git

3. **Yeni kullanıcı:**
   - Email: `sales@erp.com`
   - Şifre: `sales123`
   - Roller: **Sadece "Sales" işaretle**

4. **Giriş yap ve dene:**
   - ✅ Dashboard görebilir
   - ✅ Siparişler görebilir ve oluşturabilir
   - ✅ Stok görebilir
   - ❌ Faturalar'a giremez (yetkisiz erişim uyarısı)
   - ❌ Ödemeler'e giremez (yetkisiz erişim uyarısı)

#### 2. Finance Kullanıcısı Oluştur

1. **Çıkış yap**

2. **Yeni kullanıcı:**
   - Email: `finance@erp.com`
   - Şifre: `finance123`
   - Roller: **Sadece "Finance" işaretle**

3. **Giriş yap ve dene:**
   - ✅ Dashboard görebilir
   - ❌ Siparişler'e giremez (yetkisiz erişim uyarısı)
   - ✅ Faturalar görebilir
   - ✅ Ödemeler görebilir

---

## 🔔 TOAST BİLDİRİMLERİ

Test ederken sağ üstte şu bildirimleri göreceksin:

### ✅ Başarılı (Yeşil):
- "Sipariş başarıyla oluşturuldu!"
- "Ürün için stok sipariş talebi oluşturuldu!"
- "Rapor başarıyla yenilendi!"
- "Hesap başarıyla oluşturuldu!"

### ❌ Hata (Kırmızı):
- "Hata oluştu!"
- "Lütfen en az bir ürün seçin!"

### ℹ️ Bilgi:
- 4 saniye sonra otomatik kaybolur
- Manuel olarak "✕" ile kapatabilirsin

---

## 📊 FIRESTORE KOLEKSYON KONTROLÜ

Firebase Console'da şu koleksiyonları göreceksin:

1. **users** → Oluşturduğun kullanıcılar
2. **customers** → 5 müşteri
3. **products** → 8 ürün
4. **orders** → 2 + yeni oluşturduğun siparişler
5. **invoices** → Faturalar
6. **payments** → Ödemeler
7. **kpi** → KPI metrikleri
8. **narratives** → AI analizleri
9. **chats** → Sohbet geçmişi
10. **events** → Event logları (append-only)

---

## 🐛 SORUN ÇIKARSA?

### "Permission denied" hatası
**Çözüm**: Firestore rules deploy et:
```bash
cd C:\Users\emrah\OneDrive\Desktop\erp-demo-clean
firebase deploy --only firestore:rules
```

### Gemini API hatası
**Çözüm**: `.env.local` dosyasına API key ekle:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

### Sayfa boş görünüyor
**Çözüm**: Browser console'u aç (F12) ve hataları kontrol et

### Toast bildirimleri görünmüyor
**Çözüm**: Sayfayı yenile (Ctrl+R veya F5)

---

## ✅ TEST TAMAMLANDI!

Her şeyi test ettin mi?

- [ ] Kullanıcı oluşturma
- [ ] Test verisi yükleme
- [ ] AI Narrative oluşturma
- [ ] Yeni sipariş oluşturma
- [ ] Stok sipariş talebi
- [ ] Fatura detayı görüntüleme
- [ ] AI Chat ile sohbet
- [ ] Toast bildirimleri
- [ ] Rol bazlı erişim kontrolü

Hepsi ✅ ise projen hazır! 🎉

---

## 📞 Yardım

Sorun çıkarsa:
1. Browser console'u aç (F12)
2. Hata mesajını oku
3. Terminal'deki hata loglarını kontrol et
4. Bana hata mesajını göster, birlikte çözeriz!
