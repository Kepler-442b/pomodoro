const withTM = require("next-transpile-modules")(["react-daisyui"])

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "drive.google.com"],
  },
})
