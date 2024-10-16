module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gradientColorStops: theme => ({
        'blue-400': '#60A5FA',
        'blue-700': '#1D4ED8',
      }),
    },
  },
  plugins: [],
}