import React from 'react';

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition">
    <div className="text-cyan-400">{icon}</div>
    <div>
      <p className="text-sm text-gray-300">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  </div>
);

export default InfoItem;
