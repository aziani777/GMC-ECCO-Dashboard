import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, Typography } from '@mui/material/styles';
import Dashboard from './components/Dashboard';
import { CircularProgress, Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D1B69',
    },
  },
});

function App() {
  const [data, setData] = useState(null);
  const [activeRegion, setActiveRegion] = useState('global');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://gmc-ecco-backend.onrender.com/api/merchants/${activeRegion}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('API Response:', result);
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeRegion]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Dashboard 
        data={data}
        activeRegion={activeRegion}
        setActiveRegion={setActiveRegion}
      />
    </ThemeProvider>
  );
}

export default App; 