import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography, CircularProgress, Box } from '@mui/material';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D1B69',
    },
  },
});

function App() {
  const [merchants, setMerchants] = useState(null);
  const [activeRegion, setActiveRegion] = useState('global');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMerchants = async () => {
      setLoading(true);
      try {
        console.log('Fetching for region:', activeRegion);
        const response = await fetch(`https://gmc-ecco-backend.onrender.com/api/merchants/${activeRegion}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('API Response:', result);
        setMerchants(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, [activeRegion]);

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      ) : (
        <Dashboard 
          merchants={merchants || { data: [] }}
          activeRegion={activeRegion}
          setActiveRegion={setActiveRegion}
        />
      )}
    </ThemeProvider>
  );
}

export default App; 