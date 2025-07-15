import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLastEntries } from '../../store/slices/entrySlice'; 
import { fetchRandomEntries } from '../../store/slices/randomEntrySlice'; 
import EntryCard from '../../components/EntryCard';
import { AppDispatch, RootState } from '../../store/store';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [entryMode, setEntryMode] = useState<'daily' | 'stream'>('daily');

  const dailyEntriesState = useSelector((state: RootState) => state.entries);
  const randomEntriesState = useSelector((state: RootState) => state.randomEntries);


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
                    className={`px-4 py-2 rounded-lg border ${entryMode === 'daily'
                      ? 'bg-[#011f26] text-white'
                      : 'bg-white text-[#2B4560] border-[#2B4560]'
                      }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => handleModeChange('stream')}
                    className={`px-4 py-2 rounded-lg border ${entryMode === 'stream'
                      ? 'bg-[#011f26] text-white'
                      : 'bg-white text-[#2B4560] border-[#2B4560]'
                      }`}
                  >
                    Stream
                  </button>
                </div>
              </div>

              <div>
                {entryMode === 'daily' && dailyEntriesState.loading && (
                  <p className="text-[#2B4560]">Günlük entry'ler yükleniyor...</p>
                )}
                {entryMode === 'stream' && randomEntriesState.loading && (
                  <p className="text-[#2B4560]">Anlık entry'ler yükleniyor...</p>
                )}

                {entryMode === 'daily' && dailyEntriesState.error && (
                  <p className="text-red-500">Hata: {dailyEntriesState.error}</p>
                )}
                {entryMode === 'stream' && randomEntriesState.error && (
                  <p className="text-red-500">Hata: {randomEntriesState.error}</p>
                )}

                <div className="grid gap-6">
                  {entryMode === 'daily' &&
                    dailyEntriesState.data?.map((entry) => (
                      <EntryCard
                        key={entry.id}
                        titleName={entry.titleName}
                        entryDescription={entry.entryDescription}
                        userName={entry.userName}
                        userNameSurname={entry.userNameSurname}
                        date={entry.date}
                      />
                    ))}

                  {entryMode === 'stream' &&
                    randomEntriesState.data?.map((entry) => (
                      <EntryCard
                        key={entry.id}
                        titleName={entry.titleName}
                        description={entry.description}
                        createDate={entry.createDate}
                      />
                    ))}
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
