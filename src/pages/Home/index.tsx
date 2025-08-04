import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLastEntries } from '../../store/slices/entrySlice';
import { fetchRandomEntries } from '../../store/slices/randomEntrySlice';
import {
  fetchTitlesByHeaderName,
  clearTitles,
} from '../../store/slices/titleListSlice';
import { fetchEntriesByTitleName } from '../../store/slices/titleEntrySlice';
import EntryCard from '../../components/EntryCard';
import Sidebar from '../../components/Sidebar/Sidebar';
import { AppDispatch, RootState } from '../../store/store';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [entryMode, setEntryMode] = useState<'daily' | 'stream'>('daily');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const dailyEntriesState = useSelector((state: RootState) => state.entries);
  const randomEntriesState = useSelector(
    (state: RootState) => state.randomEntries
  );
  const titleListState = useSelector((state: RootState) => state.titleList);
  const titleEntryState = useSelector((state: RootState) => state.titleEntry);

  const pages = [
    { name: 'Market', path: '/market' },
    { name: 'İlanlar', path: '/ads' },
    { name: 'Eğitimler', path: '/educations' },
    { name: 'Partnerlerimiz', path: '/partners' },
    { name: 'Hakkımızda', path: '/about' },
    { name: 'İletişim', path: '/contact' },
  ];

  // URL parametrelerini oku
  useEffect(() => {
    const params = queryString.parse(location.search);

    // Search parametresi varsa state güncelle
    const newSearch =
      typeof params.search === 'string' && params.search.trim() !== ''
        ? params.search.trim()
        : '';

    // Category parametresi varsa state güncelle (sadece search yoksa)
    const newCategory =
      !newSearch && typeof params.category === 'string' && params.category.trim() !== ''
        ? params.category.trim()
        : null;

    if (newSearch !== searchTerm) {
      setSearchTerm(newSearch);
      setSelectedCategory(null); // Arama varsa category iptal
    } else if (newCategory !== selectedCategory && !newSearch) {
      setSelectedCategory(newCategory);
      setSearchTerm('');
    }
  }, [location.search]);

  // Arama varsa arama API çağrısı, yoksa category ya da entryMode'a göre çağrı
  useEffect(() => {
    if (searchTerm) {
      // Arama terimi varsa titleName bazlı entryleri getir
      dispatch(fetchEntriesByTitleName(searchTerm));
      dispatch(clearTitles());
    } else if (selectedCategory) {
      // Kategori seçiliyse başlıkları getir
      dispatch(fetchTitlesByHeaderName(selectedCategory));
    } else {
      // Hiçbiri yoksa entryMode'a göre entryleri getir
      if (entryMode === 'daily') {
        dispatch(fetchLastEntries());
      } else {
        dispatch(fetchRandomEntries());
      }
      dispatch(clearTitles());
    }
  }, [dispatch, searchTerm, selectedCategory, entryMode]);

  const currentEntries =
    searchTerm
      ? titleEntryState.entries
      : selectedCategory && titleEntryState.entries.length > 0
      ? titleEntryState.entries
      : entryMode === 'daily'
      ? dailyEntriesState.data
      : randomEntriesState.data;

  const loading =
    searchTerm
      ? titleEntryState.loading
      : selectedCategory
      ? titleEntryState.loading
      : entryMode === 'daily'
      ? dailyEntriesState.loading
      : randomEntriesState.loading;

  const error =
    searchTerm
      ? titleEntryState.error
      : selectedCategory
      ? titleEntryState.error
      : entryMode === 'daily'
      ? dailyEntriesState.error
      : randomEntriesState.error;

  const handleModeChange = (mode: 'daily' | 'stream') => {
    setEntryMode(mode);
    setSelectedCategory(null);
    setSearchTerm('');
    dispatch(clearTitles());
    navigate('/'); // Query temizlemek için
  };

  const handleSidebarSelect = (subItemApiName: string) => {
    setSelectedCategory(subItemApiName);
    setSearchTerm('');
    dispatch(fetchTitlesByHeaderName(subItemApiName));
    navigate(`/?category=${encodeURIComponent(subItemApiName)}`);
  };

  const handleTitleSelect = (titleName: string) => {
    dispatch(fetchEntriesByTitleName(titleName));
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-84 min-w-64 ml-7">
        <Sidebar
          onSelect={handleSidebarSelect}
          titles={titleListState.titles}
          loadingTitles={titleListState.loading}
          titlesError={titleListState.error}
          onTitleSelect={handleTitleSelect}
        />
      </div>

      {/* İçerik */}
      <div className="flex-1 flex flex-col mt-8 mr-20">
        {/* Sayfa butonları */}
        <div className="mt-[88.5px] mb-6 w-full px-6">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4">
            {pages.map((page) => (
              <button
                key={page.name}
                onClick={() => navigate(page.path)}
                className="text-[#2B4560] border border-[#2B4560] px-6 py-3 rounded-lg font-medium hover:bg-[#2B4560] hover:text-white transition-all duration-200 shadow-sm"
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>

        {/* Daily / Stream butonları ve entry listesi */}
        <main className="flex-1 w-full px-6 pb-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="space-x-4">
                <button
                  onClick={() => handleModeChange('daily')}
                  className={`px-6 py-3 rounded-lg border font-semibold text-lg ${
                    entryMode === 'daily'
                      ? 'bg-[#2B4560] text-white'
                      : 'bg-white text-[#2B4560] border-[#2B4560]'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => handleModeChange('stream')}
                  className={`px-6 py-3 rounded-lg border font-semibold text-lg ${
                    entryMode === 'stream'
                      ? 'bg-[#2B4560] text-white'
                      : 'bg-white text-[#2B4560] border-[#2B4560]'
                  }`}
                >
                  Stream
                </button>
              </div>
            </div>

            {loading && <p className="text-[#2B4560]">Yükleniyor...</p>}
            {error && <p className="text-red-500">Hata: {error}</p>}

            <div className="grid gap-6">
              {currentEntries?.length === 0 && !loading && (
                <p className="text-gray-600">Gösterilecek entry yok.</p>
              )}

              {currentEntries?.map((entry) => (
                <EntryCard
                  key={entry.id}
                  titleName={entry.titleName}
                  entryDescription={
                    entry.entryDescription ||
                    entry.description ||
                    'Açıklama bulunamadı.'
                  }
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
  );
};

export default HomePage;
