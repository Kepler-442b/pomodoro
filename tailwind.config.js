module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f2e78a", // yellow
        secondary: "#05334d", // dark blue
        tertiary: "#5B4C7E", // indigo
        quaternary: "#E08980", // pink
        button: "#4C4F5B", // dark grey
        inputBox: "#C4C4C4", // light grey
      },
      width: {
        buttonSm: "7.25rem",
        timerSmRadius: "13.25rem",
        timerMdRadius: "15.75rem",
        timerLgRadius: "18.5rem",
        reportModal: "42rem",
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
