/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      }
    }
  },
  daisyui: {
    themes: [
      "light",      // Clean, professional light theme
      "dark",       // Modern dark theme
      "night",      // Deep, comfortable night theme
      "forest",     // Natural, earthy green theme
      "dracula",    // Popular developer theme
      "synthwave",  // Retro cyberpunk theme
    ],
  },
};
