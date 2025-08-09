import React, { useEffect } from 'react';

interface InfoPopupProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  onTime?: boolean;
}

const InfoPopup: React.FC<InfoPopupProps> = ({
  message,
  type = 'success',
  onClose,
  onTime = false,
}) => {

    if (!message || message.trim() === '') {
    return null; 
  }

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  useEffect(() => {
    if (onTime && onClose) {
      const timer = setTimeout(() => {
        onClose(); 
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [onTime, onClose]);

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
