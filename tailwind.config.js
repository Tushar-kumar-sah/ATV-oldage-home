/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Noble Emerald & Forest Teal (Medical Safety, Tranquility & Life)
        emeraldTheme: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        // Warm Sunlit Gold & Honey Amber (Family Warmth, Compassion & Dignity)
        amberTheme: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        // Warm Cashmere & Pearl Ivory (Soft, calming, premium canvas)
        ivoryTheme: {
          50: '#FDFBF7',
          100: '#FAF7F0',
          200: '#F4EFE4',
          300: '#EAE2D2',
          400: '#DDD2BD',
          500: '#C9BBA2',
        },
        // Retain sage/cream/terracotta for backwards compatibility in admin components
        sage: {
          50: '#F2F7F4',
          100: '#E2EBE5',
          200: '#C7D9CB',
          300: '#A4C0AA',
          400: '#7E9F86',
          500: '#5F8268',
          600: '#4A6952',
          700: '#3A5240',
          800: '#2F4234',
          900: '#1E3326',
          950: '#0F1E16',
        },
        cream: {
          50: '#FDFCF9',
          100: '#FAF8F3',
          200: '#F4EFE6',
          300: '#EBE3D3',
          400: '#DFCFA8',
          500: '#CBB78C',
        },
        terracotta: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(180, 83, 9, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'warm-md': '0 8px 24px -4px rgba(180, 83, 9, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'warm-lg': '0 16px 36px -6px rgba(180, 83, 9, 0.16), 0 8px 16px -4px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
