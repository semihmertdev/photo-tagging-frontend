// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Tailwind will scan your components
  ],
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  theme: {
    extend: {
      fontFamily: {
        robotoMono: ['"Roboto Mono"', 'monospace'], // Add the Roboto Mono font family
      },
      colors: {
        // You can add custom color schemes if needed
      },
    },
  },
  plugins: [],
};
