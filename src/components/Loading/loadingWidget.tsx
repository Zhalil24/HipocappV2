import React from 'react';
import logo from '../../layout/layouts/UserHome/Header/logo.png'     

interface LoadingWidgetProps {
  isLight?: boolean; 
}

const LoadingWidget: React.FC<LoadingWidgetProps> = ({ isLight = false }) => {
  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        isLight ? "bg-white" : "bg-gray-900"
      }`}
    >
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-cyan-500"></div>
        <img
          src={logo}
          alt="Yükleniyor..."
          className="rounded-full h-28 w-28"
        />
      </div>
    </div>
  );
};

export default LoadingWidget;