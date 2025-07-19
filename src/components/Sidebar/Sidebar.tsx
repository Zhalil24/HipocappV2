import React, { useState } from 'react';
import { SIDEBAR_CATEGORIES } from '../../Utilities/constants';
import { useDispatch } from 'react-redux';
import { fetchEntriesByTitleName } from '../../store/slices/titleEntrySlice';
import { AppDispatch } from '../../store/store';

interface Title {
  id: number;
  name: string;
}

interface SidebarProps {
  isOpen: boolean;
  onSelect?: (value: string) => void;
  titles: Title[];
  loadingTitles: boolean;
  titlesError: string | null;
  onTitleSelect: (titleName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onSelect,
  titles,
  loadingTitles,
  titlesError,
  onTitleSelect,
}) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleTitleClick = (titleName: string) => {
    onTitleSelect(titleName);
    dispatch(fetchEntriesByTitleName(titleName));
  };

  return (
    <aside
      className={`fixed left-0 top-[88.55px] w-70 h-[calc(100vh-88.55px)] bg-[#011f26] border-r border-gray-200 p-6 font-sans z-20 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col flex-grow overflow-y-auto pr-4 custom-scrollbar">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 mt-6 border-b border-[#2B4560] pb-3">
            Stream
          </h2>
          <ul className="space-y-4 pt-4">
            {SIDEBAR_CATEGORIES.map((item) => (
              <li key={item.category}>
                <button
                  className="w-full text-left text-base font-semibold text-white border border-[#2B4560] rounded-lg px-4 py-3 hover:bg-[#2B4560] hover:text-white transition-all duration-200 flex items-center justify-between"
                  onClick={() => toggleCategory(item.category)}
                >
                  {item.category}
                  <span className="text-gray-400 text-sm">
                    {openCategory === item.category ? '▲' : '▼'}
                  </span>
                </button>

                {openCategory === item.category && (
                  <ul className="mt-2 pl-4 space-y-1 bg-[#022c36] rounded-md py-2">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.apiName}>
                        <button
                          onClick={() => onSelect?.(subItem.apiName)}
                          className="w-full text-left text-sm text-gray-300 hover:text-white hover:bg-[#1A3A4A] px-4 py-1.5 rounded-sm transition-all duration-150"
                        >
                          {subItem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#2B4560] pb-2">
            İlgili Konular
          </h3>
          {loadingTitles && (
            <p className="text-white text-sm">Başlıklar Yükleniyor...</p>
          )}
          {titlesError && <p className="text-red-400 text-sm">{titlesError}</p>}
          {!loadingTitles && titles.length > 0 && (
            <ul className="space-y-2">
              {titles.map((title) => (
                <li key={title.id}>
                  <button
                    onClick={() => handleTitleClick(title.name)}
                    className="block w-full text-left text-sm text-gray-300 hover:text-white hover:underline transition-colors duration-150"
                  >
                    {title.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!loadingTitles && !titlesError && titles.length === 0 && (
            <p className="text-gray-400 text-sm italic">
              Henüz görüntülenen başlık bulunmuyor.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
