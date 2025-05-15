import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF8C00',
      light: '#FFA333',
      dark: '#E67E00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#424242',
      light: '#616161',
      dark: '#303030',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#424242',
      secondary: '#616161',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '0.02em',
      color: '#FF8C00',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      color: '#FF8C00',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      color: '#FF8C00',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      color: '#FF8C00',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      color: '#FF8C00',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      color: '#FF8C00',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FF8C00 0%, #E67E00 100%)',
          boxShadow: '0 2px 8px rgba(255, 140, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid rgba(255, 140, 0, 0.08)',
          boxShadow: '0 4px 12px rgba(255, 140, 0, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(255, 140, 0, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'uppercase',
          padding: '8px 24px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(135deg, #FF8C00 0%, #E67E00 100%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #E67E00 0%, #CC7000 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(255, 140, 0, 0.2)',
          },
        },
        outlined: {
          borderColor: '#FF8C00',
          color: '#FF8C00',
          '&:hover': {
            borderColor: '#E67E00',
            background: 'rgba(255, 140, 0, 0.05)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 140, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: '#FF8C00',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF8C00',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(255, 140, 0, 0.08)',
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