import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#2B4560] text-[#FDF6EC] border-t border-[#2B4560]/10">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm">
        {/* Sol: Logo ve kısa açıklama */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-lg font-bold">Hipocapp</h2>
          <p className="text-xs text-[#FDF6EC]/70">Copyright © 2023 Bera Ar-Ge Yazılım</p>
        </div>

        {/* Orta: Linkler */}
        <ul className="flex flex-wrap justify-center gap-4 text-[#FDF6EC]/80 text-xs">
          <li><a href="#" className="hover:text-[#FFD700] transition">Hakkımızda</a></li>
          <li><a href="#" className="hover:text-[#FFD700] transition">İletişim</a></li>
          <li><a href="#" className="hover:text-[#FFD700] transition">KVKK</a></li>
          <li><a href="#" className="hover:text-[#FFD700] transition">Gizlilik</a></li>
        </ul>

        {/* Sağ: Telif */}
        <div className="text-center md:text-right mt-4 md:mt-0 text-[#FDF6EC]/60 text-xs">
          © {new Date().getFullYear()} Hipocapp
        </div>
      </div>
    </footer>
  );
};

export default Footer;
