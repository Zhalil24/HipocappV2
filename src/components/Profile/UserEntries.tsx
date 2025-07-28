// src/pages/Profile/components/UserEntries.tsx
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { BaseService } from '../../core/services/baseService';
import { BookText } from 'lucide-react';
import { RandomEntryModel } from '@/core/models/entries/randomEntryModel';
import EntryCard from '../EntryCard';

interface UserEntriesProps {
  entries: RandomEntryModel[];
}

const UserEntries: React.FC<UserEntriesProps> = ({ entries }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex items-center justify-center overflow-hidden">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-[90vw] max-w-2xl p-6 shadow-2xl text-white flex flex-col max-h-[90vh]">
        
        {/* Başlık sabit */}
        <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2 border-b border-white/20 pb-2">
          <BookText size={24} /> Açtığınız Entry'ler
        </h2>

        {/* Scrollable alan */}
        <div className="overflow-y-auto space-y-4 pr-2">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              createDate={entry.createDate}
              description={entry.description}
              titleName={entry.titleName}
              entryDescription={entry.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


export default UserEntries;
