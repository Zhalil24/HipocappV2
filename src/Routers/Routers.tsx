import { Routes, Route } from 'react-router-dom';

import { Home, Login, SignUp, Error, About } from '@/pages';
import Profile from '../pages/ProfilePage/';
import MarketPage from '@/pages/Market/MarketPage';
import AdsPage from '@/pages/Ads/AdsPage';
import EducationPage from '@/pages/Educations/EducationPage';
import PartnersPage from '@/pages/Partners/PartnersPage';
import ContactPage from '@/pages/Contact';
import KvkkPage from '@/pages/KVKK/KVKK';
import ChatPage from '@/pages/Chat';
import ForgotPassword from '@/pages/ForgotPassword';



const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="*" element={<Error />} />
      <Route path="/profile/:id?" element={<Profile />} />
      <Route path="/market" element={<MarketPage />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/ads" element={<AdsPage />} />
      <Route path="/educations" element={<EducationPage />} />
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="/KVKK" element={<KvkkPage />} />
      <Route path="/chat/:username?" element={<ChatPage />} />
    </Routes>
  );
};

export default Routers;
