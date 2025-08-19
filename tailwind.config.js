
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220 80% 50%)',
        accent: 'hsl(170 70% 45%)',
        bg: 'hsl(220 15% 98%)',
        surface: 'hsl(220 15% 100%)',
        'text-primary': 'hsl(220 20% 20%)',
        'text-secondary': 'hsl(220 15% 40%)',
        border: 'hsl(220 15% 90%)',
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
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
      },
    },
  },
  plugins: [],
}
