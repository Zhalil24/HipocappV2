import React, { useState } from 'react';
import ItemList from '../../components/Common/ItemList';
import ItemDetail from '../../components/Common/ItemDetail';

const educationItems = [
  {
    id: 1,
    title: 'Eğitim 1',
    imageUrl: 'https://via.placeholder.com/150?text=Eğitim+1',
    description: 'Eğitim 1 detayları burada.',
  },
  {
    id: 2,
    title: 'Eğitim 2',
    imageUrl: 'https://via.placeholder.com/150?text=Eğitim+2',
    description: 'Eğitim 2 hakkında bilgi.',
  },
  {
    id: 3,
    title: 'Eğitim 3',
    imageUrl: 'https://via.placeholder.com/150?text=Eğitim+3',
    description: 'Eğitim 3 detaylı açıklama.',
  },
];

const EducationPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<typeof educationItems[0] | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 mt-60 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">Eğitimler</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        <div className="md:w-1/3 bg-white rounded-lg shadow-md p-4 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Eğitim Listesi</h2>
          <div className="max-h-[60vh] overflow-y-auto">
            <ItemList
              items={educationItems}
              onSelect={setSelectedItem}
              selectedId={selectedItem?.id}
            />
          </div>
        </div>

        
        <div className="md:w-2/3 bg-white rounded-lg shadow-md p-6 border border-blue-100">
          <ItemDetail item={selectedItem} />
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
