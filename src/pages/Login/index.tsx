import AuthInput from "@/components/AuthInput";
import React, { useEffect } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useFormik } from 'formik';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchLogin } from "@/store/slices/loginSlice";
import logo from '../../layout/layouts/Header/logo.png';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userLoginState = useSelector((state: RootState) => state.login);

  const formik = useFormik({
    initialValues: {
      userName: '',
      password: ''
    },
    onSubmit: (values) => {
      dispatch(fetchLogin(values))
    }
  });

  useEffect(() => {
    if (userLoginState.userRole == 'kullanıcı') {
      // anasayfa git 
    }
    else{
      // admin paneline git 
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="min-h-screen flex items-center justify-center  px-4">
        <div className="bg-white border-2 border-[#FFB700] rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-5">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#2b4560] flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#2B4560] tracking-tight">
              Giriş Yap
            </h2>
          </div>

          <div>
            <label className="block text-[#2B4560] font-semibold mb-1">
              Kullanıcı adı
            </label>
            <AuthInput
              type="text"
              placeholder="Kullanıcı adı"
              icon="user"
              value={formik.values.userName}
              onChange={formik.handleChange}
              name="userName"
            />
          </div>
          <div>
            <label className="block text-[#2B4560] font-semibold mb-1">
              Şifre
            </label>
            <AuthInput
              type="text"
              placeholder="********"
              icon="lock"
              value={formik.values.password}
              onChange={formik.handleChange}
              name="password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#2B4560] text-[#ffffff] font-bold py-2.5 rounded-lg hover:brightness-105 shadow-md transition-all"
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
        </div>
      </div>
    </form>

  );
};

export default Login;
