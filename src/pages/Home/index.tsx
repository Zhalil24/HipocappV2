import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLastEntries } from '../../store/slices/entrySlice'; // daily
import { fetchRandomEntries } from '../../store/slices/randomEntrySlice'; // stream
import EntryCard from '../../components/EntryCard';
import { AppDispatch, RootState } from '../../store/store';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [entryMode, setEntryMode] = useState<'daily' | 'stream'>('daily');

  const dailyEntriesState = useSelector((state: RootState) => state.entries);
  const randomEntriesState = useSelector(
    (state: RootState) => state.randomEntries
  );

  const currentEntries =
    entryMode === 'daily' ? dailyEntriesState : randomEntriesState;

  useEffect(() => {
    if (entryMode === 'daily') {
      dispatch(fetchLastEntries());
    } else {
      dispatch(fetchRandomEntries());
    }
  }, [dispatch, entryMode]);

  const handleModeChange = (mode: 'daily' | 'stream') => {
    setEntryMode(mode);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-grow overflow-y-auto px-6 py-10">
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
