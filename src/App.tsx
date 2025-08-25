import Routers from './Routers/Routers'
import Header from './layout/layouts/Header';
import Footer from "./layout/layouts/Footer";
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const hideLayoutPaths = ['/login', '/sign-up', '/forgotpassword'];
  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2b4560]">
      {!shouldHideLayout && <Header />}

      <main className="flex-grow">
        <Routers />
      </main>

      {!shouldHideLayout && <Footer />}
    </div>
  );
}

export default App
