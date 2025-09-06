import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 z-50 w-12 h-12 flex items-center justify-center 
             rounded-md bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white 
             shadow-lg hover:brightness-110 transition-all"
      aria-label="Sayfanın üstüne çık"
    >
      ↑
    </button>

  );
};

export default ScrollToTopButton;
