import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthInput from "@/components/AuthInput";
import InfoPopup from "@/components/InfoPopup/InfoPopup";
import logo from "@/layout/layouts/UserHome/Header/logo.png";
import { BaseServiceInstance } from "@/core/services/baseService";

type TokenState = "checking" | "valid" | "invalid";

interface ResetPasswordRequest {
    token: string;
    password: string;
    passwordRe: string;
}

// Same rule as the backend: at least 8 characters with upper case, lower case and a digit.
const PASSWORD_RULE = /^(?=.*[a-zçğıöşü])(?=.*[A-ZÇĞİÖŞÜ])(?=.*\d).{8,}$/;

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [tokenState, setTokenState] = useState<TokenState>("checking");
    const [password, setPassword] = useState("");
    const [passwordRe, setPasswordRe] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [popup, setPopup] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        if (!token) {
            setTokenState("invalid");
            return;
        }
        BaseServiceInstance.get<unknown>("api/user/ResetPassword/Validate", { token }).then((res) =>
            setTokenState(res.isSuccess ? "valid" : "invalid")
        );
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPopup(null);
        if (!PASSWORD_RULE.test(password)) {
            setPopup({
                type: "error",
                msg: "Şifre en az 8 karakter olmalı; büyük harf, küçük harf ve rakam içermeli.",
            });
            return;
        }
        if (password !== passwordRe) {
            setPopup({ type: "error", msg: "Şifreler uyuşmuyor." });
            return;
        }

        setSubmitting(true);
        const res = await BaseServiceInstance.post<ResetPasswordRequest, unknown>("api/user/ResetPassword", {
            token,
            password,
            passwordRe,
        });
        setSubmitting(false);

        if (res.isSuccess) {
            setDone(true);
        } else {
            setPopup({ type: "error", msg: res.message || "Şifre değiştirilemedi. Lütfen tekrar deneyin." });
        }
    };

    return (
        <div>
            {popup && <InfoPopup message={popup.msg} type={popup.type} onClose={() => setPopup(null)} />}

            <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-8 md:py-12 bg-gradient-to-br from-[#f8fafc] via-white to-[#eef2f7]">
                <div className="w-full max-w-[520px] bg-white/95 backdrop-blur border border-[#FFB700]/70 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 md:p-8 animate-fade-in-up">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-[#2B4560] flex items-center justify-center ring-4 ring-[#FFB700]/20">
                            <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                        </div>
                    </div>

                    {tokenState === "checking" && (
                        <p className="text-center text-sm text-gray-600 animate-pulse">Bağlantı kontrol ediliyor...</p>
                    )}

                    {tokenState === "invalid" && (
                        <div className="text-center">
                            <h1 className="text-xl font-bold text-[#2B4560]">Bağlantı geçersiz</h1>
                            <p className="text-sm text-gray-600 mt-2">
                                Bu şifre sıfırlama bağlantısı geçersiz ya da süresi dolmuş. Yeni bir bağlantı isteyebilirsin.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate("/forgotpassword")}
                                className="mt-6 bg-[#2B4560] text-white font-bold py-2.5 px-8 rounded-lg hover:brightness-110 active:scale-[0.98] shadow-md transition-all"
                            >
                                Yeni bağlantı iste
                            </button>
                        </div>
                    )}

                    {tokenState === "valid" && done && (
                        <div className="text-center">
                            <h1 className="text-xl font-bold text-[#2B4560]">Şifren değişti</h1>
                            <p className="text-sm text-gray-600 mt-2">Yeni şifrenle giriş yapabilirsin.</p>
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="mt-6 bg-[#2B4560] text-white font-bold py-2.5 px-8 rounded-lg hover:brightness-110 active:scale-[0.98] shadow-md transition-all"
                            >
                                Giriş yap
                            </button>
                        </div>
                    )}

                    {tokenState === "valid" && !done && (
                        <form onSubmit={handleSubmit}>
                            <div className="text-center mb-6">
                                <h1 className="text-xl font-bold text-[#2B4560]">Yeni şifre belirle</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    En az 8 karakter; büyük harf, küçük harf ve rakam içermeli.
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-[#2B4560] font-semibold mb-1">Yeni şifre</label>
                                <AuthInput
                                    type="password"
                                    icon="lock"
                                    name="password"
                                    placeholder="Yeni şifre"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-[#2B4560] font-semibold mb-1">Yeni şifre (tekrar)</label>
                                <AuthInput
                                    type="password"
                                    icon="lock"
                                    name="passwordRe"
                                    placeholder="Yeni şifre (tekrar)"
                                    value={passwordRe}
                                    onChange={(e) => setPasswordRe(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-[#2B4560] text-white font-bold py-2.5 px-8 rounded-lg hover:brightness-110 active:scale-[0.98] shadow-md transition-all disabled:opacity-70"
                                >
                                    {submitting ? "Kaydediliyor..." : "Şifreyi değiştir"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
