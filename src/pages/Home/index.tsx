import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, createEntry, fetchLastEntries } from '../../store/slices/entrySlice';
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
import { EntryModel } from '@/core/models/entries/entryModel';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [entryMode, setEntryMode] = useState<'daily' | 'stream'>('daily');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [titleName, setTitleName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [selectedTitle, setSelecetedTitle] = useState<boolean>(false);
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
    const userString = localStorage.getItem('user');
    if (userString) {
      const { id } = JSON.parse(userString);
      if (id) {
        setUserId(id);
        setIsLogin(true);
      }
    }
  }, []);

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
    setSelecetedTitle(false);
    dispatch(clearTitles());
    navigate('/');
  };

  const handleSidebarSelect = (subItemApiName: string) => {
    setSelectedCategory(subItemApiName);
    setSearchTerm('');
    dispatch(fetchTitlesByHeaderName(subItemApiName));
  };

  const handleTitleSelect = (titleName: string) => {
    setTitleName(titleName);
    setSelecetedTitle(true);
    dispatch(fetchEntriesByTitleName(titleName));
  };

  const handleCreateEntry = async () => {
    const model: EntryModel = {
      description: newEntry,
      headerId: titleListState.headerId!,
      titleName: titleName!,
      isEntry: true,
      userId: userId,
    };
    const resultAction = await dispatch(createEntry(model));
    if (createEntry.fulfilled.match(resultAction)) {
      dispatch(fetchEntriesByTitleName(titleName!));
    }
  };
  useEffect(() => {
    if (dailyEntriesState.message) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
        setNewEntry("");
        dispatch(clearMessage());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [dailyEntriesState.message, dispatch]);


  return (
    <div className="min-h-screen w-full flex justify-center items-start 
                bg-gradient-to-br from-[#e0f2fe] via-white to-[#f0f9ff] 
                font-sans pt-2 px-4">
      <div className="flex flex-col w-full max-w-6xl px-6 mt-24">
        <div className="flex w-full gap-5">
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
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => handleModeChange('daily')}
                      className={`px-4 py-2 rounded-md border font-medium text-sm ${entryMode === 'daily' && !selectedTitle
                        ? 'bg-[#0071E3] text-white'
                        : 'bg-white text-[#2B4560] border-[#2B4560]'
                        }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => handleModeChange('stream')}
                      className={`px-4 py-2 rounded-md border font-medium text-sm ${entryMode === 'stream' && !selectedTitle
                        ? 'bg-[#0071E3] text-white'
                        : 'bg-white text-[#2B4560] border-[#2B4560]'
                        }`}
                    >
                      Stream
                    </button>

                  </div>
                  {selectedTitle === true && (
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          if (isLogin) {
                            setIsModalOpen(true);
                          } else {
                            setShowLoginAlert(true);
                          }
                        }}
                        className={`px-4 py-2 rounded-md border font-medium text-sm transition-colors bg-white text-[#2B4560] border-[#2B4560] hover:bg-[#d0d7dd]`}
                      >
                        Entry Aç
                      </button>
                    </div>
                  )}
                </div>
                {loading && <p className="text-[#2B4560]">Yükleniyor...</p>}
                {error && <p className="text-red-500">Hata: {error}</p>}

                <div className="grid gap-5">


                  {showLoginAlert && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full text-center">
                        <p className="mb-4 font-semibold text-red-600">Lütfen Giriş Yapınız!</p>
                        <button
                          onClick={() => setShowLoginAlert(false)}
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                          Kapat
                        </button>
                      </div>
                    </div>
                  )}

                  {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        <h2 className="text-xl font-semibold mb-4">
                          Yeni Entry - {selectedCategory}
                        </h2>

                        {/* Başarı mesajı varsa göster */}
                        {dailyEntriesState.message && (
                          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                            {dailyEntriesState.message}
                          </div>
                        )}

                        <textarea
                          value={newEntry}
                          onChange={(e) => setNewEntry(e.target.value)}
                          placeholder="Entry'nizi buraya yazın..."
                          className="w-full h-48 border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex justify-end gap-3 mt-4">
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                          >
                            İptal
                          </button>
                          <button
                            onClick={() => {
                              handleCreateEntry();
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Kaydet
                          </button>
                        </div>
                      </div>
                    </div>
                  )}


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

                  {/* <div className="flex-1 overflow-hidden">
                    <PageButtons pages={pages} navigate={navigate} />
                  </div> */}
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
