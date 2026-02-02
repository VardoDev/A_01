/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        'electric-purple': '#8B5CF6',
        'deep-blue': '#1E3A5F',
        'glass': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
        'neon-blue': '0 0 20px rgba(30, 58, 95, 0.6)',
      },
    },
  },
  plugins: [],
}
