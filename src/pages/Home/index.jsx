import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLastEntries } from "../../store/slices/entrySlice";
import EntryCard from "../../components/EntryCard";
import { FaBars } from "react-icons/fa";

const HomePage = () => {
  const dispatch = useDispatch();
  const { data: entries, loading, error } = useSelector((state) => state.entries);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchLastEntries());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden ">
        <div className="flex-1 flex flex-col overflow-hidden ">
          <main className="flex-grow overflow-y-auto px-6 py-10 ">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#2B4560] mb-6">Son Eklenen Entry'ler</h2>

              {loading && <p className="text-[#2B4560]">Yükleniyor...</p>}
              {error && <p className="text-red-500">Hata: {error}</p>}

              <div className="grid gap-6">
                {entries?.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    titleName={entry.titleName}
                    entryDescription={entry.entryDescription}
                    userNameSurname={entry.userNameSurname}
                    userName={entry.userName}
                    date={entry.date}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
