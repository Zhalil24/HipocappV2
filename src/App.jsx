import Routers from './Routers/Routers'
import Header from './layout/layouts/Header';
import Footer from "./layout/layouts/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2b4560]">
      <Header />

      <main className="flex-grow">
        <Routers />
      </main>

      <Footer />
    </div>
  );
}

export default App
