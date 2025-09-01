import React from "react";

interface PaginationProps {
  index: number;  
  size: number;    
  count: number;   
  pages: number;   
  onPageChange: (page: number) => void; 
}

export const Pagination: React.FC<PaginationProps> = ({ index, size, count, pages, onPageChange }) => {

  const getPageNumbers = () => {
    let start = Math.max(0, index - 2);
    let end = Math.min(pages - 1, index + 2);

    let result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(0)}
        disabled={index === 0}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
      >
        İlk
      </button>
      <button
        onClick={() => onPageChange(index - 1)}
        disabled={index === 0}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
      >
        {"<"}
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === index ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(index + 1)}
        disabled={index >= pages - 1}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
      >
        {">"}
      </button>
      <button
        onClick={() => onPageChange(pages - 1)}
        disabled={index >= pages - 1}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
      >
        Son
      </button>
    </div>
  );
};
