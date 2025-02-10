import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from './components/Dashboard';
import { CircularProgress, Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D1B69',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#f44336',
    },
  },
});

function App() {
  const [merchants, setMerchants] = useState(null);
  const [activeRegion, setActiveRegion] = useState('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchants = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://gmc-ecco-backend.onrender.com/api/merchants/${activeRegion}`);
        const data = await response.json();
        setMerchants(data[`ECCO ${activeRegion.toUpperCase()}`]);
      } catch (error) {
        console.error('Error fetching merchants:', error);
      }
      setLoading(false);
    };

    fetchMerchants();
  }, [activeRegion]);

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Dashboard 
          merchants={merchants} 
          activeRegion={activeRegion}
          setActiveRegion={setActiveRegion}
        />
      )}
    </ThemeProvider>
  );
}

export default App; 