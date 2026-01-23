**Smart Reading**, kullanıcıların okuma hızını artırmayı, odaklanma süresini iyileştirmeyi ve metinleri daha verimli bir şekilde analiz etmelerini sağlayan yapay zeka dinamik ağırlıklandırmasından ilham alan bir okuma asistanıdır.

İstemci tarafında **React (ES Modules)** ve **Tailwind CSS** kullanılarak, derleme gerektirmeyen (no-build) hibrit bir yapı oluşturulmuştur.

##  Algoritmik Çekirdek ve Verimlilik

Smart Reading, rastgele bir okuma deneyimi sunmak yerine, kullanıcının performansına göre kendini adapte eden istatistiksel algoritmalar kullanır.

### 1. Aykırı Değer Tespiti (Outlier Detection)
Okuma hızı hesaplanırken, kullanıcının anlık dalgınlıkları veya duraksamaları verileri kirletebilir. Sistem, **Standart Sapma (Standard Deviation)** tabanlı bir filtreleme uygular:
* Her cümlenin okunma süresi kaydedilir.
* Ortalama hız (`mean`) ve standart sapma (`sd`) hesaplanır.
* Ortalamadan `2 * sd` kadar uzak olan okuma süreleri (çok hızlı geçilen veya çok uzun beklenen anlar) **"aykırı değer"** kabul edilerek istatistiğe dahil edilmez.
* Bu sayede sistem, kullanıcının *gerçek* okuma hızını (Base Speed) %99 güven aralığında tespit eder.

### 2. Dinamik Ağırlıklandırma (Dynamic Weighting)
Her cümlenin bir "zorluk ağırlığı" (`weight`) vardır:
* Eğer bir cümle, kullanıcının ortalama hızından daha yavaş okunmuşsa, sistem bu cümlenin zor olduğunu varsayar ve ağırlığını artırır (`Math.pow` fonksiyonu ile üstel artış).
* Daha hızlı okunan cümlelerin ağırlığı düşürülür.

### 3. Tekrar Mekanizması (Spaced Repetition)
Okuma sırası **Ağırlıklı Rastgele Seçim (Weighted Random Selection)** algoritması ile belirlenir:
* Sistem, sıradaki cümleyi seçerken ağırlığı yüksek (zorlanılan) cümlelere öncelik verir.
* Bu yöntem, kullanıcının zaten bildiği kısımları hızlı geçmesini, zorlandığı kısımlar üzerinde ise daha fazla pratik yapmasını sağlar (Active Recall).

##  Öne Çıkan Özellikler

* **Biyonik Okuma (Bionic Reading):** Kelimelerin ilk kısımlarını vurgulayarak gözün metin üzerinde daha hızlı kaymasını sağlar.
* **Akıllı Tekrar Sistemi:** Kullanıcının zorlandığı cümleleri tespit eder ve öğrenme sürecini optimize etmek için bunları daha sık gösterir.
* **Pomodoro Entegrasyonu:** Odaklanma ve mola sürelerini yöneten dahili zamanlayıcı.
* **Çoklu Format Desteği:** `.txt`, `.pdf` ve `.docx` dosyalarını içe aktarabilme.
* **Metin Seslendirme (TTS):** İngilizce ve Türkçe metinler için yerleşik seslendirme desteği.
* **Offline First:** Tüm veriler tarayıcı tabanlı `IndexedDB` üzerinde güvenle saklanır.

##  Teknoloji Yığını

* **Backend:** .NET 8, ASP.NET Core MVC
* **Frontend:** React 18 (via ESM), Tailwind CSS (CDN)
* **Veri Tabanı:** IndexedDB (Client-side NoSQL)
* **Dosya İşleme:** PDF.js (PDF), Mammoth.js (Word)
* **Matematiksel Gösterim:** KaTeX

##  Kurulum ve Çalıştırma

Proje .NET 8 SDK gerektirir.

1.  Repoyu klonlayın:
    ```bash
    git clone [https://github.com/kullaniciadi/smart-reading-mvc.git](https://github.com/kullaniciadi/smart-reading-mvc.git)
    ```
2.  Proje dizinine gidin:
    ```bash
    cd SmartReadingMvc
    ```
3.  Uygulamayı başlatın:
    ```bash
    dotnet run
    ```
4.  Tarayıcınızda `http://localhost:5000` (veya terminalde belirtilen port) adresine gidin.

##  Katkıda Bulunma

Algoritma iyileştirmeleri veya yeni özellik önerileri için Pull Request göndermekten çekinmeyin. Özellikle `calcMast` (Mastery Calculation) fonksiyonu üzerindeki istatistiksel iyileştirmeler projenin gelişimine büyük katkı sağlayacaktır.

##  Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.
