/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        butter: {
          DEFAULT: '#F6E58D',
          light: '#FFF4B8',
          hover: '#EED977',
          dark: '#D8C252',
        },
        offwhite: '#FAF9F4',
        dark: {
          DEFAULT: '#292824',
          secondary: '#3D3B35',
        },
        muted: {
          DEFAULT: '#77736A',
          light: '#A5A196',
          dark: '#58554E',
        },
        warmborder: '#E8E4D8',
        warmsurface: '#F4F0E4',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(41, 40, 36, 0.05), 0 1px 2px -1px rgba(41, 40, 36, 0.05)',
        card: '0 2px 6px 0 rgba(41, 40, 36, 0.04), 0 1px 3px 0 rgba(41, 40, 36, 0.02)',
        'card-hover': '0 8px 20px -4px rgba(41, 40, 36, 0.08), 0 4px 6px -2px rgba(41, 40, 36, 0.03)',
      },
    },
  },
  plugins: [],
};
