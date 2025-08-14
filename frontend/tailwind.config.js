/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Scale AI Design System Colors
      colors: {
        // Background Colors (Scale AI exact)
        'bg-primary': '#000000',           // Pure black background
        'bg-secondary': '#0a0a0a',         // Slightly lighter black
        'bg-card': '#1a1a1a',             // Card backgrounds
        
        // Text Colors
        'text-primary': '#ffffff',         // Pure white
        'text-secondary': '#a1a1aa',       // Gray text
        'text-muted': '#71717a',           // Muted gray
        
        // Scale AI Purple System
        purple: {
          500: '#8b5cf6',           // Scale's signature purple
          600: '#7c3aed',
          700: '#6d28d9',
        },
        
        // Gradient Colors
        'gradient-purple': 'linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b)',
        'gradient-blue': 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        'gradient-rainbow': 'linear-gradient(135deg, #f59e0b, #ec4899, #8b5cf6, #3b82f6)',
        
        // Keep existing for backwards compatibility
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      
      // Typography
      fontFamily: {
        'english': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'korean': ['Noto Sans KR', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      
      // Font Sizes with Korean-friendly scaling
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.4' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      
      // Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Border Radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // Shadows
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
      },
      
      // Animations (Scale AI style)
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rotate': 'rotate 20s linear infinite',
        'rotate-reverse': 'rotate 30s linear infinite reverse',
        'rotate-slow': 'rotate 40s linear infinite',
      },
      
      // Keyframes (Scale AI gradient rings)
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        rotate: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      
      // Container
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      
      // Screens for responsive design
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
      // Grid
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(200px, 1fr))',
      },
      
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    // Custom plugin for Korean text optimization
    function({ addUtilities }) {
      const newUtilities = {
        '.text-korean': {
          'font-family': 'var(--font-family-korean)',
          'word-break': 'keep-all',
          'line-break': 'strict',
        },
        '.text-english': {
          'font-family': 'var(--font-family-english)',
        },
        '.heading-1': {
          'font-size': 'var(--text-4xl)',
          'font-weight': '700',
          'line-height': '1.2',
          'margin-bottom': 'var(--spacing-lg)',
        },
        '.heading-2': {
          'font-size': 'var(--text-3xl)',
          'font-weight': '600',
          'line-height': '1.3',
          'margin-bottom': 'var(--spacing-md)',
        },
        '.heading-3': {
          'font-size': 'var(--text-2xl)',
          'font-weight': '600',
          'line-height': '1.4',
          'margin-bottom': 'var(--spacing-sm)',
        },
        '.body-large': {
          'font-size': 'var(--text-lg)',
          'line-height': '1.6',
        },
        '.body-base': {
          'font-size': 'var(--text-base)',
          'line-height': '1.6',
        },
        '.body-small': {
          'font-size': 'var(--text-sm)',
          'line-height': '1.5',
        },
        '.btn-primary': {
          'background-color': 'var(--color-primary)',
          'color': 'var(--color-text-white)',
          'padding': 'var(--spacing-md) var(--spacing-xl)',
          'border-radius': 'var(--radius-lg)',
          'font-weight': '600',
          'transition': 'all var(--transition-normal)',
          'border': 'none',
          'cursor': 'pointer',
        },
        '.btn-primary:hover': {
          'background-color': 'var(--color-primary-dark)',
          'transform': 'translateY(-1px)',
          'box-shadow': 'var(--shadow-lg)',
        },
        '.btn-secondary': {
          'background-color': 'var(--color-secondary)',
          'color': 'var(--color-text-white)',
          'padding': 'var(--spacing-md) var(--spacing-xl)',
          'border-radius': 'var(--radius-lg)',
          'font-weight': '600',
          'transition': 'all var(--transition-normal)',
          'border': 'none',
          'cursor': 'pointer',
        },
        '.btn-secondary:hover': {
          'background-color': 'var(--color-secondary-dark)',
          'transform': 'translateY(-1px)',
          'box-shadow': 'var(--shadow-lg)',
        },
        '.btn-outline': {
          'background-color': 'transparent',
          'color': 'var(--color-primary)',
          'border': '2px solid var(--color-primary)',
          'padding': 'var(--spacing-md) var(--spacing-xl)',
          'border-radius': 'var(--radius-lg)',
          'font-weight': '600',
          'transition': 'all var(--transition-normal)',
          'cursor': 'pointer',
        },
        '.btn-outline:hover': {
          'background-color': 'var(--color-primary)',
          'color': 'var(--color-text-white)',
        },
        '.card': {
          'background-color': 'var(--color-bg-primary)',
          'border-radius': 'var(--radius-xl)',
          'box-shadow': 'var(--shadow-md)',
          'padding': 'var(--spacing-xl)',
          'transition': 'all var(--transition-normal)',
        },
        '.card:hover': {
          'box-shadow': 'var(--shadow-lg)',
          'transform': 'translateY(-2px)',
        },
        '.card-accent': {
          'background-color': 'var(--color-bg-accent)',
          'border': '1px solid #dbeafe',
        },
        '.input-field': {
          'width': '100%',
          'padding': 'var(--spacing-md)',
          'border': '1px solid var(--color-text-muted)',
          'border-radius': 'var(--radius-lg)',
          'font-size': 'var(--text-base)',
          'transition': 'all var(--transition-normal)',
          'background-color': 'var(--color-bg-primary)',
        },
        '.input-field:focus': {
          'outline': 'none',
          'border-color': 'var(--color-primary)',
          'box-shadow': '0 0 0 3px rgb(37 99 235 / 0.1)',
        },
        '.container': {
          'max-width': '1200px',
          'margin': '0 auto',
          'padding': '0 var(--spacing-lg)',
        },
        '.section': {
          'padding': 'var(--spacing-3xl) 0',
        },
        '.section-sm': {
          'padding': 'var(--spacing-2xl) 0',
        },
        '.lazy-load': {
          'opacity': '0',
          'transition': 'opacity var(--transition-normal)',
        },
        '.lazy-load.loaded': {
          'opacity': '1',
        },
        '.skeleton': {
          'background': 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          'background-size': '200% 100%',
          'animation': 'loading 1.5s infinite',
        },
        '.sr-only': {
          'position': 'absolute',
          'width': '1px',
          'height': '1px',
          'padding': '0',
          'margin': '-1px',
          'overflow': 'hidden',
          'clip': 'rect(0, 0, 0, 0)',
          'white-space': 'nowrap',
          'border': '0',
        },
        '.focus-visible': {
          'outline': '2px solid var(--color-primary)',
          'outline-offset': '2px',
        },
      };
      addUtilities(newUtilities);
    },
  ],
}; 