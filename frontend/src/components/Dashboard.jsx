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

const Dashboard = () => {
  const [merchantData, setMerchantData] = useState({
    global: [],
    europe: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [lastUpdate, setLastUpdate] = useState(null);

  const isGlobalMarket = (merchantName) => {
    return merchantName.includes('US') || 
           merchantName.includes('CA') || 
           merchantName.includes('AU') || 
           merchantName.includes('SG') || 
           merchantName.includes('MY');
  };

  const isEuropeanMarket = (merchantName) => {
    return merchantName.includes('GB') || 
           merchantName.includes('FR') || 
           merchantName.includes('DE') || 
           merchantName.includes('AT') || 
           merchantName.includes('BE') || 
           merchantName.includes('CH') || 
           merchantName.includes('CZ') || 
           merchantName.includes('DK') || 
           merchantName.includes('RO') || 
           merchantName.includes('ES') || 
           merchantName.includes('FI') || 
           merchantName.includes('HU') || 
           merchantName.includes('IE') || 
           merchantName.includes('LT') || 
           merchantName.includes('LV') || 
           merchantName.includes('NL') || 
           merchantName.includes('NO') || 
           merchantName.includes('PL') || 
           merchantName.includes('PT') || 
           merchantName.includes('SE') || 
           merchantName.includes('SK');
  };

  const filterMerchantsByRegion = (merchants, region) => {
    return merchants.filter(merchant => 
      region === 'global' ? isGlobalMarket(merchant.name) : isEuropeanMarket(merchant.name)
    );
  };

  const fetchData = async (region, force = false) => {
    // Check if we already have data for this region
    const cachedData = localStorage.getItem(`merchantData_${region}`);
    const cacheTimestamp = localStorage.getItem(`merchantDataTimestamp_${region}`);
    const now = new Date().getTime();

    // Use cache if available and not forced refresh
    if (!force && cachedData && cacheTimestamp) {
      const cache = JSON.parse(cachedData);
      const timestamp = parseInt(cacheTimestamp);
      
      setMerchantData(prevData => ({
        ...prevData,
        [region]: cache
      }));
      setLastUpdate(new Date(timestamp));
      return;
    }

    // Only fetch if forced or no cache
    setIsLoading(true);
    try {
      const allMerchants = await updateMerchantDisplay(region);
      const filteredMerchants = filterMerchantsByRegion(allMerchants, region);
      
      setMerchantData(prevData => ({
        ...prevData,
        [region]: filteredMerchants
      }));
      
      // Update cache
      localStorage.setItem(`merchantData_${region}`, JSON.stringify(filteredMerchants));
      localStorage.setItem(`merchantDataTimestamp_${region}`, now.toString());
      setLastUpdate(new Date(now));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    // Only fetch if we don't have data for this region
    if (!merchantData[region] || merchantData[region].length === 0) {
      fetchData(region, false);
    }
  };

  // Schedule daily refresh at 3 AM CET
  useEffect(() => {
    const scheduleDailyRefresh = () => {
      const now = new Date();
      const cetTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
      
      // Set next refresh time to 3 AM CET
      const nextRefresh = new Date(cetTime);
      nextRefresh.setHours(3, 0, 0, 0);
      
      // If it's past 3 AM, schedule for next day
      if (cetTime.getHours() >= 3) {
        nextRefresh.setDate(nextRefresh.getDate() + 1);
      }
      
      const timeUntilRefresh = nextRefresh - cetTime;
      
      // Schedule the refresh
      const refreshTimeout = setTimeout(() => {
        fetchData('global', true);
        fetchData('europe', true);
        // Reschedule for next day
        scheduleDailyRefresh();
      }, timeUntilRefresh);

      return () => clearTimeout(refreshTimeout);
    };

    scheduleDailyRefresh();
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!merchantData[selectedRegion] || merchantData[selectedRegion].length === 0) {
      fetchData(selectedRegion, false);
    }
  }, []);

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
            alt="GMC Logo" 
            style={{ 
              width: 'auto',
              height: '40px',
              marginRight: '10px',
              filter: 'brightness(0) invert(1)'  // This will make it white on dark background
            }} 
          />
        </LogoContainer>
        
        <Typography variant="h6" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
          Dashboard
        </Typography>
        
        <Button
          fullWidth
          variant="text"
          onClick={() => handleRegionChange('global')}
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
          onClick={() => handleRegionChange('europe')}
          sx={{
            justifyContent: 'flex-start',
            color: 'white',
            backgroundColor: selectedRegion === 'europe' ? 'rgba(255,255,255,0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          🌍 EUROPE
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
          >
            <RefreshIcon />
          </IconButton>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 4,
            padding: '0 2px',
            width: '100%'
          }}>
            {merchantData[selectedRegion]?.map((merchant, index) => (
              <MerchantCard key={merchant.name} merchant={merchant} />
            ))}
          </Box>
        )}
      </ContentArea>
    </Box>
  );
};

export default Dashboard; 