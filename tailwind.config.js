/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes :{
        fadeIn :{
          '0%' :{opacity: '0'},
          '100%' : {opacity : '1'}
        },
        zoomIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation : {
        fadeIn : 'fadeIn 1.5s ease-in-out',
        zoomIn: 'zoomIn 1.5s ease-in-out',
      }
    },
  },
  plugins: [],
}

