import React from 'react';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

interface AuthInputProps {
  type?: string;
  placeholder?: string;
  icon?: 'email' | 'lock' | 'user';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

const iconMap = {
  email: <FaEnvelope className="text-[#2B4560] mr-3" />,
  lock: <FaLock className="text-[#2B4560] mr-3" />,
  user: <FaUser className="text-[#2B4560] mr-3" />,
};

const AuthInput: React.FC<AuthInputProps> = ({
  type = 'text',
  placeholder = '',
  icon = 'email',
  value,
  onChange,
  name,
}) => {
  return (
    <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#FFB700] transition">
      {iconMap[icon]}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full outline-none bg-transparent text-[#2B4560] placeholder-gray-400"
      />
    </div>
  );
};

export default AuthInput;
