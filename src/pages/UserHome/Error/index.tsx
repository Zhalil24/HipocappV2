
const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Üzgünüz, böyle bir sayfa bulunamadı!</p>
      <a
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Ana Sayfaya Dön
      </a>
    </div>
  );
};

export default Error;
