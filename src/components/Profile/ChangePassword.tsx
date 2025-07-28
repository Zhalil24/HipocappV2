// src/pages/Profile/components/ChangePassword.tsx
import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { BaseService } from '../../core/services/baseService';
import { LockKeyhole } from 'lucide-react';

const ChangePassword: React.FC = () => {
  const user = useAppSelector((s) => s.profile.data)!;
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = async () => {
    setLoading(true);
    try {
      await new BaseService().changePassword({
        userId: user.id,
        oldPassword: oldPass,
        newPassword: newPass,
      });
      alert('✅ Parola başarıyla değiştirildi!');
      setOldPass('');
      setNewPass('');
    } catch (error) {
      alert('❌ Parola değiştirilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[530px] w-100px bg-gradient-to-br from-zinc-900 to-slate-800 flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-[90vw] max-w-md p-6 shadow-2xl text-white">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 border-b border-white/20 pb-2">
          <LockKeyhole size={22} /> Parola Değiştir
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Eski Parola</label>
            <input
              type="password"
              placeholder="Mevcut parolanız"
              className="w-full bg-slate-700/40 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Yeni Parola</label>
            <input
              type="password"
              placeholder="Yeni parolanız"
              className="w-full bg-slate-700/40 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={onChange}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Parolayı Güncelle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
