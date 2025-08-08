import React, { useState, useEffect } from 'react';

interface EditProfileProps {
  userData: {
    id: number;
    name: string;
    surname: string;
    email: string;
    username: string;
    photo: string | null;
  };
  onSubmit: (updatedData: {
    id: number;
    name: string;
    surname: string;
    username: string;
    email: string;
    photo?: File | null;
    password: 'a';
    passwordRe: 'a';
  }) => void;

}

const EditProfile: React.FC<EditProfileProps> = ({ userData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    surname: userData?.surname || '',
    email: userData?.email || '',
    username: userData?.username || '',
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        username: userData.username,
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: userData.id,
      ...formData,
      photo: photoFile,
      password: 'a',
      passwordRe: 'a'
    });
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-900 p-8 rounded-xl shadow-lg flex flex-col gap-6"
    >
      <input
        type="text"
        name="name"
        placeholder="Adınız"
        value={formData.name}
        onChange={handleChange}
        className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
      />
      <input
        type="text"
        name="surname"
        placeholder="Soyadınız"
        value={formData.surname}
        onChange={handleChange}
        className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
      />
      <input
        type="text"
        name="username"
        placeholder="Kullanıcı adınız"
        value={formData.username}
        onChange={handleChange}
        className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
      />
      <input
        type="email"
        name="email"
        placeholder="E-posta"
        value={formData.email}
        onChange={handleChange}
        className="p-3 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-gray-300"
      />
      <button
        type="submit"
        className="bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 transition text-white py-3 rounded-md font-semibold shadow-md"
      >
        Kaydet
      </button>
    </form>
  );
};

export default EditProfile;
