import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MerchantCard from './MerchantCard';
import { updateMerchantDisplay } from '../script';  // Import the new function
import RefreshIcon from '@mui/icons-material/Refresh';
import { format } from 'date-fns';

const SideMenu = styled(Box)(({ theme }) => ({
  width: 250,
  backgroundColor: '#2D1B69',
  height: '100vh',
  padding: theme.spacing(2),
  color: 'white',
  position: 'fixed',
  left: 0,
  top: 0
}));

const MenuItem = styled(Box)(({ active }) => ({
  padding: '12px 16px',
  marginBottom: '8px',
  fontSize: '1.2rem',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)'
  }
}));

const ContentArea = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  marginLeft: 200,
  backgroundColor: '#f5f8fa',
  minHeight: '100vh'
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '40px',
  '& img': {
    height: '30px',
    marginRight: '10px'
  }
});

const MenuButton = styled(Box)(({ theme, active }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
  color: 'white',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  border: 'none',
  width: '100%',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center'
}));

const Dashboard = ({ activeRegion = 'global', onRegionChange }) => {
  const [merchantData, setMerchantData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(activeRegion);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = async (region, force = false) => {
    // Check cache first
    const cachedData = localStorage.getItem(`merchantData_${region}`);
    const cacheTimestamp = localStorage.getItem(`merchantDataTimestamp_${region}`);
    const now = new Date().getTime();

    // Use cache if available and not forced refresh
    if (!force && cachedData && cacheTimestamp) {
      const cacheAge = now - parseInt(cacheTimestamp);
      const cacheExpiry = new Date().setHours(3, 0, 0, 0); // 3 AM CET
      
      if (cacheAge < 24 * 60 * 60 * 1000 && now < cacheExpiry) { // Cache valid for 24h or until 3 AM
        setMerchantData(JSON.parse(cachedData));
        setLastUpdate(new Date(parseInt(cacheTimestamp)));
        return;
      }
    }

    setIsLoading(true);
    try {
      const merchants = await updateMerchantDisplay(region);
      setMerchantData(merchants);
      
      // Update cache
      localStorage.setItem(`merchantData_${region}`, JSON.stringify(merchants));
      localStorage.setItem(`merchantDataTimestamp_${region}`, now.toString());
      setLastUpdate(new Date(now));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedRegion);
  }, [selectedRegion]);

  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu>
        <LogoContainer>
          <img 
            src="/ecco.png" 
            alt="ECCO" 
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <img 
            src="/gmc.png" 
            alt="GMC" 
            style={{ height: '24px', filter: 'brightness(0) invert(1)' }} 
          />
        </LogoContainer>
        
        <Typography variant="h6" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
          Dashboard
        </Typography>
        
        <Button
          fullWidth
          variant="text"
          onClick={() => fetchData('global')}
          disabled={isLoading}
          sx={{
            justifyContent: 'flex-start',
            color: 'white',
            backgroundColor: selectedRegion === 'global' ? 'rgba(255,255,255,0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          🌐 GLOBAL
        </Button>
        
        <Button
          fullWidth
          variant="text"
          onClick={() => fetchData('europe')}
          disabled={isLoading}
          sx={{
            justifyContent: 'flex-start',
            color: 'white',
            backgroundColor: selectedRegion === 'europe' ? 'rgba(255,255,255,0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          🌍 Europe
        </Button>
        
        <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Last update: {lastUpdate ? format(lastUpdate, 'dd MMM yyyy, HH:mm') : 'Never'}
          </Typography>
        </Box>
      </SideMenu>

      <ContentArea>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5">
            Google Merchant Center Status - {selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)}
          </Typography>
          <IconButton 
            onClick={() => fetchData(selectedRegion, true)}
            disabled={isLoading}
            sx={{ ml: 2 }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Loading data. Please wait...</Typography>
          </Box>
        ) : merchantData.length > 0 ? (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 4,
            padding: '0 2px',
            width: '100%'
          }}>
            {merchantData.map((merchant, index) => (
              <MerchantCard key={index} merchant={merchant} />
            ))}
          </Box>
        ) : (
          <Typography>No merchant data available for this region.</Typography>
        )}
      </ContentArea>
    </Box>
  );
};

export default Dashboard; 