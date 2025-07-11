import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLastEntries } from "../../store/slices/entrySlice";
import Header from "../../layout/layouts/Header";
import Footer from "../../layout/layouts/Footer";
import Sidebar from "../../layout/layouts/Sidebar";
import { FaBars } from "react-icons/fa";

const HomePage = () => {
  const dispatch = useDispatch();
  const { data: entries, loading, error } = useSelector((state) => state.entries);

  const [activeMenu, setActiveMenu] = React.useState(1);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchLastEntries());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF6EC] font-sans">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#2B4560] md:hidden focus:outline-none px-4 py-2"
          >
            <FaBars size={24} />
          </button>

          <main className="flex-grow overflow-y-auto px-6 py-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#2B4560] mb-6">Son Eklenen Entry'ler</h2>

              {loading && <p className="text-[#2B4560]">Yükleniyor...</p>}
              {error && <p className="text-red-500">Hata: {error}</p>}

              <div className="grid gap-6">
                {entries?.map((entry) => (
                  <div key={entry.id} className="bg-white p-6 rounded-xl shadow-md border">
                    <h3 className="text-xl font-semibold text-[#2B4560] mb-2">{entry.titleName}</h3>
                    <p className="text-gray-700 text-sm whitespace-pre-line">{entry.entryDescription}</p>
                    <p className="text-xs text-gray-500 mt-2">Yazar: {entry.userNameSurname || entry.userName}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(entry.date).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
