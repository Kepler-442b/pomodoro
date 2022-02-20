module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "space-theme-1": "url('/images/hubble_cha1_mosiac.jpg')",
      },
      colors: {
        primary: "#FFF171",
        secondary: "#0D354B",
        button: "#4C4F5B",
        inputBox: "#C4C4C4",
      },
      width: {
        buttonSmWidth: "7.25rem",
        timerSmRadius: "12.25rem",
        timerLgRadius: "18.5rem",
      },
      height: {
        timerSmRadius: "12.25rem",
        timerLgRadius: "18.5rem",
        buttonSmHeight: "2.25rem",
        timerWrapperSmHeight: "14.75rem",
        timerWrapperMdHeight: "17.5rem",
        timerWrapperLgHeight: "21rem",
        settingsModalLgHeight: "28rem",
      },
    },
  },
  plugins: [],
}
