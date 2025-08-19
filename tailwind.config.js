module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: 'hsl(220 80% 50%)',
        accent: 'hsl(170 70% 45%)',
        bg: 'hsl(220 15% 98%)',
        surface: 'hsl(220 15% 100%)',
        'text-primary': 'hsl(220 20% 20%)',
        'text-secondary': 'hsl(220 15% 40%)',
        border: 'hsl(220 15% 90%)',
        
        // Dark mode colors using CSS variables
        'dark-primary': 'hsl(220 70% 50%)',
        'dark-accent': 'hsl(170 60% 45%)',
        'dark-bg': 'hsl(220 15% 10%)',
        'dark-surface': 'hsl(220 15% 15%)',
        'dark-text-primary': 'hsl(220 15% 90%)',
        'dark-text-secondary': 'hsl(220 15% 70%)',
        'dark-border': 'hsl(220 15% 25%)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      spacing: {
        sm: '8px',
        md: '12px',
        lg: '20px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(0, 0%, 0%, 0.08)',
        'dark-card': '0 4px 12px hsla(0, 0%, 0%, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'hsl(220 20% 20%)',
            a: {
              color: 'hsl(220 80% 50%)',
              '&:hover': {
                color: 'hsl(220 80% 40%)',
              },
            },
            strong: {
              color: 'hsl(220 20% 20%)',
            },
          },
        },
        dark: {
          css: {
            color: 'hsl(220 15% 90%)',
            a: {
              color: 'hsl(220 70% 50%)',
              '&:hover': {
                color: 'hsl(220 70% 60%)',
              },
            },
            strong: {
              color: 'hsl(220 15% 90%)',
            },
          },
        },
      },
    },
  },
  plugins: [],
  // Apply dark mode variants
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark'],
      boxShadow: ['dark'],
    },
  },
}
