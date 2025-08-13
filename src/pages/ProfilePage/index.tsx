import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  changePassword,
  clearServiceMessage,
  deleteEntry,
  fetchUserProfile,
  setActiveComponent,
  updateProfile,
} from '../../store/slices/profileSlice';

import ProfileView from '@/components/Profile/ProfileView';
import EditProfile from '@/components/Profile/EditProfile';
import ChangePassword from '@/components/Profile/ChangePassword';
import UserEntries from '@/components/Profile/UserEntries';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import InfoPopup from '@/components/InfoPopup/InfoPopup';
import LoadingWidget from '@/components/Loading/loadingWidget';
import { UserProfileModel } from '@/core/models/user/userProfileModel';
import { fileToBase64 } from '@/Utilities/fileToBase64Helper';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState<number>(0);
  const { data: profile, status, error, activeComponent } = useAppSelector((state) => state.profile);
  const serviceMessage = useSelector((state: RootState) => state.profile);
  const [showPopup, setShowPopup] = useState(false);
  const [prevMessage, setPrevMessage] = useState<string | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const { id } = JSON.parse(userString);
      if (id) {
        setUserId(id);
      }
    }
  }, []);

  useEffect(() => {
    if (serviceMessage) {
      setShowPopup(true);
    }
  }, [serviceMessage]);

  const handlePasswordChange = async (payload: PasswordChangeDto): Promise<void> => {
    try {
      await dispatch(changePassword(payload)).unwrap();
    } catch (err: any) {
      throw new Error(err);
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteEntry(id));
  };

  useEffect(() => {
    dispatch(clearServiceMessage());
  }, [activeComponent, dispatch]);

  const handleProfileUpdate = (updated: {
    id: number;
    name: string;
    surname: string;
    email: string;
    username: string;
    photo?: File | null;
    password: 'a';
    passwordRe: 'a';
  }) => {
    const formData = new FormData();
    formData.append('Id', updated.id.toString());
    formData.append('Name', updated.name);
    formData.append('Surname', updated.surname);
    formData.append('Email', updated.email);
    formData.append('Username', updated.username);
    formData.append('Password', 'a');
    formData.append('PasswordRe', 'a');

    if (updated.photo) {
      formData.append('Photo', updated.photo);
    }

    dispatch(updateProfile(formData));
  };


  useEffect(() => {
    if (userId !== 0 && status === 'idle') {
      dispatch(fetchUserProfile(userId.toString()));
    }
  }, [userId, status, dispatch]);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return profile ? <ProfileView profile={profile} /> : null;
      case 'edit':
        return profile ? (
          <EditProfile userData={profile} onSubmit={handleProfileUpdate} />
        ) : null;
      case 'password':
        return (
          <ChangePassword
            userId={userId}
            onChange={handlePasswordChange}
          />
        );
      case 'entries':
        return (
          <UserEntries
            entries={profile?.entries || []}
            onDelete={handleDelete}
          />
        );
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
      className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 focus:outline-none ${activeComponent === tab
        ? 'bg-cyan-600 text-white shadow-md scale-105'
        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
        }`}
    >
      {label}
    </button>
  );

  if (status === 'loading') {
    return <LoadingWidget />;
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
                `https://hipocapp.com/${profile.photoURL}`||                
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

          {showPopup && (
            <InfoPopup
              message={serviceMessage.message!}
              type="info"
              onClose={() => setShowPopup(false)}
              onTime={true}
            />
          )}

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
