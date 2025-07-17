import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLastEntries } from '../../store/slices/entrySlice';
import { fetchRandomEntries } from '../../store/slices/randomEntrySlice';
import { fetchTitlesByHeaderName } from '../../store/slices/titleListSlice';
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

  const currentEntries =
    entryMode === 'daily' ? dailyEntriesState : randomEntriesState;

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
  };

  const handleSidebarSelect = (subItemApiName: string) => {
    console.log('Seçilen kategori apiName:', subItemApiName);

    setSelectedCategory(subItemApiName);
    dispatch(fetchTitlesByHeaderName(subItemApiName));
  };

  return (
    <div className="min-h-screen flex font-sans">
      <Sidebar onSelect={handleSidebarSelect} />

      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
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

            {selectedCategory && (
              <p className="mb-4 text-[#2B4560] font-medium">
                Seçilen Alt Başlık: {selectedCategory}
              </p>
            )}

            {selectedCategory && (
              <>
                {titleListState.loading && (
                  <p className="text-[#2B4560]">Başlıklar yükleniyor...</p>
                )}
                {titleListState.error && (
                  <p className="text-red-500">{titleListState.error}</p>
                )}
                {titleListState.titles.length > 0 && (
                  <div className="grid gap-6 mb-10">
                    {titleListState.titles.map((title) => (
                      <div
                        key={title.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                      >
                        <p className="text-[#2B4560] font-medium">
                          {title.name}
                          
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {!selectedCategory && (
              <>
                {currentEntries.loading && (
                  <p className="text-[#2B4560]">Yükleniyor...</p>
                )}
                {currentEntries.error && (
                  <p className="text-red-500">Hata: {currentEntries.error}</p>
                )}
                <div className="grid gap-6">
                  {currentEntries.data?.length === 0 && (
                    <p className="text-gray-600">Gösterilecek entry yok.</p>
                  )}
                  {currentEntries.data?.map((entry) => (
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
