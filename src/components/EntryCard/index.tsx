import React, { useState } from 'react';
import { useNavigate } from 'react-router';

type EntryCardProps = {
  titleName?: string;
  entryDescription?: string;
  description?: string;
  userNameSurname?: string;
  userName?: string;
  createDate?: string;
  date?: string;
  showDelete?: boolean;
  userId?: number;
  onDelete?: () => void;
};
const EntryCard = ({ titleName, entryDescription = '', userId, userNameSurname, userName, date, description, createDate, showDelete, onDelete }: EntryCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
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

  const goToProfile = (uid?: number | null) => {
    if (!uid) return;
    const encodedId = btoa(uid.toString());
    navigate(`/profile/${encodedId}`);
  };

  const goToChat = () => {
    if (userName) {
      navigate(`/chat/${userName}`);
    }
  };

  const fallbackDescription = entryDescription || description || '';
  const isLong = fallbackDescription.length > 250;

  const displayedDescription =
    expanded || !isLong
      ? fallbackDescription
      : fallbackDescription.slice(0, 250) + '...';

  return (
    <div className="bg-[#FFFDD0] p-5 rounded-xl shadow-md border">
      {titleName && (
        <h3 className="text-[15px] font-semibold text-[#2B4560] mb-2">
          {titleName}
        </h3>
      )}

      {showDelete && (
        <div className="flex justify-end mt-3">
          <button
            onClick={onDelete}
            className="text-[11px] text-red-600 font-medium hover:underline focus:outline-none"
          >
            Sil
          </button>
        </div>
      )}

      <p
        className="text-gray-700 text-[11px] whitespace-pre-line"
        style={{ wordBreak: 'break-word' }}
      >
        {displayedDescription}
      </p>


      {isLong && (
        <div className="flex justify-center mt-3">
          <button
            className="text-[11px] text-[#2B4560] font-medium hover:underline focus:outline-none"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Kısalt' : 'Devamını Oku'}
          </button>
        </div>
      )}

      {(userNameSurname || userName) && (
        <div className="mt-4 text-[10px] text-gray-500 flex flex-col gap-1">
          <p className="flex items-center gap-1">
            Yazar:{" "}
            <span
              onClick={() => goToProfile(userId)}
              className="cursor-pointer text-cyan-500 hover:underline hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1"
            >
              {userNameSurname || userName}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </p>

          {/* Mesaj Gönder butonu */}
          {userName && (
            <button
              onClick={goToChat}
              className="self-start text-[11px] px-2 py-1 rounded-md bg-cyan-500 text-white hover:bg-cyan-600 transition"
            >
              Mesaj Gönder
            </button>
          )}
        </div>
      )}

      {formattedDate && (
        <p className="text-[10px] text-gray-400 mt-1">{formattedDate}</p>
      )}


    </div>
  );

};

export default EntryCard;
