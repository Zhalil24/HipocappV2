import { Routes, Route } from 'react-router-dom';

import { Home, Login, SignUp, Error } from '@/pages';
import Profile from '../pages/ProfilePage/';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="*" element={<Error />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default Routers;
