/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // Kartın kenarındaki parıldama efekti için
        "border-spin": {
          "100%": {
            transform: "rotate(-360deg)",
          },
        },
        // Aurora arka plan animasyonu
        "aurora": {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        // Kademeli giriş animasyonu
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "border-spin": "border-spin 7s linear infinite",
        "aurora": "aurora 60s linear infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
}