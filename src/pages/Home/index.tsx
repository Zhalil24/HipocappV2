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
import PageButtons from '@/components/PageButtons';

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
  ];


  useEffect(() => {
    const params = queryString.parse(location.search);


    const newSearch =
      typeof params.search === 'string' && params.search.trim() !== ''
        ? params.search.trim()
        : '';

    const newCategory =
      !newSearch &&
      typeof params.category === 'string' &&
      params.category.trim() !== ''
        ? params.category.trim()
        : null;

    if (newSearch !== searchTerm) {
      setSearchTerm(newSearch);
      setSelectedCategory(null);
    } else if (newCategory !== selectedCategory && !newSearch) {
      setSelectedCategory(newCategory);
      setSearchTerm('');
    }
  }, [location.search]);

  

  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchEntriesByTitleName(searchTerm));
      dispatch(clearTitles());
    } else if (selectedCategory) {
      dispatch(fetchTitlesByHeaderName(selectedCategory));
    } else {
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
    navigate('/');
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
    <div className="min-h-screen flex justify-center items-start bg-gray-50 font-sans">
      {/* Dikey yapı: Üstte butonlar, altta yan yana sidebar + content */}
      <div className="flex flex-col w-full max-w-6xl px-6 mt-32">

        {/* ✅ Sidebar + Content yatay yapısı */}
        <div className="flex w-full gap-2">
          {/* Sidebar */}
          <div className="w-84 min-w-84 ml-8">
            <Sidebar
              onSelect={handleSidebarSelect}
              titles={titleListState.titles}
              loadingTitles={titleListState.loading}
              titlesError={titleListState.error}
              onTitleSelect={handleTitleSelect}
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <main className="flex-1 w-full pb-12 overflow-y-auto">
              <div className="max-w-3xl mx-auto">

                {/* ✅ Daily / Stream + Sayfa Butonları Aynı Satırda */}
                <div className="flex items-center justify-between mb-6 w-full max-w-3xl mx-auto gap-4">

                  {/* Sol: Daily / Stream */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleModeChange('daily')}
                      className={`px-4 py-2 rounded-md border font-medium text-sm ${entryMode === 'daily'
                          ? 'bg-[#2B4560] text-white'
                          : 'bg-white text-[#2B4560] border-[#2B4560]'
                        }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => handleModeChange('stream')}
                      className={`px-4 py-2 rounded-md border font-medium text-sm ${entryMode === 'stream'
                          ? 'bg-[#2B4560] text-white'
                          : 'bg-white text-[#2B4560] border-[#2B4560]'
                        }`}
                    >
                      Stream
                    </button>
                  </div>

                  {/* Sağ: Otomatik Kayan Sayfa Butonları */}
                  <div className="flex-1 overflow-hidden">
                    <PageButtons pages={pages} navigate={navigate} />
                  </div>
                </div>


                {loading && <p className="text-[#2B4560]">Yükleniyor...</p>}
                {error && <p className="text-red-500">Hata: {error}</p>}

                <div className="grid gap-5">
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
      </div>
    </div>
  );

};

export default HomePage;
