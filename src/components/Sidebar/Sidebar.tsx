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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleTitleClick = (titleName: string) => {
    onTitleSelect(titleName);
    dispatch(fetchEntriesByTitleName(titleName));
  };

  const subItems = selectedCategory
    ? SIDEBAR_CATEGORIES.find((c) => c.category === selectedCategory)?.subItems
    : [];

  return (
    <div
      className="sticky top-[100px] bg-white p-5 rounded-xl shadow-lg border border-gray-300 z-20 ml-3 mr-8"
      style={{
        maxWidth: '320px',
        width: '90%',
        maxHeight: 'calc(100vh - 110px)',
        overflowY: 'auto',
      }}
    >
      
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {SIDEBAR_CATEGORIES.map((item) => (
          <button
            key={item.category}
            onClick={() => handleCategoryClick(item.category)}
            className={`px-5 py-2 rounded-full font-medium text-sm transition-transform duration-200 ease-in-out
              ${
                selectedCategory === item.category
                  ? 'bg-[#2B4560] text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-[#2B4560] hover:bg-[#d0d7dd] hover:shadow-md hover:scale-105'
              }`}
          >
            {item.category}
          </button>
        ))}
      </div>

      
      {selectedCategory && subItems && (
        <div className="mb-7 bg-gray-50 p-4 rounded-lg border border-gray-300">
          <h3 className="text-[#2B4560] font-semibold text-sm mb-3">
            Alt Başlıklar
          </h3>
          <div className="flex flex-col gap-3">
            {subItems.map((subItem) => (
              <button
                key={subItem.apiName}
                onClick={() => onSelect?.(subItem.apiName)}
                className="text-left px-4 py-2 text-sm rounded-md bg-white border border-gray-200
                  hover:bg-[#e8f1ff] text-[#2B4560] transition-transform duration-200 ease-in-out
                  hover:shadow-md hover:scale-105 font-medium"
              >
                {subItem.label}
              </button>
            ))}
          </div>
        </div>
      )}

      
      <div>
        <h3 className="text-[#2B4560] font-semibold text-sm mb-3 border-b pb-1 border-gray-300">
          İlgili Konular
        </h3>

        {loadingTitles && (
          <p className="text-sm text-gray-500 italic">Yükleniyor...</p>
        )}
        {titlesError && (
          <p className="text-sm text-red-600 font-semibold">{titlesError}</p>
        )}
        {!loadingTitles && titles.length > 0 && (
          <ul className="space-y-2 mt-3 max-h-[260px] overflow-y-auto overflow-x-hidden pr-2 break-words">
            {titles.map((title) => (
              <li key={title.id}>
                <button
                  onClick={() => handleTitleClick(title.name)}
                  className="text-left text-sm text-[#2B4560] hover:underline transition-transform duration-150 ease-in-out
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
          <p className="text-sm text-gray-400 italic">
            Henüz görüntülenen başlık yok.
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
