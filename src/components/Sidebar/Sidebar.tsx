// src/components/Sidebar.tsx
import React, { useState } from "react";
import { SIDEBAR_CATEGORIES } from "../../Utilities/constants";

interface SidebarProps {
  onSelect?: (value: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <aside className="fixed left-0 top-[88.5px] w-64 h-[calc(100vh-66px)] bg-[#011f26] border-r border-gray-200 overflow-y-auto p-6 font-sans z-10">
      <h2 className="text-2xl font-bold text-white mb-6">Stream</h2>
      <ul className="space-y-4">
        {SIDEBAR_CATEGORIES.map((item) => (
          <li key={item.category}>
            <button
              className="w-full text-left text-base font-semibold text-white border border-[#2B4560] rounded-lg px-4 py-2 hover:bg-[#2B4560] hover:text-white transition-all duration-200"
              onClick={() => toggleCategory(item.category)}
            >
              {item.category}
            </button>

            {openCategory === item.category && (
              <ul className="mt-2 pl-2 space-y-1">
                {item.subItems.map((subItem) => (
                  <li key={subItem.apiName}>
                    <button
                      onClick={() => onSelect?.(subItem.apiName)}
                      className="w-full text-left text-sm text-white hover:underline px-4 py-1"
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
    </aside>
  );
};

export default Sidebar;
