import React from 'react';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#011f26] text-[#FDF6EC] shadow-md px-6 py-1 flex items-center justify-between flex-wrap gap-8
                       fixed top-0 left-0 w-full h-35 z-50">
      <div className="flex items-center gap-4">
        <div className="w-15 h-20 rounded-full bg-[#2b4560] flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Times New Roman, Times, serif" }} >
          Hipocapp
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 rounded-md bg-[#011f26] text-white hover:bg-[#1f3347] transition" onClick={() => navigate('/login')}>
          Giriş Yap
        </button>
        <button className="px-4 py-2 rounded-md border border-[#011f26] text-[#FDF6EC] hover:bg-[#1f3347] hover:text-white transition" onClick={() => navigate('/sign-up')}  >
          Kaydol
        </button>
      </div>
    </header>
  );
};

export default Header;
