import { ContentModel } from '@/core/models/content/contentModel';
import React, { useState } from 'react';
import { mediaUrl } from "@/core/services/apiConfig";

interface ContentListProps {
  data: ContentModel[];
  onEdit?: (item: ContentModel) => void;
  onDelete?: (item: ContentModel) => void;
  onAddModalChange?: (isOpen: boolean) => void;
}

export const ContentList: React.FC<ContentListProps> = ({ data, onEdit, onDelete, onAddModalChange }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentModel | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);


  const handleDeleteClick = (item: ContentModel) => {
    setSelectedItem(item);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      onDelete?.(selectedItem);
    }
    setShowConfirm(false);
    setSelectedItem(null);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
    onAddModalChange?.(true);
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          onClick={handleAddClick}
        >
          ➕ Ekle
        </button>
      </div>

      {/* Liste */}
      {data.length > 0 ? (
        data.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-neutral-900"
          >
            <div className="flex items-center space-x-4">
              {item.imageURL && (
                <img
                  src={mediaUrl(item.imageURL)}
                  alt={item.title}
                  className="h-16 w-16 rounded-md object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline dark:text-blue-400"
                >
                  Daha fazlası
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-500 dark:hover:bg-neutral-800"
                onClick={() => onEdit?.(item)}
              >
                ✏️
              </button>
              <button
                className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500 dark:hover:bg-neutral-800"
                onClick={() => handleDeleteClick(item)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Gösterilecek içerik bulunamadı.
        </p>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-80 rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Silme Onayı</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Bu içeriği silmek istediğinizden emin misiniz?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="rounded-md bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                onClick={() => setShowConfirm(false)}
              >
                Vazgeç
              </button>
              <button
                className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                onClick={confirmDelete}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}