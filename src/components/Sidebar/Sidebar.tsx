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
  className="sticky top-[100px] p-4 rounded-xl shadow-lg z-20 
             text-white bg-gradient-to-br from-indigo-500 to-purple-600 
             dark:from-indigo-600 dark:to-purple-700"
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
        className={`px-2 py-2 rounded-md font-medium text-sm transition-colors
          ${
            selectedCategory === item.category
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white/20 text-gray-100 hover:bg-white/30'
          }`}
      >
        {item.category}
      </button>
    ))}
  </div>

  {/* Alt Başlıklar */}
  {selectedCategory && subItems && (
    <div className="mb-5 bg-white/10 p-3 rounded-lg border border-white/20">
      <div className="flex flex-col gap-2">
        {subItems.map((subItem) => (
          <button
            key={subItem.apiName}
            onClick={() => {
              setSelectedSubItem(subItem.apiName);
              onSelect?.(subItem.apiName);
            }}
            className="text-left px-3 py-1.5 text-[14px] rounded-md 
                       bg-white/20 text-gray-100 
                       hover:bg-indigo-600 hover:shadow-md 
                       transition duration-200 ease-in-out"
          >
            {subItem.label}
          </button>
        ))}
      </div>
    </div>
  )}

  {/* İlgili Konular */}
  <div>
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-gray-100 font-semibold text-[12px]">
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
          className="text-[11px] bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600"
        >
          Başlık Aç
        </button>
      )}
    </div>
    {loadingTitles && (
      <p className="text-[11px] text-gray-200 italic">Yükleniyor...</p>
    )}
    {titlesError && (
      <p className="text-[11px] text-red-300 font-semibold">{titlesError}</p>
    )}
    {!loadingTitles && titles.length > 0 && (
      <ul className="space-y-2 mt-2 max-h-[260px] overflow-y-auto pr-2">
        {titles.map((title) => (
          <li key={title.id}>
            <button
              onClick={() => handleTitleClick(title.name)}
              className="text-left text-[11px] text-gray-100 hover:text-white 
                         hover:underline transition duration-150 ease-in-out"
            >
              {title.name}
            </button>
          </li>
        ))}
      </ul>
    )}
    {!loadingTitles && !titlesError && titles.length === 0 && (
      <p className="text-[11px] text-gray-300 italic">
        Henüz görüntülenen başlık yok.
      </p>
    )}
  </div>
</div>

  );

};

export default Sidebar;
