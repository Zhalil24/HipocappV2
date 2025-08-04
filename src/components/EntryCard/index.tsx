import React, { useState } from 'react';

type EntryCardProps = {
  titleName?: string;
  entryDescription?: string;
  description?: string;
  userNameSurname?: string;
  userName?: string;
  createDate?: string;
  date?: string;
  showDelete?: boolean;
  onDelete?: () => void;
};
const EntryCard = ({ titleName, entryDescription = '', userNameSurname, userName, date, description, createDate, showDelete, onDelete }: EntryCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const rawDate = date || createDate;

  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : '';


  const fallbackDescription = entryDescription || description || '';
  const isLong = fallbackDescription.length > 250;

  const displayedDescription =
    expanded || !isLong
      ? fallbackDescription
      : fallbackDescription.slice(0, 250) + '...';


  return (
    <div className="bg-[#FFFDD0] p-6 rounded-xl shadow-md border">
      {titleName && (
        <h3 className="text-xl font-semibold text-[#2B4560] mb-2">
          {titleName}
        </h3>
      )}
      {showDelete && (
        <div className="flex justify-end mt-4">
          <button
            onClick={onDelete}
            className="text-sm text-red-600 font-medium hover:underline focus:outline-none"
          >
            Sil
          </button>
        </div>
      )}

      <p className="text-gray-700 text-sm whitespace-pre-line">{displayedDescription}</p>

      {isLong && (
        <div className="flex justify-center mt-4">
          <button
            className="text-sm text-[#2B4560] font-medium hover:underline focus:outline-none"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Kısalt' : 'Devamını Oku'}
          </button>
        </div>
      )}

      {(userNameSurname || userName) && (
        <p className="text-xs text-gray-500 mt-4">
          Yazar: {userNameSurname || userName}
        </p>
      )}

      {formattedDate && (
        <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
      )}


    </div>
  );
};

export default EntryCard;
