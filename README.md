# Minimal Tasks - Electron To-Do Uygulaması

**Minimal Tasks**, Electron, Tailwind CSS ve Vanilla JavaScript kullanılarak geliştirilmiş, basit ve şık bir masaüstü yapılacaklar (to-do) uygulamasıdır. Görevlerinizi kategorilere ayırarak takip etmenizi sağlar.  

---

## Özellikler

- Görev ekleme, silme ve tamamlandı olarak işaretleme
- Görevler için kategori seçme ve yeni kategori oluşturma
- Görev açıklaması ve son tarih ekleme (opsiyonel)
- Görevleri kategoriye göre filtreleme
- Görevleri eklenme tarihine veya son tarihe göre sıralama
- Kategorileri yönetme (ekleme, silme)
- Yerel depolama (localStorage) ile verileri saklama
- Animasyonlu ve modern kullanıcı arayüzü (Tailwind CSS ve Animate.css)
- Electron ile platformlar arası masaüstü uygulama

---

## Teknolojiler

- [Electron](https://www.electronjs.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- Vanilla JavaScript  
- Animate.css  
- LocalStorage  

---

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (https://nodejs.org/) yüklü olmalı
- npm (Node Package Manager) yüklü olmalı

### Adımlar

1. Projeyi klonlayın veya indirin:

git clone https://github.com/semaozylmz/MinimalToDoApp

cd MinimalToDoApp

2. Gerekli bağımlılıkları yükleyin:

npm install

3. Uygulamayı başlatın:

npm start

## Kullanma

Ana ekranda yapılacak işlerinizi yazıp + butonuna basarak ekleyebilirsiniz.
+ Add details ile görev açıklaması, son tarih ve kategori ekleyebilirsiniz.
Kategoriler arasında geçiş yapabilir, filtreleyebilirsiniz.
Görev üzerine tıklayarak tamamlandı olarak işaretleyebilirsiniz.
Kategorileri yönetmek için + ikonuna basıp yeni kategori ekleyebilir, mevcut kategorileri silebilirsiniz.
Görevleri farklı kriterlere göre sıralayabilirsiniz.

# Build Etmek İçin

Projeyi build etmek için aşağıdaki komutu çalıştırın:

npm run build

Bu işlem dist klasöründe derlenmiş dosyaları oluşturur. Oluşan dosyalar sayesinde uygulamayı bağımsız olarak kullanabilirsiniz.
