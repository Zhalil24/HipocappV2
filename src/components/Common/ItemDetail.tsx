import React from 'react';

interface ItemDetailProps {
  item: {
    id: number;
    imageURL: string;
    description: string;
    title: string;
    link: string;
  } | null;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item }) => {
  if (!item)
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Lütfen soldan bir öğe seçiniz.
      </div>
    );

  return (
    <div className="flex justify-center items-center h-full">
      {/* İç kutu */}
      <div className="bg-white rounded-lg shadow-md p-6 w-4/5 max-w-lg">
        <img
          src={`https://hipocapp.com/${item.imageURL}`}
          alt={item.title}
          className="w-full h-56 object-cover rounded mb-4"
        />

        <h2 className="text-xl font-bold mb-2">{item.title}</h2>
        <p className="text-gray-700 mb-4">{item.description}</p>

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ziyaret Et
          </a>
        )}
      </div>
    </div>
  );

};



export default ItemDetail;
