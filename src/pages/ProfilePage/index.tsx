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
import { fileToBase64 } from '@/Utilities/helpers/fileToBase64Helper';
import { useParams } from 'react-router';



const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const targetId = id ? Number(id) : null;
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
  const decodedId = id ? Number(atob(id)) : userId;
  if (decodedId && decodedId !== 0) {
    dispatch(fetchUserProfile(decodedId.toString()));
  }
}, [id, userId, dispatch]);


  const isFromLocalStorage = !id;

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
            canDelete={isFromLocalStorage}
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
  <div className="w-full min-h-screen overflow-x-hidden bg-gray-950 text-white flex flex-col font-sans">
    {/* Üst bar */}
    <header className="h-14 md:h-16 flex items-center justify-between px-4 sm:px-8 bg-gray-900 border-b border-gray-800 shadow-sm">
      <h1 className="text-lg md:text-xl font-bold tracking-wide text-cyan-400">Profil Sayfası</h1>
      <span className="text-xs md:text-sm text-gray-400">Hoş geldin, {profile.name}</span>
    </header>

    {/* İçerik */}
    <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6 flex items-stretch justify-center">
      <div
        className="
          w-full max-w-6xl mx-auto
          bg-gray-800/80 border border-cyan-500/20 rounded-3xl shadow-xl
          flex flex-col md:flex-row overflow-hidden
        "
      >
        {/* Sol panel */}
        <aside
          className="
            w-full md:w-[280px]
            bg-gray-900/70 p-5 sm:p-6
            border-b md:border-b-0 md:border-r border-gray-700
          "
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src={
                profile.photoURL
                  ? `https://hipocapp.com/${profile.photoURL}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      `${profile.name} ${profile.surname}`
                    )}&background=0D8ABC&color=fff&size=128`
              }
              alt={`${profile.name} ${profile.surname}`}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-cyan-500 shadow-md"
            />

            <h2 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">
              {profile.name} {profile.surname}
            </h2>
            <p className="text-sm text-cyan-400">@{profile.username}</p>

            {/* Navigasyon butonları */}
            <div className="mt-5 sm:mt-6 grid grid-cols-2 md:grid-cols-1 gap-2 w-full">
              <NavButton tab="profile" label="Profil" />
              {id == null && (
                <>
                  <NavButton tab="edit" label="Düzenle" />
                  <NavButton tab="password" label="Parola" />
                </>
              )}
              <NavButton tab="entries" label="Entrys" />
            </div>
          </div>
        </aside>

        {/* Sağ içerik */}
        {showPopup && (
          <InfoPopup
            message={serviceMessage.message!}
            type="info"
            onClose={() => setShowPopup(false)}
            onTime={true}
          />
        )}

        <section className="flex-1 p-4 sm:p-6 overflow-visible md:overflow-hidden">
          <div className="bg-gray-900/60 border border-gray-700 rounded-xl h-full p-4 sm:p-5 md:overflow-y-auto">
            {renderActiveComponent()}
          </div>
        </section>
      </div>
    </main>
  </div>
);

};

export default ProfilePage;
