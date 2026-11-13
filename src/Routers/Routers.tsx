import { Routes, Route } from 'react-router-dom';

import { Home, Login, SignUp, Error, About } from '@/pages';
import Profile from '../pages/UserHome/ProfilePage';
import MarketPage from '@/pages/UserHome/Market/MarketPage';
import AdsPage from '@/pages/UserHome/Ads/AdsPage';
import EducationPage from '@/pages/UserHome/Educations/EducationPage';
import PartnersPage from '@/pages/UserHome/Partners/PartnersPage';
import ContactPage from '@/pages/UserHome/Contact';
import KvkkPage from '@/pages/UserHome/KVKK&CSAE&CSAM/KVKK&CSAE&CSAM';
import ChatPage from '@/pages/UserHome/Chat';
import ForgotPassword from '@/pages/UserHome/ForgotPassword';
import ResetPassword from '@/pages/UserHome/ResetPassword';
import AdminPanel from '@/pages/AdminPanel/Panel';
import GroupList from '@/pages/UserHome/GroupList';
import PrivateRoute from './PrivateRoute';
import KVKKCSAECSAM from '@/pages/UserHome/KVKK&CSAE&CSAM/KVKK&CSAE&CSAM';

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="*" element={<Error />} />
      <Route path="/profile/:id?" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/market" element={<PrivateRoute><MarketPage /></PrivateRoute>} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/ads" element={<PrivateRoute><AdsPage /></PrivateRoute>} />
      <Route path="/educations" element={<PrivateRoute><EducationPage /></PrivateRoute>} />
      <Route path="/partners" element={<PrivateRoute><PartnersPage /></PrivateRoute>} />
      <Route path="/kvkkandcsaeandcsam" element={<KVKKCSAECSAM />} />

      <Route
        path="/chat/:username?"
        element={
          <PrivateRoute allowedRoles={["Kullanıcı", "Admin", "Super Admin"]}>
            <ChatPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["Admin", "Super Admin"]}>
            <AdminPanel />
          </PrivateRoute>
        }
      />
      <Route
        path="/groups"
        element={
          <PrivateRoute allowedRoles={["Kullanıcı", "Admin", "Super Admin"]}>
            <GroupList />
          </PrivateRoute>
        }
      />
    </Routes>

  );
};

export default Routers;
