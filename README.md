**Smart Reading**, kullanıcıların metinleri daha hızlı okumasını ve öğrenmesini sağlamak amacıyla geliştirilmiş, **ASP.NET Core MVC** ve **Modern JavaScript** teknolojilerini kullanan hibrit bir web uygulamasıdır. Standart hızlı okuma tekniklerinin ötesine geçerek, kullanıcının okuma hızına göre kendini optimize eden dinamik bir algoritma kullanır.

##  Temel Özellikler

* **Akıllı Ağırlıklandırma Algoritması (AI-Based Learning):** Okuma hızınızı analiz ederek zorlandığınız cümleleri daha sık, ustalaştığınız cümleleri daha seyrek karşınıza çıkarır.
* **Yerel Veritabanı (IndexedDB):** Tüm notlar, ilerleme durumları ve okuma geçmişi tarayıcınızın içinde güvenle saklanır. Sunucuya veri göndermez, tamamen çevrimdışı çalışabilir.
* **Dinamik Görselleştirme (Canvas API):** Her kart için CPU/GPU dostu, anlık olarak oluşturulan benzersiz geometrik desenler ve renk paletleri sunar.
* **Mobil Öncelikli Tasarım:** Dokunmatik jestler (Pinch-to-Zoom, Long Press) ile tam uyumlu, akıcı bir kullanıcı deneyimi sağlar.
* **Yüksek Performans:** `IntersectionObserver` ve `requestAnimationFrame` kullanılarak optimize edilmiş, DOM manipülasyonunu minimumda tutan akıcı render motoru.
* **Göz Dostu Arayüz:** OLED ekranlar için optimize edilmiş koyu mod (Dark Mode) ve "Noise" filtresi ile azaltılmış renk bantlanması (color banding).

## Algoritma Mimarisi

Smart Reading, **Aralıklı Tekrar (Spaced Repetition)** ve **Aktif Geri Çağırma** prensiplerini temel alan özel bir algoritma kullanır:

1. **Cümle Analizi:** Metinler yapıştırıldığında Regex motoru ile akıllıca cümlelere bölünür. Kısaltmalar (Dr., Prof., vb.) algılanarak hatalı bölünmeler engellenir.
2. **Hız Takibi (Velocity Tracking):** Kullanıcı bir kartı geçtiğinde, kartın ekranda kaldığı süre (`ms`) hesaplanır.
3. **Dinamik Ağırlıklandırma (Weight Update):**
* Her cümlenin bir `Base Speed` (Temel Hız) değeri vardır.
* Eğer kullanıcı cümleyi temel hızdan daha yavaş okursa, cümlenin **ağırlığı artar** (Daha zor kabul edilir).
* Daha hızlı okursa ağırlık azalır.
* Formül: `Yeni Ağırlık = (Anlık Hız / Temel Hız)`
4. **Olasılıksal Kuyruk (Probabilistic Queue):** "Akıllı Karıştırma" modunda, yüksek ağırlığa sahip cümlelerin kuyruğa girme olasılığı daha yüksektir. Böylece uygulama sizi zorlandığınız kısımlarda daha fazla çalıştırır.
5. **Ustalık (Mastery):** Bir cümlenin ağırlığı `0.5` altına düştüğünde, o cümle "Öğrenilmiş" kabul edilir ve ilerleme yüzdesi artar.

##  Teknolojiler

* **Backend:** .NET 8.0 (ASP.NET Core MVC)
* **Frontend:** Vanilla JavaScript (ES6+), CSS3 (Variables, Flexbox/Grid)
* **Veri Depolama:** IndexedDB (Client-side NoSQL)
* **Grafik:** HTML5 Canvas API (Prosedürel Doku Üretimi)

##  Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

### Gereksinimler

* [.NET 8.0 SDK](https://dotnet.microsoft.com/download) veya üzeri.

### Adımlar

1. **Repoyu Klonlayın:**
```bash
git clone https://github.com/kullaniciadi/SmartReadingMvc.git
cd SmartReadingMvc

```

2. **Bağımlılıkları Yükleyin ve Derleyin:**
```bash
dotnet restore
dotnet build

```

3. **Uygulamayı Başlatın:**
```bash
dotnet run

```

Veya değişiklikleri anlık görmek için:
```bash
dotnet watch run

```

4. Tarayıcınızda `http://localhost:5000` (veya terminalde belirtilen port) adresine gidin.

##  Kullanım Yönergeleri

### 1. Not Ekleme

* Ana ekrandaki **(+)** butonuna tıklayın.
* Başlık ve metni girip **Kaydet** deyin.

### 2. Okuma Modları

Bir nota tıkladığınızda iki seçenek sunulur:

* **Sıralı Akış (Lineer):** Metni baştan sona, orijinal sırasıyla okumanızı sağlar.
* **Akıllı Karıştırma (AI):** Algoritmanın belirlediği, öğrenme ihtiyacınıza göre sıralanmış sonsuz bir döngü başlatır.

### 3. Kontroller (Reader Ekranı)

* **Kaydırma (Scroll):** Aşağı/Yukarı kaydırarak kartlar arasında geçiş yapın.
* **Duraklatma (Pause):** Ekrana **basılı tutun** (Long Press) veya Mouse ile basılı tutun. Menü açılacaktır.
* **Yazı Boyutu (Zoom):** Dokunmatik ekranlarda **iki parmakla çimdikleme (pinch)** hareketi yaparak yazı boyutunu anlık olarak değiştirebilirsiniz.

### 4. Veri Yönetimi

* **Yedekleme:** Ana ekrandaki "Yedekle (JSON)" butonu ile tüm veritabanınızı dışarı aktarabilirsiniz.
* **Sıfırlama:** Tarayıcı geçmişini temizlemek IndexedDB verilerini silebilir, önemli notlarınızı yedeklemeyi unutmayın.

##  Katkıda Bulunma

1. Bu repoyu Fork'layın.
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/YeniOzellik`).
3. Değişikliklerinizi Commit edin (`git commit -m 'Yeni özellik eklendi'`).
4. Dalınızı Push edin (`git push origin feature/YeniOzellik`).
5. Bir Pull Request oluşturun.
