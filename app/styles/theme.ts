// src/styles/theme.ts

const theme = {
  // Brand Colors and Gradients
  colors: {
    primary: {
      orange: '#FF6B35',
      vibrantOrange: '#FF4500',
    },
    neutral: {
      deepCharcoal: '#0A0A0A',
      darkSlate: '#1A1A1A',
      offWhite: '#F8F8F8',
      pureWhite: '#FFFFFF',
    },
    accents: {
      gold: '#FFD700',
      electricBlue: '#00D4FF',
      neonGreen: '#39FF14',
    },
    gradients: {
      primaryButton: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
      linkHover: 'linear-gradient(90deg, #FF6B35, #FFD700)',
      heroText: 'linear-gradient(135deg, #F8F8F8 0%, #FF6B35 30%, #FFD700 60%, #00D4FF 100%)',
      featureTitle: 'linear-gradient(135deg, #F8F8F8 0%, #FF6B35 100%)',
      playerTitle: 'linear-gradient(135deg, #F8F8F8 0%, #FF6B35 100%)',
      footerHighlight: 'linear-gradient(90deg, #FF6B35, #FFD700)',
    },
    background: {
      deepCharcoal: '#0A0A0A',
      darkSlate: '#1A1A1A',
      glass: 'rgba(255, 255, 255, 0.1)',
      glassBorder: 'rgba(255, 255, 255, 0.2)',
      darkOverlay: 'rgba(10, 10, 10, 0.9)',
      scrolledHeader: 'rgba(10, 10, 10, 0.98)',
      featureCardHover: 'rgba(255, 107, 53, 0.05)',
      playerSection: 'rgba(26, 26, 26, 0.3)',
      playerControls: 'linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(26, 26, 26, 0.95) 100%)',
    },
  },

  // Typography Scale
  typography: {
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    lineHeight: 1.7,
    h1: {
      fontSize: 'clamp(2.5rem, 6vw, 5rem)',
      fontWeight: 900,
    },
    h2: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 900,
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: 700,
    },
    body: {
      fontSize: '1.1rem',
      fontWeight: 400,
    },
    paragraph: {
      fontSize: '1.4rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '1.1rem',
      fontWeight: 700,
    },
  },

  // Spacing Scale (based on an 8px grid)
  spacing: {
    'xs': '4px',
    'sm': '8px',
    'md': '16px',
    'lg': '24px',
    'xl': '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '80px',
    '5xl': '100px',
    '6xl': '120px',
    '7xl': '140px',
    // You can also reference these in CSS variables if you prefer
    // e.g., var(--spacing-md)
  },

  // Breakpoints for Responsive Design
  breakpoints: {
    xs: '480px', // Mobile
    sm: '640px', // Mobile Landscape & Small Tablets
    md: '768px', // Tablets
    lg: '1024px', // Laptops & Desktops
    xl: '1280px', // Large Desktops
    xxl: '1440px', // Extra Large Desktops
  },

  // Border Radii
  borderRadius: {
    'sm': '8px',
    'md': '12px',
    'lg': '20px',
    'xl': '25px',
    'pill': '50px',
  },

  // Box Shadows
  shadows: {
    low: '0 4px 15px rgba(255, 107, 53, 0.3)',
    medium: '0 8px 30px rgba(255, 107, 53, 0.4)',
    high: '0 15px 45px rgba(255, 107, 53, 0.6)',
    card: '0 10px 30px rgba(255, 107, 53, 0.2)',
    cardHover: '0 25px 50px rgba(255, 107, 53, 0.3)',
    glow: '0 0 20px rgba(255, 107, 53, 0.6)',
  },

  // Transitions
  transitions: {
    standard: 'all 0.3s ease',
    smooth: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.2s ease-out',
  },

  // Z-Index Layers
  zIndex: {
    below: -1,
    base: 0,
    header: 100,
    menu: 200,
    modal: 300,
    above: 999,
  },

  // Layout Constants
  layout: {
    maxWidth: '1200px',
    containerPadding: '0 20px',
  },
};

export default theme;