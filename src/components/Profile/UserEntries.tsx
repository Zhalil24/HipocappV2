// src/pages/Profile/components/UserEntries.tsx
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { BaseService } from '../../core/services/baseService';
import { BookText } from 'lucide-react';

const UserEntries: React.FC = () => {
  const user = useAppSelector((s) => s.profile.data)!;
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const data = await new BaseService().getUserEntries(user.id);
      setEntries(data);
    })();
  }, [user]);

  return (
    <div className="h-[530px] w-100px bg-gradient-to-br from-slate-900 to-gray-800 flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-[90vw] max-w-2xl p-6 shadow-2xl text-white overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 border-b border-white/20 pb-2">
          <BookText size={24} /> Açtığınız Entry'ler
        </h2>

        {entries.length === 0 ? (
          <p className="text-gray-400 text-center italic">Henüz bir entry açmadınız.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-slate-700/40 border border-white/10 rounded-xl p-4 hover:bg-slate-600 transition-all duration-200 shadow-md"
              >
                <h3 className="text-lg font-semibold text-rose-400">{entry.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEntries;
