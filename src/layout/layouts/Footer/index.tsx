import { AboutConstants } from "@/Utilities/aboutConstants";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#000000FF] text-[#FDF6EC]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0071E3] flex items-center justify-center shadow-inner">
                <span className="text-sm font-bold tracking-wide">H</span>
              </div>
              <h2 className="text-xl font-bold tracking-wide">HİPOCAPP</h2>
            </div>

            <p className="text-sm/6 text-[#FDF6EC]/80">
             {AboutConstants}
            </p>
          </div>

          {/* Sağ Yarı: Link sütunları + Sosyal */}
          <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sayfalar */}
            <div>
              <h3 className="text-sm font-semibold mb-3 tracking-wide">Sayfalar</h3>
              <ul className="space-y-2 text-sm text-[#FDF6EC]/85">
                <li><a href="/market" className="hover:text-[#0071E3] transition-colors">Market</a></li>
                <li><a href="/ads" className="hover:text-[#0071E3] transition-colors">İlanlar</a></li>
                <li><a href="/educations" className="hover:text-[#0071E3] transition-colors">Eğitimler</a></li>
                <li><a href="/partners" className="hover:text-[#0071E3] transition-colors">Partnerlerimiz</a></li>
              </ul>
            </div>

            {/* Yasal */}
            <div>
              <h3 className="text-sm font-semibold mb-3 tracking-wide">Yasal</h3>
              <ul className="space-y-2 text-sm text-[#FDF6EC]/85">
            <li><a href="/about" className="hover:text-[#0071E3] transition-colors">Hakkımızda</a></li>
            <li><a href="/contact" className="hover:text-[#0071E3] transition-colors">İletişim</a></li>
            <li><a href="/kvkk" className="hover:text-[#0071E3] transition-colors">KVKK</a></li>
              </ul>
            </div>

            {/* Sosyal / İletişim */}
            <div>
              <h3 className="text-sm font-semibold mb-3 tracking-wide">Bize Ulaşın</h3>
              <ul className="space-y-2 text-sm text-[#FDF6EC]/85 mb-4">
                <li><a href="mailto:info@hipocapp.com" className="hover:text-[#0071E3] transition-colors">info@hipocapp.com</a></li>
                <li><a href="/contact" className="hover:text-[#0071E3] transition-colors">İletişim Formu</a></li>
              </ul>

              <div className="flex items-center gap-3">
                {/* X / Twitter */}
                <a
                  href="https://x.com/"
                  aria-label="Twitter"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ring-1 ring-white/10"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M18.244 2H21l-6.52 7.46L22 22h-6.828l-4.45-5.72L5.6 22H3l6.98-7.98L2 2h6.914l4.02 5.318L18.244 2Zm-2.392 18h2.116L8.24 4H6.004l9.848 16Z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com/"
                  aria-label="Instagram"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ring-1 ring-white/10"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.427.403a4.9 4.9 0 0 1 1.77 1.153 4.9 4.9 0 0 1 1.154 1.771c.163.457.35 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.427a4.9 4.9 0 0 1-1.154 1.77 4.9 4.9 0 0 1-1.77 1.154c-.457.163-1.257.35-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.427-.403a4.9 4.9 0 0 1-1.77-1.154 4.9 4.9 0 0 1-1.154-1.77c-.163-.457-.35-1.257-.403-2.427C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.427a4.9 4.9 0 0 1 1.154-1.77 4.9 4.9 0 0 1 1.77-1.154c.457-.163 1.257-.35 2.427-.403C8.416 2.175 8.796 2.163 12 2.163Zm0 1.8c-3.16 0-3.532.012-4.778.069-.999.046-1.54.213-1.898.355-.478.185-.82.406-1.178.764-.358.358-.579.7-.764 1.178-.142.358-.309.9-.355 1.898-.057 1.246-.069 1.618-.069 4.778s.012 3.532.069 4.778c.046.999.213 1.54.355 1.898.185.478.406.82.764 1.178.358.358.7.579 1.178.764.358.142.9.309 1.898.355 1.246.057 1.618.069 4.778.069s3.532-.012 4.778-.069c.999-.046 1.54-.213 1.898-.355.478-.185.82-.406 1.178-.764.358-.358.579-.7.764-1.178.142-.358.309-.9.355-1.898.057-1.246.069-1.618.069-4.778s-.012-3.532-.069-4.778c-.046-.999-.213-1.54-.355-1.898a3.1 3.1 0 0 0-.764-1.178 3.1 3.1 0 0 0-1.178-.764c-.358-.142-.9-.309-1.898-.355-1.246-.057-1.618-.069-4.778-.069Zm0 2.874a5.163 5.163 0 1 1 0 10.326 5.163 5.163 0 0 1 0-10.326Zm0 1.8a3.363 3.363 0 1 0 0 6.726 3.363 3.363 0 0 0 0-6.726ZM17.34 6.46a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/"
                  aria-label="LinkedIn"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ring-1 ring-white/10"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M6.94 6.5A2.44 2.44 0 1 1 4.5 4.06 2.44 2.44 0 0 1 6.94 6.5ZM4.75 20h4.4V9.25h-4.4V20ZM13.25 9.25H9.5V20h3.75v-5.66c0-2.99 3.91-3.23 3.91 0V20h3.84v-6.98c0-5.7-6.5-5.49-7.75-2.69V9.25Z" />
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com/"
                  aria-label="YouTube"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ring-1 ring-white/10"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M23.5 6.2a4.8 4.8 0 0 0-3.38-3.39C17.98 2.2 12 2.2 12 2.2s-5.98 0-8.12.61A4.8 4.8 0 0 0 .5 6.2 50.7 50.7 0 0 0 0 12a50.7 50.7 0 0 0 .5 5.8 4.8 4.8 0 0 0 3.38 3.39c2.14.6 8.12.61 8.12.61s5.98 0 8.12-.61a4.8 4.8 0 0 0 3.38-3.39A50.7 50.7 0 0 0 24 12a50.7 50.7 0 0 0-.5-5.8ZM9.6 15.5v-7l6.4 3.5-6.4 3.5Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ALT ÇUBUK */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-center text-xs text-[#FDF6EC]/70">
          <p>© {new Date().getFullYear()} Hipocapp • DGH ARGE YAZILIM DANIŞMANLIK ENERJİ İNŞAAT SAN.TİC.LTD.ŞTİ</p>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
