import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-[#e0f2fe] via-white to-[#f0f9ff] py-16 px-4 mt-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200">
        {/* Başlık */}
        <div className="flex items-center mb-6 gap-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            İletişim
          </h1>
        </div>

        {/* İçerik */}
        <div className="text-gray-700 text-lg leading-relaxed">
          <p>
            Bize ulaşmak için aşağıdaki iletişim bilgilerini kullanabilirsiniz:
          </p>

          <div className="mt-6 space-y-4">
            {/* Adres */}
            <div className="flex items-start gap-3">
              <span className="bg-blue-50 text-blue-700 p-2 rounded-lg">
                <MapPin className="w-5 h-5" />
              </span>
              <p>
                <strong>Adres:</strong> Örnek Mahallesi, 123. Sokak, İstanbul, Türkiye
              </p>
            </div>

            {/* Telefon */}
            <div className="flex items-start gap-3">
              <span className="bg-blue-50 text-blue-700 p-2 rounded-lg">
                <Phone className="w-5 h-5" />
              </span>
              <p>
                <strong>Telefon:</strong>{" "}
                <a href="tel:+905551234567" className="text-blue-600 hover:underline">
                  +90 555 123 4567
                </a>
              </p>
            </div>

            {/* E-posta */}
            <div className="flex items-start gap-3">
              <span className="bg-blue-50 text-blue-700 p-2 rounded-lg">
                <Mail className="w-5 h-5" />
              </span>
              <p>
                <strong>E-posta:</strong>{" "}
                <a href="mailto:info@hipocapp.com" className="text-blue-600 hover:underline">
                  info@hipocapp.com
                </a>
              </p>
            </div>
          </div>

          <p className="mt-6">
            <strong className="text-gray-800">
              Her türlü soru, öneri ve iş birliği talepleriniz için bizimle iletişime geçmekten çekinmeyin.
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
