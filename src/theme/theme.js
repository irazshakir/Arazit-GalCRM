export const theme = {
  colors: {
    primary: {
      main: '#ac2478',
      hover: '#c62287',
      light: 'rgba(172, 36, 120, 0.1)', // 10% opacity for sidebar hover
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
      light: '#718096',
    },
    background: {
      main: '#ffffff',
      secondary: '#f7fafc',
      hover: '#f1f5f9',
    },
    border: {
      light: '#e2e8f0',
      main: '#cbd5e0',
    }
  },
  typography: {
    fontFamily: {
      main: '"Inter", system-ui, -apple-system, sans-serif',
    },
    weight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  }
};

export const getThemeColor = (path) => {
  return path.split('.').reduce((obj, key) => obj[key], theme);
};
