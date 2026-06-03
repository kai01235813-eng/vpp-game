/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        round: ['"Fredoka"', '"Baloo 2"', '"Jua"', 'sans-serif'],
        kr: ['"Noto Sans KR"', 'sans-serif']
      },
      colors: {
        sky2: '#38bdf8', skydeep: '#0ea5e9',
        rose2: '#fb7185', emerald2: '#34d399', amber2: '#fbbf24',
        violet2: '#a78bfa', orange2: '#fb923c',
        ink: '#475569', inksoft: '#94a3b8'
      },
      boxShadow: {
        soft: '0 12px 30px rgba(120,150,190,0.18)',
        glow: '0 8px 20px rgba(56,189,248,0.18)'
      }
    }
  },
  plugins: []
};
