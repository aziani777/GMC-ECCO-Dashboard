import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
  const [merchants, setMerchants] = useState(null);
  const [activeRegion, setActiveRegion] = useState('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchants = async () => {
      setLoading(true);
      try {
        console.log('Fetching data for region:', activeRegion);
        const response = await fetch(`https://gmc-ecco-backend.onrender.com/api/merchants/${activeRegion}`);
        const data = await response.json();
        console.log('Received data:', data);
        
        // Check which key to use based on region
        const key = `ECCO ${activeRegion.toUpperCase()}`;
        setMerchants(data[key]);
      } catch (error) {
        console.error('Error fetching merchants:', error);
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
          setActiveRegion={handleRegionChange}
        />
      )}
    </ThemeProvider>
  );
}

export default App; 