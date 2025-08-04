import React, { useState } from 'react';
import ItemList from '../../components/Common/ItemList';
import ItemDetail from '../../components/Common/ItemDetail';

const adsItems = [
  {
    id: 1,
    title: 'İlan 1',
    imageUrl: 'https://via.placeholder.com/400x250?text=İlan+1',
    description: 'Bu ilanla ilgili detaylı açıklamalar burada yer alır. İlan 1 kullanıcılar için oldukça faydalı bilgiler sunar.',
  },
  {
    id: 2,
    title: 'İlan 2',
    imageUrl: 'https://via.placeholder.com/400x250?text=İlan+2',
    description: 'İlan 2 açıklaması; özellikler, detaylar ve başvuru süreci hakkında bilgiler içerir.',
  },
  {
    id: 3,
    title: 'İlan 3',
    imageUrl: 'https://via.placeholder.com/400x250?text=İlan+3',
    description: 'Bu bölümde İlan 3’ün açıklamaları, faydaları ve önemli noktaları vurgulanır.',
  },
];

const AdsPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<typeof adsItems[0] | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">Güncel İlanlar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="col-span-1 bg-white shadow-lg rounded-2xl p-6 border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Tüm İlanlar</h2>
          <div className="space-y-4">
            {adsItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`cursor-pointer p-4 rounded-xl border hover:shadow-md transition-all duration-300 ${
                  selectedItem?.id === item.id
                    ? 'bg-blue-50 border-blue-400'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <h3 className="font-medium text-gray-800">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>

        
        <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-8 border border-gray-200 min-h-[300px] flex flex-col items-center justify-center">
          {selectedItem ? (
            <div className="w-full space-y-6">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-64 object-cover rounded-xl shadow-sm"
              />
              <h2 className="text-2xl font-bold text-gray-800">{selectedItem.title}</h2>
              <p className="text-gray-600 leading-relaxed">{selectedItem.description}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-lg">Detayları görmek için bir ilan seçiniz.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdsPage;
