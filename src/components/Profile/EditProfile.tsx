// src/pages/Profile/components/EditProfile.tsx
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { UserProfileModel } from '../../core/models/user/userProfileModel';
import { BaseService } from '../../core/services/baseService';
import { fetchUserProfile } from '../../store/slices/profileSlice';
import { Save } from 'lucide-react';

const EditProfile: React.FC = () => { 
  const profile = useAppSelector((s) => s.profile.data);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<Partial<UserProfileModel>>({});

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const onSubmit = async () => {
    //await new BaseService().updateUserProfile(form);
    dispatch(fetchUserProfile(profile!.id.toString()));
  };

  return (
    <div className="min-h-100px bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center border-b border-white/10 pb-4">
          ✏️ Profili Düzenle
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-gray-300 block mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              className="w-full bg-slate-700/30 text-white placeholder-gray-400 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              value={form.username || ''}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Kullanıcı adınızı girin"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Ad Soyad</label>
            <input
              type="text"
              className="w-full bg-slate-700/30 text-white placeholder-gray-400 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Adınızı ve soyadınızı girin"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1">E-posta</label>
            <input
              type="email"
              className="w-full bg-slate-700/30 text-white placeholder-gray-400 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="E-posta adresinizi girin"
            />
          </div>

          

          <div className="text-center pt-6">
            <button
              onClick={onSubmit}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-700/40"
            >
              <Save size={20} />
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
