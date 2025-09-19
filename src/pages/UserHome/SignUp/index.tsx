import AuthInput from "@/components/AuthInput";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { registerUser } from "@/store/slices/registerSlice";
import logo from "../../../layout/layouts/UserHome/Header/logo.png";
import { useNavigate } from "react-router";
import InfoPopup from "@/components/InfoPopup/InfoPopup";
import { toast, ToastContainer } from "react-toastify";
const titleOptions = [
  { id: 1, label: "Doktor" },
  { id: 2, label: "Diş Hekimi" },
  { id: 3, label: "Akademisyen" },
  { id: 4, label: "Sosyal Bilimci" },
];

type Option = string | { value: string | number; label: string };
interface RegisterFormValues {
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  passwordRepeat: string;
  title: string | number;
  institutionIdFile?: File | Blob | string | null;
  isTermsAccepted: boolean;
  identityNumber: string;
}

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: Option[];
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
      {options.map((opt) =>
        typeof opt === "string" ? (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ) : (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )
      )}
    </select>
  </div>
);

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
  const [showPopup, setShowPopup] = useState(false);
  const serviceMessage = useSelector((state: RootState) => state.register.message);

    const appendSmartImage = async (formData: FormData, key: string, file: File | Blob | string) => {
    if (file instanceof File || file instanceof Blob) {
      formData.append(key, file);
    } else if (typeof file === "string" && file.startsWith("data:image")) {
      const base64 = file.split(",")[1];
      const byteCharacters = atob(base64);
      const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      formData.append(key, blob, "upload.jpg");
    } else if (typeof file === "string" && file.startsWith("file://")) {
      const response = await fetch(file);
      const blob = await response.blob();
      formData.append(key, blob, "upload.jpg");
    }
  };


 const formik = useFormik<RegisterFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      userName: "",
      phoneNumber: "",
      email: "",
      password: "",
      passwordRepeat: "",
      title: "",
      institutionIdFile: null,
      isTermsAccepted: false,
      identityNumber: "",
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
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.firstName);
      formData.append("surname", values.lastName);
      formData.append("userName", values.userName);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("passwordRepeat", values.passwordRepeat);
      formData.append("degreeId", values.title.toString());
      formData.append("identityNumber", "a");
      formData.append("isTermsAccepted", values.isTermsAccepted.toString());

      if (values.institutionIdFile) {
        await appendSmartImage(formData, "image", values.institutionIdFile);
      }

      try {
        const response = await dispatch(registerUser(formData)).unwrap();
        toast.info(response.message, { autoClose: 5000, position: "top-right" });
      } catch (err: any) {
        console.error("Kayıt hatası:", err);
        if (err?.status === 400) {
          toast.error("Başarısız, tekrar deneyiniz", { autoClose: 5000, position: "top-right" });
        } else if (err?.message) {
          toast.error(err.message, { autoClose: 5000, position: "top-right" });
        } else {
          toast.error("Bilinmeyen bir hata oluştu", { autoClose: 5000, position: "top-right" });
        }
      }
    },
  });


  useEffect(() => {
    if (registerState.isSuccess && serviceMessage) {
      toast.info(serviceMessage, {
        toastId: Date.now().toString(),
        autoClose: 3000,
        onClose: () => navigate("/login")
      });
    }
  }, [registerState.isSuccess, serviceMessage, navigate]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      formik.setFieldValue("institutionIdFile", e.currentTarget.files[0]);
    }
  };

  return (
    <div>


      <form onSubmit={formik.handleSubmit}>
        {/* Tam ekran ortalama + kenarlardan boşluk */}
        <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-8 md:py-12 bg-gradient-to-br from-[#f8fafc] via-white to-[#eef2f7]">
          {/* Kompakt, dikdörtgen kart */}
          <div className="w-full max-w-[750px] bg-white/95 backdrop-blur border border-[#FFB700]/70 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 md:p-8">

            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-28 h-28 rounded-full bg-[#2B4560] flex items-center justify-center ring-4 ring-[#FFB700]/20">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Form grid: md ve üstünde 2 sütun, mobilde 1 sütun */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#2B4560] font-semibold mb-1">Ad</label>
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
                <label className="block text-[#2B4560] font-semibold mb-1">Soyad</label>
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
                <label className="block text-[#2B4560] font-semibold mb-1">Kullanıcı adı</label>
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
                <label className="block text-[#2B4560] font-semibold mb-1">Telefon Numarası</label>
                <AuthInput
                  type="tel"
                  placeholder="Telefon numaranız"
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                />
              </div>

              {/* E-posta tek satırda geniş alan kullansın */}
              <div className="md:col-span-2">
                <label className="block text-[#2B4560] font-semibold mb-1">E-posta</label>
                <AuthInput
                  type="email"
                  placeholder="E-posta adresiniz"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label className="block text-[#2B4560] font-semibold mb-1">Şifre</label>
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
                <label className="block text-[#2B4560] font-semibold mb-1">Şifre Tekrarı</label>
                <AuthInput
                  type="password"
                  placeholder="********"
                  icon="lock"
                  name="passwordRepeat"
                  value={formik.values.passwordRepeat}
                  onChange={formik.handleChange}
                />
                {formik.errors.passwordRepeat && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.passwordRepeat}</p>
                )}
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput
                  label="Ünvan Seçimi"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  options={titleOptions.map((t) => ({ value: t.id, label: t.label }))}
                />


                <input
                  type="file"
                  name="institutionIdFile"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      formik.setFieldValue("institutionIdFile", e.target.files[0]);
                    }
                  }}
                />
              </div>


              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isTermsAccepted"
                    name="isTermsAccepted"
                    checked={formik.values.isTermsAccepted}
                    onChange={formik.handleChange}
                    className="h-5 w-5 text-[#2B4560] rounded border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => window.open("/kvkk", "_blank")}
                    className="text-sm text-[#2B4560] underline hover:text-[#FFB700]"
                  >
                    Kullanım şartlarını kabul ediyorum
                  </button>
                </div>
                {formik.errors.isTermsAccepted && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.isTermsAccepted}</p>
                )}
              </div>
              <div className="md:col-span-2 flex justify-center">
                <button
                  type="submit"
                  disabled={registerState.loading}
                  className="bg-[#2B4560] text-white font-bold py-2.5 px-10 rounded-lg hover:brightness-105 shadow-md transition-all disabled:opacity-70"
                >
                  {registerState.loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
                </button>
              </div>



            </div>
          </div>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    </div>
  );

};

export default Register;
