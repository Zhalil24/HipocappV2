import React from 'react';
import { Info } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-[#e0f2fe] via-white to-[#f0f9ff] py-16 px-4 mt-20" >
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200">
        <div className="flex items-center mb-6 gap-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Hakkımızda
          </h1>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">
          <strong>Hipocapp</strong>, kullanıcılarına <span className="text-blue-600 font-medium">sağlık</span>, <span className="text-green-600 font-medium">eğitim</span> ve <span className="text-purple-600 font-medium">kültür</span> alanlarında zengin içerikler sunmayı amaçlayan yenilikçi bir platformdur.
          <br /><br />
          Amacımız, kaliteli bilgiye kolay erişim sağlamak ve kullanıcılarımıza en güncel içerikleri ulaştırmaktır. 
          Ekibimiz alanında uzman kişilerden oluşmakta ve sürekli olarak platformumuzu geliştirmek için çalışmaktadır.
          <br /><br />
          <strong className="text-gray-800">Sizlere en iyi deneyimi sunmak için buradayız.</strong>
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
