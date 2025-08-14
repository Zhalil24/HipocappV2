import React, { useState } from 'react';
import logo from './logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import PageButtons from '@/components/PageButtons';

const Header = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const isActive = (p: string) =>
    location.pathname === p || location.pathname.startsWith(p + "/");


  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const pages = [
    { name: 'Market', path: '/market' },
    { name: 'İlanlar', path: '/ads' },
    { name: 'Eğitimler', path: '/educations' },
    { name: 'Partnerlerimiz', path: '/partners' },
  ];

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <header className="bg-[#000000FF] text-[#FDF6EC] shadow-md fixed top-0 left-0 w-full z-50 px-6 h-[72px] flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div
          className="flex items-center gap-4 cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          <div className="w-16 h-16 rounded-full bg-[#2b4560] flex items-center justify-center overflow-hidden shadow-inner">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1
            className="text-2xl font-bold tracking-wide select-none leading-none"
            style={{ fontFamily: 'system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            HİPOCAPP
          </h1>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          role="search"
          className="w-64  mr-9"
        >
          <input
            type="text"
            name="search"
            placeholder="Başlık ara..."
            className="w-full rounded-md py-0.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B4560]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Başlık ara"
            autoComplete="off"
          />
        </form>

        <nav className="hidden md:flex items-center gap-5">
          {pages.map(({ name, path }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={[
                  "group relative w-32 px-4 py-1   rounded-md text-sm font-semibold select-none overflow-hidden",
                  "transition-all duration-300 ease-out focus:outline-none",
                  "bg-[#000000] ring-1 ring-[#0071E3]/55",
                  active
                    ? "text-white shadow-[0_10px_24px_rgba(0,113,227,0.35)]"
                    : "text-white/85 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,113,227,0.35)]",
                  "focus-visible:ring-2 focus-visible:ring-[#0071E3]"
                ].join(" ")}
              >
                <span className="relative z-10">{name}</span>
                <span
                  className={[
                    "pointer-events-none absolute inset-0 rounded-md",
                    "bg-[linear-gradient(135deg,#0071E3_0%,#004a98_100%)]",
                    "transform transition-transform duration-300",
                    active ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
                  ].join(" ")}
                />
                <span
                  className="pointer-events-none absolute inset-x-0 -top-6 h-12 rounded-md
               bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-4 ml-6">
        {user === null ? (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-md bg-[#000000FF] text-white shadow-md font-semibold
               border-b-2 border-transparent hover:border-[#0071E3] transition-colors"
            >
              Giriş Yap
            </button>

            <button
              onClick={() => navigate('/sign-up')}
              className="px-5 py-2 rounded-md bg-[#000000FF] text-white shadow-md font-semibold
               border-b-2 border-transparent hover:border-[#0071E3] transition-colors"
            >
              Kaydol
            </button>
          </>

        ) : (
          <>
            {/* Chat ikonu */}
            <div className="relative">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/chat');
                }}
                className="p-2 rounded-full hover:bg-[#000000FF] transition-colors"
                title="Mesajlar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white hover:text-[#0071E3]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.518 0-2.94-.336-4.162-.93L3 20l1.07-3.276C3.388 15.982 3 14.538 3 13c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {/* İstersen unread badge ekle
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
                */}
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1 bg-[#000000FF] hover:bg-[#000000FF] px-4 py-2 rounded-md shadow-md font-semibold
             transition-colors focus:outline-none border-b-2 border-transparent hover:border-[#0071E3]"
                aria-expanded={menuOpen}
              >
                {user.username}
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition text-sm"
                  >
                    Profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition text-sm"
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
