import React from 'react';

interface Item {
  id: number;
  imageURL: string;
  description: string;
  title: string;
  link: string;
}

interface ItemListProps {
  items: Item[];
  onSelect: (item: Item) => void;
  selectedId?: number;
}

const ItemList: React.FC<ItemListProps> = ({ items, onSelect, selectedId }) => {
  return (
    <div className="max-w-md overflow-y-auto border rounded shadow p-2">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item)}
          className={`flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 ${selectedId === item.id ? 'bg-gray-200' : ''
            }`}
        >
          <img
            src={`https://hipocapp.com/${item.imageURL}`}
            alt={item.title}
            className="w-16 h-16 object-cover rounded"
          />

          <span className="font-semibold text-gray-800 uppercase">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
};


export default ItemList;
