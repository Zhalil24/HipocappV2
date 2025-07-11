import React, { useState } from "react";
import {
  FaTheaterMasks,
  FaVial,
  FaUserGraduate,
  FaBriefcaseMedical,
} from "react-icons/fa";

const menuItems = [
  {
    id: 1,
    icon: <FaBriefcaseMedical />,
    label: "Tıp",
    subItems: [
      "• Temel Tıp",
      "• Dahili Tıp",
      "• Cerrahi Tıp",
      "• Pratisyen",
      "• Diş Hekimliği",
      "• Eczacılık",
    ],
  },
  {
    id: 2,
    icon: <FaTheaterMasks />,
    label: "Kültür Sanat",
    subItems: [
      "• Müzik",
      "• Edebiyat",
      "• Sinema ve Tiyatro",
      "• Kitap, Dergi ve Gazeteler",
    ],
  },
  {
    id: 3,
    icon: <FaVial />,
    label: "Bilim",
    subItems: [
      "• Mühendislik-Mimari",
      "• Matematik-Fizik",
      "• Kimya-Biyoloji",
      "• Dil-Tarih-Coğrafya",
      "• Eğitim-Psikoloji-Felsefe",
      "• Ekonomi-Hukuk",
    ],
  },
  {
    id: 4,
    icon: <FaUserGraduate />,
    label: "Öğrenci",
    subItems: [
      "• Üniversiteler ve Bölümler",
      "• Denklikler ve Geçişler",
      "• Genel Konular",
    ],
  },
];

const Sidebar = ({ activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null); // hangi dropdown açık

  const toggleDropdown = (id) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
    }
  };

  return (
    <>
      <aside
        className={`fixed z-30 inset-y-0 left-0 transform bg-gradient-to-b from-[#2B4560] to-[#1f3550] text-white w-64 p-6 shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex items-center gap-3 text-[#FFD700] text-3xl font-bold mb-10">
          <span className="tracking-wider">Hipocapp</span>
        </div>

        <nav className="flex flex-col gap-2 text-[17px] font-medium">
          {menuItems.map(({ id, icon, label, subItems }) => (
            <div key={id}>

              {/* Menü başlığı */}
              <button
                onClick={() => {
                  setActiveMenu(id);
                  toggleDropdown(id);
                }}
                className={`flex items-center justify-between gap-4 w-full px-5 py-3 rounded-xl transition-all duration-300
                  ${
                    activeMenu === id
                      ? "bg-[#FFD700] text-[#2B4560] shadow-md shadow-yellow-300/40 scale-[1.05]"
                      : "hover:bg-yellow-400/30 hover:text-[#FFD700] hover:scale-105"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">{icon}</span>
                  {label}
                </div>
                {/* Açılır/kapanır ok */}
                <span className={`transform transition-transform duration-300 ${openDropdown === id ? "rotate-90" : "rotate-0"}`}>
                  ▶
                </span>
              </button>

              {/* Alt menü */}
              {openDropdown === id && (
                <ul className="mt-1 ml-12 flex flex-col gap-2 text-sm text-[#FFD700]">
                  {subItems.map((subLabel, index) => (
                    <li
                      key={index}
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        // İstersen burada alt menü seçeneğine tıklama işlemi yapabilirsin
                        console.log("Seçilen alt menü:", subLabel);
                      }}
                    >
                      {subLabel}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-40 z-20 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
