/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (Health & Healing)
        primary: {
          DEFAULT: '#16A34A',
          hover: '#15803D',
          active: '#166534',
          soft: '#ECFDF5',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Secondary Colors (Trust & Professionalism)
        secondary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#E0F2FE',
          50: '#E0F2FE',
          100: '#BAE6FD',
          200: '#7DD3FC',
          300: '#38BDF8',
          400: '#0EA5E9',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#1E3A8A',
        },
        // Neutral Colors (Cleanliness & Readability)
        neutral: {
          white: '#FFFFFF',
          gray: '#F9FAFB',
          border: '#E5E7EB',
          disabled: '#9CA3AF',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Accent Colors (Gentle Attention)
        accent: {
          yellow: '#FACC15',
          teal: '#14B8A6',
        },
        // Status & Feedback
        success: {
          DEFAULT: '#22C55E',
          hover: '#16A34A',
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          50: '#FEF3C7',
          100: '#FDE68A',
          500: '#F59E0B',
          600: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
        },
        info: {
          DEFAULT: '#0EA5E9',
          hover: '#0284C7',
          50: '#F0F9FF',
          100: '#E0F2FE',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        // Typography Colors
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#6B7280',
          link: '#2563EB',
        },
        // Background Colors
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB',
          'login-from': '#ECFDF5',
          'login-to': '#E0F2FE',
        },
      },
      backgroundImage: {
        'gradient-login': 'linear-gradient(135deg, #ECFDF5 0%, #E0F2FE 100%)',
        'gradient-dashboard': 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-lg': '0 10px 40px 0 rgba(31, 38, 135, 0.20)',
        teal: '0 10px 30px -10px rgba(20, 184, 166, 0.3)',
        green: '0 10px 30px -10px rgba(22, 163, 74, 0.3)',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        blob: 'blob 7s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
      transitionDuration: {
        '300': '300ms',
      },
      animationDelay: {
        '2000': '2s',
        '4000': '4s',
      },
    },
  },
  plugins: [],
}
