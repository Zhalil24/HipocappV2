import React from 'react';

interface ItemDetailProps {
  item: {
    title: string;
    description: string;
    imageUrl: string;
  } | null;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item }) => {
  if (!item) return <div className="max-w-md p-4 border rounded text-gray-500">Lütfen soldan bir öğe seçiniz.</div>;

  return (
    <div className="max-w-md p-4 border rounded shadow">
      <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded mb-4" />
      <h2 className="text-xl font-bold mb-2">{item.title}</h2>
      <p className="text-gray-700">{item.description}</p>
    </div>
  );
};

export default ItemDetail;
