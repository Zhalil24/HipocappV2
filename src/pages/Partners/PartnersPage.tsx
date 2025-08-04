import React, { useState } from 'react';
import ItemList from '../../components/Common/ItemList';
import ItemDetail from '../../components/Common/ItemDetail';

const partnersItems = [
  {
    id: 1,
    title: 'Partner 1',
    imageUrl: 'https://via.placeholder.com/300x200?text=Partner+1',
    description: 'Partner 1 ile ilgili açıklama.',
  },
  {
    id: 2,
    title: 'Partner 2',
    imageUrl: 'https://via.placeholder.com/300x200?text=Partner+2',
    description: 'Partner 2 hakkında bilgiler.',
  },
  {
    id: 3,
    title: 'Partner 3',
    imageUrl: 'https://via.placeholder.com/300x200?text=Partner+3',
    description: 'Partner 3 detayları.',
  },
];

const PartnersPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<typeof partnersItems[0] | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 pt-28 px-6">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-4">Partnerlerimiz</h1>

        
        <div className="flex flex-col lg:flex-row gap-6">
          
          <div className="lg:w-1/3 w-full bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Tüm Partnerler</h2>
            <ItemList
              items={partnersItems}
              onSelect={setSelectedItem}
              selectedId={selectedItem?.id}
            />
          </div>

          {/* Detay */}
          <div className="lg:w-2/3 w-full bg-white rounded-2xl shadow p-6">
            {selectedItem ? (
              <ItemDetail item={selectedItem} />
            ) : (
              <p className="text-gray-500 text-center mt-10">Bir partner seçin...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;
