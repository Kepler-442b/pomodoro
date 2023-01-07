module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        nature: "#68acd4", // light blue //"#295517", // dark green
        primary: "#f2e78a", // yellow
        secondary: "#05334d", // dark blue
        tertiary: "#5B4C7E", // indigo
        quaternary: "#E08980", // pink
        button: "#4C4F5B", // dark grey
        inputBox: "#C4C4C4", // light grey
      },
      width: {
        buttonSm: "8rem",
        timerSmRadius: "15.25rem",
        timerMdRadius: "18.25rem",
        timerLgRadius: "20.5rem",
        reportModal: "42rem",
        reportModalMobile: "15rem",
      },
      height: {
        timerSmRadius: "15.25rem",
        timerMdRadius: "18.25rem",
        timerLgRadius: "20.5rem",
        buttonSm: "2.75rem",
        timerWrapperSm: "14.75rem",
        timerWrapperMd: "17.5rem",
        timerWrapperLg: "21rem",
        timerWrapperRingSm: "18rem",
        timerWrapperRingMd: "21.5rem",
        timerWrapperRingLg: "24rem",
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
  plugins: [require("daisyui")],
}
