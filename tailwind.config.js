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
        primary: "#f2e78a",
        secondary: "#05334d",
        button: "#4C4F5B",
        inputBox: "#C4C4C4",
      },
      width: {
        buttonSm: "7.25rem",
        timerSmRadius: "13.25rem",
        timerMdRadius: "15.75rem",
        timerLgRadius: "18.5rem",
        reportModal: "40rem",
        reportModalMobile: "15rem",
      },
      height: {
        timerSmRadius: "13.25rem",
        timerMdRadius: "15.75rem",
        timerLgRadius: "18.5rem",
        buttonSm: "2.25rem",
        timerWrapperSm: "14.75rem",
        timerWrapperMd: "17.5rem",
        timerWrapperLg: "21rem",
        timerWrapperRingSm: "15.5rem",
        timerWrapperRingMd: "18.25rem",
        timerWrapperRingLg: "21.75rem",
        settingsModalLg: "35.25rem",
      },
      strokeWidth: {
        ring: "0.3rem",
      },
      zIndex: {
        max: 9999,
      },
    },
  },
  plugins: [],
}
