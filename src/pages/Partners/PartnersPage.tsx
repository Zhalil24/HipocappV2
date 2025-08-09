import React, { useEffect, useState } from 'react';
import ItemList from '../../components/Common/ItemList';
import ItemDetail from '../../components/Common/ItemDetail';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { ContentModel } from '@/core/models/content/contentModel';
import { fetchGetThesisConsultation } from '@/store/slices/contentSlice';
import SearchBar from '@/components/Searchbar/Searchbar';

const PartnersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const contentState = useSelector((state: RootState) => state.content.data);
  const [selectedItem, setSelectedItem] = useState<ContentModel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch((fetchGetThesisConsultation()))
  }, []);

  const filteredItems = contentState.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto mt-20 p-6">
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-xl p-6 min-h-[75vh]">
        <h1 className="text-3xl font-bold text-center text-[#2B4560] mb-8">Partnerlerimiz</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 bg-white rounded-xl border border-gray-200 shadow-md p-4 overflow-y-auto max-h-[65vh]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Partner Listesi</h2>

            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Ürün ara..."
            />

            <ItemList
              items={filteredItems}
              onSelect={setSelectedItem}
              selectedId={selectedItem?.id}
            />
          </div>

          <div className="md:w-2/3 bg-white rounded-xl border border-gray-300 shadow-md p-6">
            {selectedItem ? (
              <ItemDetail item={selectedItem} />
            ) : (
              <div className="text-gray-500 italic text-center mt-20">
                Bir partner seçin, detaylar burada görünecek.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;
