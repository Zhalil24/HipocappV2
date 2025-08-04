import AuthInput from "@/components/AuthInput";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { registerUser } from "@/store/slices/registerSlice";
import logo from "../../layout/layouts/Header/logo.png";
import { useNavigate } from "react-router";
import InfoPopup from "@/components/InfoPopup/InfoPopup";

const titleOptions = [
  "Doktor",
  "Diş Hekimi",
  "Akademisyen",
  "Sosyal Bilimci",
  "Doğa Bilimci",
];

// Basit SelectInput componenti
const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: string[];
}) => (
  <div>
    <label className="block text-[#2B4560] font-semibold mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B4560]"
      required
    >
      <option value="" disabled>
        Seçiniz
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// Basit FileInput componenti
const FileInput = ({
  label,
  name,
  onChange,
}: {
  label: string;
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => (
  <div>
    <label className="block text-[#2B4560] font-semibold mb-1">{label}</label>
    <input
      type="file"
      name={name}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2B4560]"
      accept=".jpg,.jpeg,.png,.pdf"
      required
    />
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const registerState = useSelector((state: RootState) => state.register);
  const serviceMessage = registerState.message;
  const [showPopup, setShowPopup] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      userName: "",
      phoneNumber: "",
      email: "",
      password: "",
      passwordRepeat: "",
      title: "",
      institutionIdFile: null as File | null,
      isTermsAccepted: false,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (values.password !== values.passwordRepeat) {
        errors.passwordRepeat = "Şifreler eşleşmiyor.";
      }
      if (!values.isTermsAccepted) {
        errors.isTermsAccepted = "Kullanım şartlarını kabul etmelisiniz.";
      }
      return errors;
    },
    onSubmit: (values) => {
      // FormData ile dosya dahil gönderim
      const formData = new FormData();
      formData.append("name", values.firstName);
      formData.append("surname", values.lastName);
      formData.append("userName", values.userName);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("passwordRepeat", values.passwordRepeat);
      formData.append("degreeId", "1");
      formData.append("isTermsAccepted", values.isTermsAccepted.toString());
      if (values.institutionIdFile) {
        formData.append("image", values.institutionIdFile);
      }

      dispatch(registerUser(formData));
    },
  });

  useEffect(() => {
    if (serviceMessage) {
      setShowPopup(true);
    }
  }, [serviceMessage]);

  useEffect(() => {
    if (registerState.success) {
      navigate("/login");
    }
  }, [registerState.success, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      formik.setFieldValue("institutionIdFile", e.currentTarget.files[0]);
    }
  };

  return (
    <div>
      {showPopup && serviceMessage && (
        <InfoPopup
          message={serviceMessage}
          type={registerState.success ? "success" : "error"}
          onClose={() => setShowPopup(false)}
        />
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="bg-white border-2 border-[#FFB700] rounded-3xl shadow-2xl p-8 w-full max-w-md space-y-5">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-40 h-40 rounded-full bg-[#2b4560] flex items-center justify-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#2B4560] font-semibold mb-1">
                Ad
              </label>
              <AuthInput
                type="text"
                placeholder="Adınız"
                icon="user"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}

              />
            </div>

            <div>
              <label className="block text-[#2B4560] font-semibold mb-1">
                Soyad
              </label>
              <AuthInput
                type="text"
                placeholder="Soyadınız"
                icon="user"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}

              />
            </div>

            <div>
              <label className="block text-[#2B4560] font-semibold mb-1">
                Kullanıcı adı
              </label>
              <AuthInput
                type="text"
                placeholder="Kullanıcı adı"
                icon="user"
                name="userName"
                value={formik.values.userName}
                onChange={formik.handleChange}

              />
            </div>

            <div>
              <label className="block text-[#2B4560] font-semibold mb-1">
                Telefon Numarası
              </label>
              <AuthInput
                type="tel"
                placeholder="Telefon numaranız"
                //icon="phone"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}

              />
            </div>

            <div>
              <label className="block text-[#2B4560] font-semibold mb-1">
                E-posta
              </label>
              <AuthInput
                type="email"
                placeholder="E-posta adresiniz"
                //icon="envelope"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}

              />
            </div>

            <div>
              <label className="block text-[#2B4560] font-semibold mb-1">
                Şifre
              </label>
              <AuthInput
                type="password"
                placeholder="********"
                icon="lock"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}

              />
            </div>

            <div>
              <label className="block text-[#2B4560] font-semibold mb-1">
                Şifre Tekrarı
              </label>
              <AuthInput
                type="password"
                placeholder="********"
                icon="lock"
                name="passwordRepeat"
                value={formik.values.passwordRepeat}
                onChange={formik.handleChange}

              />
              {formik.errors.passwordRepeat && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.passwordRepeat}
                </p>
              )}
            </div>

            <SelectInput
              label="Ünvan Seçimi"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              options={titleOptions}
            />

            <FileInput
              label="Kurum Kimliği Seçin"
              name="institutionIdFile"
              onChange={handleFileChange}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isTermsAccepted"
                name="isTermsAccepted"
                checked={formik.values.isTermsAccepted}
                onChange={formik.handleChange}
                className="form-checkbox h-5 w-5 text-[#2B4560] rounded"
              />
              <label htmlFor="isTermsAccepted" className="text-sm text-[#2B4560]">
                Kullanım şartlarını kabul ediyorum
              </label>
            </div>
            {formik.errors.isTermsAccepted && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.isTermsAccepted}
              </p>
            )}


            <button
              type="submit"
              disabled={registerState.loading}
              className="w-full bg-[#2B4560] text-[#ffffff] font-bold py-2.5 rounded-lg hover:brightness-105 shadow-md transition-all disabled:opacity-70"
            >
              {registerState.loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
            </button>

            <div className="text-center text-sm text-gray-600 mt-2">
              Zaten hesabınız var mı?
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="bg-[#2B4560] hover:bg-[#1f3550] text-white font-bold py-2.5 px-6 mt-2 rounded-full shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#2B4560]/50"
              >
                Giriş Yap
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
