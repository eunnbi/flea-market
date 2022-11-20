import { createTheme } from '@mui/material';

export const theme = createTheme({
  ...createTheme(),
  palette: {
    primary: {
      main: '#000000',
      dark: '#000000',
      light: '#000000',
    },
    secondary: {
      main: '#1976d2',
      dark: '#1565c0',
      light: '#42a5f5',
    },
  },
  typography: {
    fontFamily: ['Pretendard', 'sans-serif'].join(','),
  },
});
