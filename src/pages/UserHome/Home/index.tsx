import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, createEntry, fetchLastEntries } from '../../../store/slices/entrySlice';
import { fetchRandomEntries } from '../../../store/slices/randomEntrySlice';
import {
  fetchTitlesByHeaderName,
  clearTitles,
} from '../../../store/slices/titleListSlice';
import { fetchEntriesByTitleName, fetchGetGroups, fetchGetJobAdvertisements } from '../../../store/slices/titleEntrySlice';
import EntryCard from '../../../components/EntryCard';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { AppDispatch, RootState } from '../../../store/store';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import PageButtons from '@/components/PageButtons';
import { EntryModel } from '@/core/models/entries/entryModel';
import AdRotator from '@/components/AdRotatorJobs';
import { ContentModel } from '@/core/models/content/contentModel';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import GroupListCard from '@/components/GroupList';
import { fetchGroups } from '@/store/slices/chatSlice';

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
  const [headerId, setHeaderId] = useState<number | null>(null);
  const jobs = useSelector((state: RootState) => state.titleEntry.jobs);

  const adItems: ContentModel[] = useMemo(() => {
    const list = Array.isArray(jobs) ? jobs : [];
    return list.map((j: any, idx: number): ContentModel => ({
      id: j.id ?? j.jobId ?? idx,
      imageURL: j.imageURL ?? j.imageUrl ?? j.bannerUrl ?? "/ads/placeholder.jpg",
      title: j.title ?? j.name ?? "İlan",
      description: j.description ?? j.summary ?? "",
      link: j.link ?? j.url ?? "#",
      image: j.image ?? j.image ?? "",
    }))
      .filter(it => it.link && it.link !== "#" && it.imageURL);
  }, [jobs]);

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
    dispatch(fetchGetJobAdvertisements());
    dispatch(fetchGetGroups())
  }, [])

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
      headerId: headerId !== null && headerId !== undefined
        ? headerId
        : titleListState.headerId!, titleName: titleName!,
      isEntry: true,
      userId: userId,
    };
    const resultAction = await dispatch(createEntry(model));
    if (createEntry.fulfilled.match(resultAction)) {
      dispatch(fetchEntriesByTitleName(titleName!));
    }
  };

  useEffect(() => {
    const params = queryString.parse(location.search);

    const newSearch =
      typeof params.search === "string" && params.search.trim() !== ""
        ? params.search.trim()
        : "";

    const newHeaderId =
      typeof params.headerId === "string"
        ? parseInt(params.headerId, 10)
        : null;

    if (newSearch) {
      setSearchTerm(newSearch);
      setSelecetedTitle(true);
      setTitleName(newSearch);
      if (newHeaderId) {
        setHeaderId(newHeaderId);
      }
    }
  }, [location.search]);

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


  const isActive = (p: string) =>
    location.pathname === p || location.pathname.startsWith(p + "/");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div
      className="min-h-screen w-full flex justify-center items-start 
             bg-gradient-to-br from-[#FFFFFFFF] via-white to-[#FFFFFFFF] 
             font-sans overflow-x-hidden
             pt-[30px] md:pt-2"
    >
      <div className="flex flex-col w-full max-w-[1400px] px-2 lg:px-6 mt-24">
        <div className="flex w-full gap-4 md:gap-6 flex-col md:flex-row items-stretch">
          <div className="md:hidden -mx-4 px-4">
            <div className="flex gap-2 pb-2 pt-1 items-center">
              {/* Hamburger Buton */}
              <button
                onClick={toggleSidebar}
                className="flex-shrink-0 bg-indigo-600 text-white border-2 border-[#7B3FE4] transition-all duration-300 focus:outline-none flex items-center justify-center"
                style={{ width: '32px', height: '32px' }}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex gap-2 flex-1 pl-3">
                {pages.map(({ name, path }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="px-2 py-2 rounded-md font-medium text-xs transition-colors
                 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                    style={{ height: '32px' }}
                  >
                    {name}
                  </button>
                ))}
              </div>

            </div>
          </div>

          <div
            className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-br from-indigo-500 to-purple-600
                        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        transition-transform duration-300 ease-in-out md:hidden`}
          >
            <Sidebar
              onSelect={handleSidebarSelect}
              titles={titleListState.titles}
              loadingTitles={titleListState.loading}
              titlesError={titleListState.error}
              onTitleSelect={handleTitleSelect}
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl font-bold"
              onClick={toggleSidebar}
            >
              ×
            </button>
          </div>

          {/* Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={toggleSidebar}
            ></div>
          )}

          {/* Sidebar */}
          <div className="hidden md:block w-full md:w-64 md:shrink-0">
            <Sidebar
              onSelect={handleSidebarSelect}
              titles={titleListState.titles}
              loadingTitles={titleListState.loading}
              titlesError={titleListState.error}
              onTitleSelect={handleTitleSelect}
            />
          </div>


          {/* Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 w-full pb-12 overflow-y-auto">
              <div className="px-1 sm:px-2 lg:px-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 w-full gap-3 sm:gap-4">
                  <div className="flex space-x-3 mt-2 sm:mt-4">
                    <button
                      onClick={() => handleModeChange('daily')}
                      className={`px-4 py-2 rounded-md font-medium text-sm transition-colors
      ${entryMode === 'daily' && !selectedTitle
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                          : 'bg-white text-[#2B4560] border border-[#2B4560] hover:bg-white/80'
                        }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => handleModeChange('stream')}
                      className={`px-4 py-2 rounded-md font-medium text-sm transition-colors
      ${entryMode === 'stream' && !selectedTitle
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                          : 'bg-white text-[#2B4560] border border-[#2B4560] hover:bg-white/80'
                        }`}
                    >
                      Stream
                    </button>
                  </div>

                  {selectedTitle && (
                    <div className="mt-1 sm:mt-3">
                      <button
                        onClick={() => {
                          if (isLogin) setIsModalOpen(true);
                          else setShowLoginAlert(true);
                        }}
                        className="px-4 py-2 rounded-md border font-medium text-sm transition-colors bg-white text-[#2B4560] border-[#2B4560] hover:bg-[#d0d7dd]"
                      >
                        Entry Aç
                      </button>
                    </div>
                  )}
                </div>

                {loading && <p className="text-[#2B4560]">Yükleniyor...</p>}
                {error && <p className="text-red-500">Hata: {error}</p>}

                {showLoginAlert && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                      <h2 className="text-xl font-semibold mb-4">
                        Yeni Entry
                      </h2>
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
                          onClick={() => handleCreateEntry()}
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

                <div className="space-y-5 break-words">
                  {currentEntries?.map((entry) => (
                    <EntryCard
                      key={entry.id}
                      titleName={entry.titleName}
                      isLogin={isLogin}
                      entryDescription={
                        entry.entryDescription ||
                        entry.description ||
                        'Açıklama bulunamadı.'
                      }
                      userNameSurname={entry.userNameSurname}
                      userName={entry.userName}
                      date={entry.date}
                      userId={entry.userId}
                    />
                  ))}
                </div>
              </div>
            </main>
          </div>

          {/* Reklam sütunu */}
          <div className="w-full md:w-64 md:shrink-0">
            <AdRotator items={adItems} />
            {isLogin && (
              <GroupListCard groups={titleEntryState.groups} />
            )}

          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );

};

export default HomePage;
