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
  isLogin?: boolean;
};
const EntryCard = ({ titleName, entryDescription = '', userId, isLogin, userName, date, description, createDate, showDelete, onDelete }: EntryCardProps) => {
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
    <div className="bg-white p-5 rounded-none border-t-2 border-b-2 border-gray-500">
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
        className="text-gray-700 text-[14px] whitespace-pre-line"
        style={{ wordBreak: 'break-word' }}
      >
        {displayedDescription}
      </p>

      {isLong && (
        <div className="flex justify-center mt-3">
          <button
            className="text-[11px] font-medium text-indigo-500 hover:text-purple-600 hover:underline focus:outline-none transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Kısalt' : 'Devamını Oku'}
          </button>
        </div>
      )}

      {userName && (
        <div className="mt-4 text-[10px] text-gray-500 flex flex-col gap-1">
          <p className="flex items-center gap-1">
            <span className="text-black font-medium">Yazar:</span>{" "}
            <span
              onClick={() => goToProfile(userId)}
              className="cursor-pointer text-indigo-500 hover:text-purple-600 hover:underline transition-colors duration-200 flex items-center gap-1"
            >
              {userName}
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

          {isLogin &&
            <button
              onClick={goToChat}
              className="self-start text-[11px] px-2 py-1 rounded-md 
           bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
           hover:from-indigo-600 hover:to-purple-700 
           transition shadow-md"
            >
              Mesaj Gönder
            </button>}

        </div>
      )}

      {formattedDate && (
        <p className="text-[10px] text-black mt-1">{formattedDate}</p>
      )}
    </div>

  );


};

export default EntryCard;
