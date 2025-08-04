import React, { useState } from 'react';
import ItemList from '../../components/Common/ItemList';
import ItemDetail from '../../components/Common/ItemDetail';

const marketItems = [
  {
    id: 1,
    title: 'Market Ürünü 1',
    imageUrl: 'https://via.placeholder.com/150?text=Ürün+1',
    description: 'Bu ürün 1 ile ilgili detaylı açıklama.',
  },
  {
    id: 2,
    title: 'Market Ürünü 2',
    imageUrl: 'https://via.placeholder.com/150?text=Ürün+2',
    description: 'Bu ürün 2 hakkında bilgi.',
  },
  {
    id: 3,
    title: 'Market Ürünü 3',
    imageUrl: 'https://via.placeholder.com/150?text=Ürün+3',
    description: 'Ürün 3\'ün özellikleri burada anlatılır.',
  },
];

const MarketPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<typeof marketItems[0] | null>(null);

  return (
    <div className="max-w-7xl mx-auto mt-20 p-6">
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-xl p-6 min-h-[75vh]">
        <h1 className="text-3xl font-bold text-center text-[#2B4560] mb-8">Market</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Liste */}
          <div className="md:w-1/3 bg-white rounded-xl border border-gray-200 shadow-md p-4 overflow-y-auto max-h-[65vh]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Ürün Listesi</h2>
            <ItemList
              items={marketItems}
              onSelect={setSelectedItem}
              selectedId={selectedItem?.id}
            />
          </div>

          {/* Detay */}
          <div className="md:w-2/3 bg-white rounded-xl border border-gray-300 shadow-md p-6">
            {selectedItem ? (
              <ItemDetail item={selectedItem} />
            ) : (
              <div className="text-gray-500 italic text-center mt-20">
                Bir ürün seçin, detaylar burada görünecek.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
