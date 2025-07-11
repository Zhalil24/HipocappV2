import React from 'react';
import logo from './logo.jpg';

const Header = () => {
  return (
    <header className="bg-[#2b4560] text-[#FDF6EC] shadow-md px-6 py-4 flex items-center justify-between flex-wrap gap-4">
      {/* Sol: Logo */}
      <div className="flex items-center gap-2">
        <div className="w-15 h-20 rounded-full bg-[#2b4560] flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Orta: Arama kutuları */}
      <div className="flex flex-grow max-w-xl mx-auto gap-3">
        <input
          type="text"
          placeholder="Kullanıcı Ara..."
          className="w-full px-3 py-2 rounded-md border border-[#2b4560] 
               text-[#2b4560] placeholder-[#2b4560] 
               bg-white focus:outline-none focus:ring-2 focus:ring-[#2b4560]"
        />
        <input
          type="text"
          placeholder="Başlık Ara..."
          className="w-full px-3 py-2 rounded-md border border-[#2b4560] placeholder-[#2b4560] text-[#2b4560] bg-white focus:outline-none focus:ring-2 focus:ring-[#2b4560]"
        />
      </div>

      {/* Sağ: Butonlar */}
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 rounded-md bg-[#2b4560] text-white hover:bg-[#1f3347] transition">
          Giriş Yap
        </button>
        <button className="px-4 py-2 rounded-md border border-[#2b4560] text-[#FDF6EC] hover:bg-[#1f3347] hover:text-white transition">
          Kaydol
        </button>
      </div>
    </header>
  );
};

export default Header;
