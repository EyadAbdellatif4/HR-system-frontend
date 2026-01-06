/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary color (logo blue - bright medium blue)
        primary: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        // Background (cool gray)
        background: '#F1F5F9',
        // Card/Surface (white)
        card: '#FFFFFF',
        surface: '#FFFFFF',
        // Accent (system yellow #FAAD17)
        accent: '#FAAD17',
        // Text colors
        'text-primary': '#0F172A',
        'text-secondary': '#64748B',
        // Status colors
        success: {
          DEFAULT: '#34D399',
          50: '#D1FAE5',
          100: '#A7F3D0',
          200: '#6EE7B7',
          300: '#34D399',
          400: '#10B981',
          500: '#34D399',
        },
        error: {
          DEFAULT: '#EB1C24',
          50: '#FDE8E9',
          100: '#FBD1D3',
          200: '#F7A3A7',
          300: '#F3757B',
          400: '#EF474F',
          500: '#EB1C24',
          600: '#BC161D',
          700: '#8D1116',
          800: '#5E0B0F',
          900: '#2F0607',
        },
        warning: {
          DEFAULT: '#FAAD17',
          50: '#FEF5E6',
          100: '#FDEBCC',
          200: '#FBD799',
          300: '#F9C366',
          400: '#F7AF33',
          500: '#FAAD17',
          600: '#C88A12',
          700: '#96680E',
          800: '#644509',
          900: '#322305',
        },
        info: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        blue: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
      },
      backgroundColor: {
        'app-background': '#F1F5F9',
        'card': '#FFFFFF',
        'surface': '#FFFFFF',
      },
      textColor: {
        'primary': '#0F172A',
        'secondary': '#64748B',
      },
    },
  },
  plugins: [],
});
