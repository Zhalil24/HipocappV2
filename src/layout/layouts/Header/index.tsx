import React from 'react';
import logo from './logo.png';
import UserSearchInput from '../../../components/UserSearchInput';
import TitleSearchInput from '../../../components/TitleSearchInput';

const Header = () => {
  return (
    <header className="bg-[#2b4560] text-[#FDF6EC] shadow-md px-6 py-1 flex items-center justify-between flex-wrap gap-8">
      <div className="flex items-center gap-4">
        <div className="w-15 h-20 rounded-full bg-[#2b4560] flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Times New Roman, Times, serif" }}>
          Hipocapp
        </h1>
      </div>
      <div className="flex items-center gap-4">
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
