import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchUserProfile,
  setActiveComponent,
} from '../../store/slices/profileSlice';
import logo from './logo.png';

import ProfileView from '@/components/Profile/ProfileView';
import EditProfile from '@/components/Profile/EditProfile';
import ChangePassword from '@/components/Profile/ChangePassword';
import UserEntries from '@/components/Profile/UserEntries';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: profile,
    status,
    error,
    activeComponent,
  } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (status === 'idle') {
      const userString = localStorage.getItem('user');
      if (userString) {
        const { id: userId } = JSON.parse(userString);
        if (userId) {
          dispatch(fetchUserProfile(userId));
        }
      }
    }
  }, [status, dispatch]);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return profile ? <ProfileView profile={profile} /> : null;
      case 'edit':
        return <EditProfile />;
      case 'password':
        return <ChangePassword />;
      case 'entries':
        return <UserEntries />;
      default:
        return profile ? <ProfileView profile={profile} /> : null;
    }
  };

  const NavButton: React.FC<{
    tab: 'profile' | 'edit' | 'password' | 'entries';
    label: string;
  }> = ({ tab, label }) => (
    <button
      onClick={() => dispatch(setActiveComponent(tab))}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 focus:outline-none ${
        activeComponent === tab
          ? 'bg-cyan-600 text-white shadow-md scale-105'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
      }`}
    >
      {label}
    </button>
  );

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
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
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Oops! Bir Hata Oluştu
          </h2>
          <p className="text-gray-300">
            {error || 'Beklenmedik bir hata oluştu.'}
          </p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-950 text-white flex flex-col font-sans">
      <header className="h-16 flex items-center justify-between px-8 bg-gray-900 border-b border-gray-800 shadow-sm">
        <h1 className="text-xl font-bold tracking-wide text-cyan-400">
          Profil Sayfası
        </h1>
        <span className="text-sm text-gray-400">
          Hoş geldin, {profile.name}
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-6xl h-[60%] bg-gray-800/80 border border-cyan-500/20 rounded-3xl shadow-xl flex overflow-hidden">
          <div className="w-[280px] bg-gray-900/70 p-6 flex flex-col items-start justify-start border-r border-gray-700">
            <img
              src={
                profile.imageURL ||
                profile.photoURL ||
                `https://ui-avatars.com/api/?name=${profile.name}+${profile.surname}&background=0D8ABC&color=fff&size=128`
              }
              alt="Profil"
              className="h-28 w-28 rounded-full object-cover ring-4 ring-cyan-500 shadow-md"
            />
            <h2 className="mt-4 text-lg font-semibold">
              {profile.name} {profile.surname}
            </h2>
            <p className="text-sm text-cyan-400">@{profile.username}</p>
            <blockquote className="mt-2 text-xs italic text-gray-400">
              "Her gün yeni bir versiyonun olmalı."
            </blockquote>

            <div className="mt-6 flex flex-col gap-2 w-full">
              <NavButton tab="profile" label="Profil" />
              <NavButton tab="edit" label="Düzenle" />
              <NavButton tab="password" label="Parola" />
              <NavButton tab="entries" label="Entry'lerim" />
            </div>
          </div>

          <div className="flex-1 p-6 overflow-hidden">
            <div className="bg-gray-900/60 border border-gray-700 rounded-xl h-full p-4 overflow-y-auto">
              {renderActiveComponent()}
            </div>
          </div>
        </div>
      </main>

      <footer className="h-12 flex items-center justify-center bg-gray-900 border-t border-gray-800 text-sm text-gray-500">
        &copy; 2025 Profil Uygulaması | Geliştirici: Sen ✨
      </footer>
    </div>
  );
};

export default ProfilePage;
