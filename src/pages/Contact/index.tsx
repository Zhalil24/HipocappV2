import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-md min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-[#2B4560]">İletişim</h1>
      <p className="text-gray-700 leading-relaxed">
        Bize ulaşmak için aşağıdaki iletişim bilgilerini kullanabilirsiniz:
        <br /><br />
        <strong>Adres:</strong> Örnek Mahallesi, 123. Sokak, İstanbul, Türkiye
        <br />
        <strong>Telefon:</strong> +90 555 123 4567
        <br />
        <strong>E-posta:</strong> info@hipocapp.com
        <br /><br />
        Her türlü soru, öneri ve iş birliği talepleriniz için bizimle iletişime geçmekten çekinmeyin.
      </p>
    </div>
  );
};

export default ContactPage;
