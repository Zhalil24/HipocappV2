import React from 'react';

const KvkkPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen pt-28 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-4">KVKK Aydınlatma Metni</h1>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında,
            kişisel verilerinizin hangi amaçlarla, ne şekilde işlendiği ve haklarınız hakkında sizleri
            bilgilendirmek amacıyla hazırlanmıştır.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8">1. Veri Sorumlusu</h2>
          <p>
            Kişisel verileriniz, veri sorumlusu sıfatıyla tarafımızca işlenmektedir. İletişim bilgileri,
            açık adresimiz ve diğer detaylar için lütfen iletişim sayfamızı ziyaret ediniz.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8">2. Kişisel Verilerin İşlenme Amaçları</h2>
          <p>
            Toplanan kişisel verileriniz; hizmetlerimizin sunulabilmesi, üyelik işlemlerinin
            yürütülmesi, sizinle iletişime geçilmesi ve yasal yükümlülüklerin yerine getirilmesi
            amacıyla işlenmektedir.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8">3. Kişisel Verilerin Aktarılması</h2>
          <p>
            Verileriniz, açık rızanız olmaksızın yalnızca kanunen yetkili kamu kurum ve kuruluşlarıyla
            paylaşılabilir. Bunun dışında üçüncü kişilere aktarımı yapılmaz.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8">4. Veri Saklama Süresi</h2>
          <p>
            Kişisel verileriniz, işlendikleri amaç doğrultusunda gerekli süre boyunca saklanmakta, bu
            sürenin sonunda ise mevzuata uygun olarak silinmekte veya anonim hale getirilmektedir.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8">5. KVKK Kapsamındaki Haklarınız</h2>
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

          <h2 className="text-2xl font-semibold text-gray-800 mt-8">6. İletişim</h2>
          <p>
            KVKK kapsamındaki haklarınızı kullanmak için lütfen bizimle info@ornekmail.com adresi üzerinden
            iletişime geçiniz.
          </p>
        </section>
      </div>
    </div>
  );
};

export default KvkkPage;
