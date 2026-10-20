/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 50px -28px rgba(32, 31, 54, 0.28)',
        lift: '0 22px 45px -22px color-mix(in srgb, var(--accent) 45%, transparent)'
      },
      animation: {
        'fade-up': 'fadeUp .32s cubic-bezier(.2,.8,.2,1) both',
        'scale-in': 'scaleIn .22s cubic-bezier(.2,.8,.2,1) both',
        'toast-in': 'toastIn .3s cubic-bezier(.2,.8,.2,1) both'
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(.97)' }, to: { opacity: '1', transform: 'scale(1)' } },
        toastIn: { from: { opacity: '0', transform: 'translate(-50%, 12px)' }, to: { opacity: '1', transform: 'translate(-50%, 0)' } }
      }
    }
  },
  plugins: []
}
