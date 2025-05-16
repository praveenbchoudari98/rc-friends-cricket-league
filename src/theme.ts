import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF8C00',
      dark: '#E67E00',
      light: '#FFA333',
    },
    secondary: {
      main: '#424242',
      dark: '#303030',
      light: '#616161',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#303030',
      secondary: '#616161',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#FF8C00',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      color: '#424242',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      color: '#424242',
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #424242 0%, #303030 100%)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'uppercase',
          fontWeight: 600,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF8C00 0%, #E67E00 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E67E00 0%, #CC7000 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(255, 140, 0, 0.2)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #424242 0%, #303030 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #303030 0%, #212121 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(48, 48, 48, 0.2)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(255, 140, 0, 0.1)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.02em',
        },
        filled: {
          background: 'rgba(255, 140, 0, 0.1)',
          color: '#FF8C00',
        },
      },
    },
  },
}); 