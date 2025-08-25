import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "@/components/AuthInput";
import InfoPopup from "@/components/InfoPopup/InfoPopup";
import logo from "@/layout/layouts/Header/logo.png";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchForgotPassword } from "@/store/slices/forgotPasswordSlice";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const userLoginState = useSelector((state: RootState) => state.forgotPassword);

    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [popup, setPopup] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const validateEmail = (val: string) =>
        /^\S+@\S+\.\S+$/.test(val);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPopup(null);
        if (!validateEmail(email)) {
            setPopup({ type: "error", msg: "Lütfen geçerli bir e-posta adresi girin." });
            return;
        }
        try {
            setSubmitting(true);
            dispatch(fetchForgotPassword(email));
            setPopup({
                type: "success",
                msg: "Sıfırlama bağlantısı gönderildi. Eğer gelen kutunuzda göremiyorsanız, lütfen spam/junk klasörünüzü de kontrol edin.",
            });

        } catch (err) {
            setPopup({
                type: "error",
                msg: "İşlem sırasında bir sorun oluştu. Lütfen tekrar deneyin.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            {popup && (
                <InfoPopup
                    message={popup.msg}
                    type={popup.type}
                    onClose={() => setPopup(null)}
                />
            )}

            {/* Tam ekran ortalama + kenar boşlukları + arka plan */}
            <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-8 md:py-12 bg-gradient-to-br from-[#f8fafc] via-white to-[#eef2f7]">
                {/* Kompakt kart */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-[520px] bg-white/95 backdrop-blur border border-[#FFB700]/70 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 md:p-8"
                >
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-[#2B4560] flex items-center justify-center ring-4 ring-[#FFB700]/20">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>

                    {/* Başlık & açıklama */}
                    <div className="text-center mb-6">
                        <h1 className="text-xl font-bold text-[#2B4560]">Şifremi Unuttum</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                        </p>
                    </div>

                    {/* Tek input */}
                    <div className="mb-4">
                        <label className="block text-[#2B4560] font-semibold mb-1">E-posta</label>
                        <AuthInput
                            type="email"
                            placeholder="E-posta adresiniz"
                            name="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Submit Butonu: kısa ve ortalı */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-[#2B4560] text-white font-bold py-2.5 px-8 rounded-lg hover:brightness-105 shadow-md transition-all disabled:opacity-70"
                        >
                            {submitting ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                        </button>
                    </div>

                    {/* Alt aksiyonlar */}
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-sm text-[#2B4560] underline hover:text-[#FFB700]"
                        >
                            Giriş sayfasına dön
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
