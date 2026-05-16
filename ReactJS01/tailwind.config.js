/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 48px rgba(15, 23, 42, 0.12)",
      },
      colors: {
        sand: "#f6efe5",
        coffee: "#42210b",
        copper: "#b45309",
        pine: "#164e3b",
      },
    },
  },
  plugins: [],
};
