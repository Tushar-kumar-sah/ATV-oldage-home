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
        // OBOKASH Four-Colour Approved Brand Palette
        // 1. Espresso #352A25 (Primary dark: header/footer, headings, navigation, primary buttons)
        espresso: {
          DEFAULT: '#352A25',
          50: '#F6F4F3',
          100: '#ECE8E6',
          200: '#D9D1CE',
          300: '#BFB2AD',
          400: '#8E7C74',
          500: '#5F5049',
          600: '#473B35',
          700: '#3D312C',
          800: '#352A25', // Approved Espresso
          900: '#271E1A',
          950: '#17110E',
        },
        // 2. Ivory #F7F2EA (Main page background, large content areas, and calm reading surfaces)
        ivory: {
          DEFAULT: '#F7F2EA',
          50: '#FCFAF7',
          100: '#FAF6F0',
          200: '#F7F2EA', // Approved Ivory
          300: '#EFE7DA',
          400: '#E4D7C2',
          500: '#D2C0A3',
          600: '#B8A381',
          700: '#948060',
          800: '#6C5D44',
          900: '#473E2E',
        },
        // 3. Warm Clay #A47750 (Accent colour for highlights, small decorative elements, and selected emphasis)
        clay: {
          DEFAULT: '#A47750',
          50: '#FAF5F1',
          100: '#F4ECE4',
          200: '#E7D5C5',
          300: '#D7BAA1',
          400: '#C09877',
          500: '#A47750', // Approved Warm Clay
          600: '#8E623E',
          700: '#734E30',
          800: '#5A3D25',
          900: '#422C1A',
        },
        // 4. Sage #78836A (Supporting accent for nature, reassurance, progress, and secondary UI details)
        sage: {
          DEFAULT: '#78836A',
          50: '#F5F6F4',
          100: '#EBEEE9',
          200: '#D8DDD3',
          300: '#BEC6B6',
          400: '#9DA893',
          500: '#78836A', // Approved Sage
          600: '#626B56',
          700: '#4D5443',
          800: '#3A4032',
          900: '#2A2E24',
          950: '#1B1E17',
        },

        // Backward compatibility mappings strictly aligned to the 4 brand colors:
        cream: {
          50: '#FCFAF7',
          100: '#F7F2EA', // Approved Ivory
          200: '#EFE7DA',
          300: '#E4D7C2',
          400: '#D2C0A3',
          500: '#B8A381',
        },
        emeraldTheme: {
          50: '#F5F6F4',
          100: '#EBEEE9',
          200: '#D8DDD3',
          300: '#BEC6B6',
          400: '#9DA893',
          500: '#78836A', // Sage
          600: '#626B56',
          700: '#4D5443',
          800: '#352A25', // Espresso
          900: '#271E1A',
          950: '#17110E',
        },
        amberTheme: {
          50: '#FAF5F1',
          100: '#F4ECE4',
          200: '#E7D5C5',
          300: '#D7BAA1',
          400: '#C09877',
          500: '#A47750', // Warm Clay
          600: '#8E623E',
          700: '#734E30',
          800: '#5A3D25',
          900: '#352A25', // Espresso
          950: '#17110E',
        },
        ivoryTheme: {
          50: '#FCFAF7',
          100: '#FAF6F0',
          200: '#F7F2EA', // Ivory
          300: '#EFE7DA',
          400: '#E4D7C2',
          500: '#D2C0A3',
        },
        terracotta: {
          50: '#FAF5F1',
          100: '#F4ECE4',
          200: '#E7D5C5',
          300: '#D7BAA1',
          400: '#C09877',
          500: '#A47750', // Warm Clay
          600: '#8E623E',
          700: '#734E30',
          800: '#5A3D25',
        },
        // Harmonize generic Tailwind colors with approved palette
        emerald: {
          50: '#F5F6F4',
          100: '#EBEEE9',
          200: '#D8DDD3',
          300: '#BEC6B6',
          400: '#9DA893',
          500: '#78836A', // Sage
          600: '#626B56',
          700: '#4D5443',
          800: '#352A25', // Espresso
          900: '#271E1A',
          950: '#17110E',
        },
        amber: {
          50: '#FAF5F1',
          100: '#F4ECE4',
          200: '#E7D5C5',
          300: '#D7BAA1',
          400: '#C09877',
          500: '#A47750', // Warm Clay
          600: '#8E623E',
          700: '#734E30',
          800: '#5A3D25',
          900: '#352A25', // Espresso
          950: '#17110E',
        },
        stone: {
          50: '#FCFAF7',
          100: '#F7F2EA', // Ivory
          200: '#EFE7DA',
          300: '#D9D1CE',
          400: '#A69B94',
          500: '#7B6F67',
          600: '#534741',
          700: '#423731',
          800: '#352A25', // Espresso
          900: '#271E1A',
          950: '#17110E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(53, 42, 37, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'warm-md': '0 8px 24px -4px rgba(53, 42, 37, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'warm-lg': '0 16px 36px -6px rgba(53, 42, 37, 0.16), 0 8px 16px -4px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
