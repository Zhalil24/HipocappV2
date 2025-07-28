import React from 'react';
import { UserProfileModel } from '../../core/models/user/userDataModel';
import { Mail, ShieldCheck, User } from 'lucide-react';


interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
    <div className="flex-shrink-0 h-12 w-12 bg-cyan-400/10 text-cyan-400 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-300">{label}</p>
      <p className="text-lg font-semibold text-white">
        {value || 'Belirtilmemiş'}
      </p>
    </div>
  </div>
);



interface ProfileViewProps {
    profile: UserProfileModel;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">
        Kullanıcı Detayları
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem
          icon={<User size={24} />}
          label="İSİM"
          value={profile.name}
        />
        <InfoItem
          icon={<User size={24} />}
          label="SOYİSİM"
          value={profile.surname}
        />
        <InfoItem
          icon={<Mail size={24} />}
          label="E-posta Adresi"
          value={profile.email}
        />
        <InfoItem
          icon={<ShieldCheck size={24} />}
          label="KULLANICI ADI"
          value={profile.username}
        />
        
      </div>
    </div>
  );
};

export default ProfileView;
