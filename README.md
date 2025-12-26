**Smart Reading**, modern web teknolojileri ve **ASP.NET Core MVC** mimarisi kullanılarak geliştirilmiş, odaklanmayı ve okuma hızını artırmayı hedefleyen yeni nesil bir çalışma aracıdır.

Sosyal medya akışlarına (dikey kaydırma) benzer bir kullanıcı deneyimi (UX) sunarak, uzun metinleri yönetilebilir küçük parçalara böler ve **Ağırlıklı Rastgelelik Algoritması (Weighted Random Algorithm)** ile öğrenme sürecini optimize eder.

##  Temel Özellikler

* ** ASP.NET Core MVC Altyapısı:** Modüler, ölçeklenebilir ve modern backend mimarisi.
* ** Akıllı Tekrar Algoritması:** Okuma hızınıza göre cümlelerin ağırlığını otomatik hesaplar; zorlanılan kısımları daha sık karşınıza çıkarır.
* ** Modern UX (Vertical Scroll Snap):** TikTok/Reels tarzı dikey kaydırma ile dikkat dağıtıcı unsurlardan arındırılmış okuma deneyimi.
* **gesture Kontrolü:** Dokunmatik ekranlarda "Pinch-to-Zoom" (yakınlaştırma) ve basılı tutarak duraklatma özellikleri.
* ** İstemci Taraflı Depolama:** Veriler **IndexedDB** teknolojisi ile tarayıcıda güvenle saklanır, sunucu maliyeti gerektirmez.

##  Teknolojiler

* **Backend:** C# / .NET 8.0 (MVC)
* **Frontend:** HTML5, CSS3 (Modern Animations), Vanilla JavaScript (ES6+)
* **Veri Tabanı:** IndexedDB (NoSQL Client-Side)

##  Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

```bash
# 1. Repoyu klonlayın
git clone [https://github.com/KULLANICI_ADINIZ/SmartReadingMvc.git](https://github.com/KULLANICI_ADINIZ/SmartReadingMvc.git)

# 2. Proje dizinine gidin
cd SmartReadingMvc

# 3. Bağımlılıkları yükleyin ve projeyi derleyin
dotnet restore
dotnet build

# 4. Uygulamayı çalıştırın
dotnet run
