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

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [entryMode, setEntryMode] = useState<'daily' | 'stream'>('daily');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const dailyEntriesState = useSelector((state: RootState) => state.entries);
  const randomEntriesState = useSelector(
    (state: RootState) => state.randomEntries
  );
  const titleListState = useSelector((state: RootState) => state.titleList);
  const titleEntryState = useSelector((state: RootState) => state.titleEntry);

  const currentEntries =
    selectedCategory && titleEntryState.entries.length > 0
      ? titleEntryState.entries
      : entryMode === 'daily'
      ? dailyEntriesState.data
      : randomEntriesState.data;

  const loading = selectedCategory
    ? titleEntryState.loading
    : entryMode === 'daily'
    ? dailyEntriesState.loading
    : randomEntriesState.loading;

  const error = selectedCategory
    ? titleEntryState.error
    : entryMode === 'daily'
    ? dailyEntriesState.error
    : randomEntriesState.error;

  useEffect(() => {
    if (!selectedCategory) {
      if (entryMode === 'daily') {
        dispatch(fetchLastEntries());
      } else {
        dispatch(fetchRandomEntries());
      }
    }
  }, [dispatch, entryMode, selectedCategory]);

  const handleModeChange = (mode: 'daily' | 'stream') => {
    setEntryMode(mode);
    setSelectedCategory(null);
    dispatch(clearTitles());
  };

  const handleSidebarSelect = (subItemApiName: string) => {
    setSelectedCategory(subItemApiName);
    dispatch(fetchTitlesByHeaderName(subItemApiName));
  };

  const handleTitleSelect = (titleName: string) => {
    dispatch(fetchEntriesByTitleName(titleName));
  };
  

  return (
    <div className="min-h-screen flex justify-center font-sans bg-gray-50">
      <div className="w-full max-w-6xl flex">
        {/* Sidebar */}
        <Sidebar
          onSelect={handleSidebarSelect}
          titles={titleListState.titles}
          loadingTitles={titleListState.loading}
          titlesError={titleListState.error}
          onTitleSelect={handleTitleSelect}
        />

        {/* İçerik */}
        <div className="flex-1 flex flex-col overflow-hidden ml-6">
          <main className="flex-grow overflow-y-auto mt-10 px-6 py-10 pt-[88.5px]">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="space-x-2">
                  <button
                    onClick={() => handleModeChange('daily')}
                    className={`px-4 py-2 rounded-lg border ${
                      entryMode === 'daily'
                        ? 'bg-[#2B4560] text-white'
                        : 'bg-white text-[#2B4560] border-[#2B4560]'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => handleModeChange('stream')}
                    className={`px-4 py-2 rounded-lg border ${
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
    </div>
  );
};

export default HomePage;
