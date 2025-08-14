import { Info } from "lucide-react";

const KvkkPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-[#e0f2fe] via-white to-[#f0f9ff] py-16 px-4 mt-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200">
        {/* Başlık (AboutPage ile aynı şerit) */}
        <div className="flex items-center mb-6 gap-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            KVKK Aydınlatma Metni
          </h1>
        </div>

        {/* İçerik – yazı boyutu About'tan biraz küçük */}
        <section className="space-y-6 text-gray-700 text-[15px] leading-relaxed">
          <p>
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında,
            kişisel verilerinizin hangi amaçlarla, ne şekilde işlendiği ve haklarınız hakkında sizleri
            bilgilendirmek amacıyla hazırlanmıştır.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 pt-2">1. Veri Sorumlusu</h2>
          <p>
            Kişisel verileriniz, veri sorumlusu sıfatıyla tarafımızca işlenmektedir. İletişim bilgileri,
            açık adresimiz ve diğer detaylar için lütfen iletişim sayfamızı ziyaret ediniz.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 pt-2">2. Kişisel Verilerin İşlenme Amaçları</h2>
          <p>
            Toplanan kişisel verileriniz; hizmetlerimizin sunulabilmesi, üyelik işlemlerinin
            yürütülmesi, sizinle iletişime geçilmesi ve yasal yükümlülüklerin yerine getirilmesi
            amacıyla işlenmektedir.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 pt-2">3. Kişisel Verilerin Aktarılması</h2>
          <p>
            Verileriniz, açık rızanız olmaksızın yalnızca kanunen yetkili kamu kurum ve kuruluşlarıyla
            paylaşılabilir. Bunun dışında üçüncü kişilere aktarımı yapılmaz.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 pt-2">4. Veri Saklama Süresi</h2>
          <p>
            Kişisel verileriniz, işlendikleri amaç doğrultusunda gerekli süre boyunca saklanmakta, bu
            sürenin sonunda ise mevzuata uygun olarak silinmekte veya anonim hale getirilmektedir.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 pt-2">5. KVKK Kapsamındaki Haklarınız</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>Verilerin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>Kanunlara aykırı olarak işlenmişse silinmesini veya yok edilmesini isteme,</li>
            <li>İşlemlerin ilgili kişilere bildirilmesini isteme,</li>
            <li>Otomatik sistemler ile analiz edilmesi sonucu aleyhe bir sonucun çıkmasına itiraz etme,</li>
            <li>Yasalara aykırı işleme nedeniyle zarara uğramışsanız, tazminat talep etme.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 pt-2">6. İletişim</h2>
          <p>
            KVKK kapsamındaki haklarınızı kullanmak için lütfen bizimle{" "}
            <a href="mailto:info@ornekmail.com" className="text-blue-600 hover:underline">
              info@ornekmail.com
            </a>{" "}
            adresi üzerinden iletişime geçiniz.
          </p>
        </section>
      </div>
    </div>
  );
};

export default KvkkPage;
