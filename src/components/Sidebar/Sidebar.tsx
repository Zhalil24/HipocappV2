import React, { useEffect, useState } from 'react';
import { SIDEBAR_CATEGORIES } from '../../Utilities/constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntriesByTitleName } from '../../store/slices/titleEntrySlice';
import { AppDispatch, RootState } from '../../store/store';
import { createEntry, fetchLastEntries } from '@/store/slices/entrySlice';
import { EntryModel } from '@/core/models/entries/entryModel';

interface Title {
  id: number;
  name: string;
}

interface SidebarProps {
  onSelect?: (value: string) => void;
  titles: Title[];
  loadingTitles: boolean;
  titlesError: string | null;
  onTitleSelect: (titleName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelect,
  titles,
  loadingTitles,
  titlesError,
  onTitleSelect,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const titleListState = useSelector((state: RootState) => state.titleList);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Tıp");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEntry, setNewEntry] = useState('');
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleTitleClick = (titleName: string) => {
    onTitleSelect(titleName);
    dispatch(fetchEntriesByTitleName(titleName));
  };
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
  const handleCreateTitle = () => {
    const model: EntryModel = {
      description: newEntry,
      headerId: titleListState.headerId!,
      titleName: newTitle!,
      isEntry: false,
      userId: userId,
    };
    dispatch(createEntry(model))
  }

  const subItems = selectedCategory
    ? SIDEBAR_CATEGORIES.find((c) => c.category === selectedCategory)?.subItems
    : [];

  return (
    <div
      className="sticky top-[100px] bg-white p-4 rounded-xl shadow-lg border border-gray-300 z-20"
      style={{
        maxWidth: '320px',
        width: '100%',
        maxHeight: 'calc(100vh - 110px)',
        overflowY: 'auto',
      }}
    >

      {/* Kategoriler */}
      <div className="flex flex-wrap gap-1 mb-5 justify-center">
        {SIDEBAR_CATEGORIES.map((item) => (
          <button
            key={item.category}
            onClick={() => handleCategoryClick(item.category)}
            className={`px-2 py-2 rounded-md border font-medium text-sm transition-colors
        ${selectedCategory === item.category
                ? 'bg-[#0071E3] text-white border-[#0071E3]'
                : 'bg-white text-[#2B4560] border-[#2B4560] hover:bg-[#d0d7dd] hover:shadow-md'
              }`}
          >
            {item.category}
          </button>
        ))}
      </div>


      {/* Alt Başlıklar */}
      {selectedCategory && subItems && (
        <>
          <div className="mb-5 bg-gray-50 p-3 rounded-lg border border-gray-300">
            <div className="flex flex-col gap-2">
              {subItems.map((subItem) => (
                <button
                  key={subItem.apiName}
                  onClick={() => {
                    setSelectedSubItem(subItem.apiName);
                    onSelect?.(subItem.apiName);
                  }}
                  className="text-left px-3 py-1.5 text-[11px] rounded-md bg-white border border-gray-200
                hover:bg-[#e8f1ff] text-[#2B4560] transition-transform duration-200 ease-in-out
                hover:shadow-md hover:scale-105 font-medium"
                >
                  {subItem.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}


      {isOpenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
            <h2 className="text-lg font-semibold mb-4">Yeni Başlık ve Entry Aç</h2>

            <input
              type="text"
              placeholder="Yeni başlık adı"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mb-3 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Entry açıklaması"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              className="mb-3 w-full border border-gray-300 rounded p-2 h-48 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />


            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpenModal(false)}
                className="px-4 py-2 bg-gray-400 rounded text-white hover:bg-gray-500"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  handleCreateTitle();
                  setIsOpenModal(false);
                  setNewTitle('');
                  setNewEntry('');
                }}
                className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}


      {/* İlgili Konular */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[#2B4560] font-semibold text-[11px]">
            Alt Başlıklar
          </h3>
          {selectedSubItem && (
            <button
              onClick={() => {
                if (isLogin) {
                  setIsOpenModal(true);
                } else {
                  setShowLoginAlert(true);
                }
              }}
              className="text-[11px] bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            >
              Başlık Aç
            </button>
          )}

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
        </div>
        {loadingTitles && (
          <p className="text-[11px] text-gray-500 italic">Yükleniyor...</p>
        )}
        {titlesError && (
          <p className="text-[11px] text-red-600 font-semibold">{titlesError}</p>
        )}
        {!loadingTitles && titles.length > 0 && (
          <ul className="space-y-2 mt-2 max-h-[260px] overflow-y-auto overflow-x-hidden pr-2 break-words">
            {titles.map((title) => (
              <li key={title.id}>
                <button
                  onClick={() => handleTitleClick(title.name)}
                  className="text-left text-[11px] text-[#2B4560] hover:underline transition-transform duration-150 ease-in-out
                  hover:scale-105 font-medium inline-block pl-1"
                  style={{ transformOrigin: 'left' }}
                >
                  {title.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {!loadingTitles && !titlesError && titles.length === 0 && (
          <p className="text-[11px] text-gray-400 italic">
            Henüz görüntülenen başlık yok.
          </p>
        )}
      </div>
    </div>
  );

};

export default Sidebar;
