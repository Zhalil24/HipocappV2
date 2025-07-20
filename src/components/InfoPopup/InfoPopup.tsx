import React from 'react';

interface InfoPopupProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const InfoPopup: React.FC<InfoPopupProps> = ({
  message,
  type = 'success',
  onClose,
}) => {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`text-white ${bgColor} px-6 py-3 rounded shadow-lg animate-fadeIn flex items-center gap-4`}
      >
        <span>{message}</span>
      </div>
    </div>
  );
};

export default InfoPopup;
