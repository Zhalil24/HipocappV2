import React, { useState } from 'react';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Eğer boş arama yapılmasın istersen:
    if (!searchTerm.trim()) return;
    // Arama query paramı ile ana sayfaya yönlendirme
    navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <header
      className="bg-[#011f26] text-[#FDF6EC] shadow-md fixed top-0 left-0 w-full z-50 px-6 flex items-center justify-between"
      style={{ height: '88.5px' }}
    >
      {/* Sol: Logo + Başlık */}
      <div
        className="flex items-center gap-4 cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        <div className="w-16 h-16 rounded-full bg-[#2b4560] flex items-center justify-center overflow-hidden shadow-inner">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-serif font-extrabold tracking-wide select-none leading-none">
          Hipocapp
        </h1>
      </div>

      {/* Orta: Arama Formu */}
      <form
        onSubmit={handleSearchSubmit}
        role="search"
        className="max-w-md ml-10 flex-1"
      >
        <input
          type="text"
          name="search"
          placeholder="Başlık ara..."
          className="w-full rounded-md py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B4560]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Başlık ara"
          autoComplete="off"
        />
      </form>

      {/* Sağ: Kullanıcı menüsü */}
      <div className="flex items-center gap-4 ml-6">
        {user === null ? (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-md bg-[#2b4560] hover:bg-[#3e5b78] shadow-md transition-colors font-semibold"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => navigate('/sign-up')}
              className="px-5 py-2 rounded-md border-2 border-[#2b4560] text-[#2b4560] hover:bg-[#3e5b78] hover:text-white shadow-md transition-colors font-semibold"
            >
              Kaydol
            </button>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1 bg-[#2b4560] hover:bg-[#3e5b78] px-4 py-2 rounded-md shadow-md font-semibold transition-colors focus:outline-none"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              {user.username}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  menuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
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
        )}
      </div>
    </header>
  );
};

export default Header;
