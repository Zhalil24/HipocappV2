import React from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC] px-4">
      <div className="bg-white border-2 border-[#FFD700] rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-[#2B4560] mb-6 tracking-tight">
          Giriş Yap
        </h2>

        <form className="space-y-5">
          <div>
            <label className="block text-[#2B4560] font-semibold mb-1">
              E-posta
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#FFD700] transition">
              <FaEnvelope className="text-[#2B4560] mr-3" />
              <input
                type="email"
                placeholder="ornek@mail.com"
                className="w-full outline-none bg-transparent text-[#2B4560] placeholder-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-[#2B4560] font-semibold mb-1">
              Şifre
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#FFD700] transition">
              <FaLock className="text-[#2B4560] mr-3" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full outline-none bg-transparent text-[#2B4560] placeholder-gray-400"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#FFD700] text-[#2B4560] font-bold py-2.5 rounded-lg hover:brightness-105 shadow-md transition-all"
          >
            Giriş
          </button>
          <div className="text-center text-sm text-gray-600 mt-2">
            Hesabınız yok mu?
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-[#2B4560] hover:bg-[#1f3550] text-white font-bold py-2.5 px-6 mt-2 rounded-full shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#2B4560]/50"
            >
              Hemen Kaydolun
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
