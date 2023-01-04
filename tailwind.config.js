/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        header: "80px",
      },
      screens: {
        md: "620px",
        lg: "920px",
      },
      zIndex: {
        2: "2",
      },
      borderColor: {
        gray: "gray",
      },
      textColor: {
        gray: "gray",
      },
      backgroundColor: {
        modal: "rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
