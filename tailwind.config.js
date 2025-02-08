/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // New color palette
        primary: '#1B2141',    // Deep Navy Blue
        secondary: '#0072CE',  // Bright Blue
        accent: '#FF6B6B',     // Coral
        background: '#F9FAFB', // Very Light Gray
        surface: '#FFFFFF',    // White
        text: {
          DEFAULT: '#1B2141',  // Dark Blue
          secondary: '#4A5568' // Gray
        },
        // Keep original colors as fallback
        original: {
          primary: '#1E40AF',
          accent: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};