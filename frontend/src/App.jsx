import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from './components/Dashboard';
import { CircularProgress, Box, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D1B69',
    },
  },
});

function App() {
  const [merchants, setMerchants] = useState({ data: [] });  // Initialize with empty data array
  const [activeRegion, setActiveRegion] = useState('global');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMerchants = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching data for region:', activeRegion);
        const response = await fetch(`https://gmc-ecco-backend.onrender.com/api/merchants/${activeRegion}`);
        const data = await response.json();
        console.log('Received data:', data);
        
        // Check which key to use based on region
        const key = `ECCO ${activeRegion.toUpperCase()}`;
        if (data && data[key]) {
          setMerchants(data[key]);
        } else {
          setError('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching merchants:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, [activeRegion]);

  const handleRegionChange = (newRegion) => {
    console.log('Changing region to:', newRegion);
    setActiveRegion(newRegion);
  };

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Dashboard 
          merchants={merchants || { data: [] }}  // Provide fallback empty data
          activeRegion={activeRegion}
          setActiveRegion={handleRegionChange}
        />
      )}
    </ThemeProvider>
  );
}

export default App; 