import React, { useState } from 'react';

const EntryCard = ({ titleName, entryDescription = '', userNameSurname, userName, date }) => {
  const [expanded, setExpanded] = useState(false);

  const formattedDate = date
    ? new Date(date).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : '';

  const isLong = entryDescription.length > 250;
  const displayedDescription = expanded || !isLong
    ? entryDescription
    : entryDescription.slice(0, 250) + '...';

  return (
    <div className="bg-[#FDF6EC] p-6 rounded-xl shadow-md border">
      {titleName && (
        <h3 className="text-xl font-semibold text-[#2B4560] mb-2">
          {titleName}
        </h3>
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
