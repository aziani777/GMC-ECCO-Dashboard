import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import MerchantCard from './MerchantCard';
import { updateMerchantDisplay } from '../script';  // Import the new function

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

const ContentArea = styled(Box)({
  marginLeft: 250,
  padding: '24px'
});

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
  const [isLoading, setIsLoading] = useState(false);  // Add loading state

  const handleClick = async (region) => {
    console.log('Clicking region:', region);
    if (typeof onRegionChange === 'function') {
      onRegionChange(region);
    }
    
    // Set loading state
    setIsLoading(true);
    try {
      // Fetch and update merchant data
      const merchants = await updateMerchantDisplay(region);
      console.log('Fetched merchants:', merchants);  // Debug log
      setMerchantData(merchants || []);
    } catch (error) {
      console.error('Error fetching merchants:', error);
      setMerchantData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    handleClick(activeRegion);
  }, [activeRegion]);

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
          onClick={() => handleClick('global')}
          disabled={isLoading}  // Disable while loading
          sx={{
            justifyContent: 'flex-start',
            color: 'white',
            backgroundColor: activeRegion === 'global' ? 'rgba(255,255,255,0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)'
            },
            mb: 1
          }}
        >
          🌐 Global
        </Button>
        
        <Button
          fullWidth
          variant="text"
          onClick={() => handleClick('europe')}
          disabled={isLoading}  // Disable while loading
          sx={{
            justifyContent: 'flex-start',
            color: 'white',
            backgroundColor: activeRegion === 'europe' ? 'rgba(255,255,255,0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          🌍 Europe
        </Button>
      </SideMenu>

      <ContentArea>
        <Typography variant="h5" sx={{ mb: 4 }}>
          ECCO Shoes - {activeRegion?.toUpperCase() || 'GLOBAL'}
        </Typography>
        
        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '200px'
          }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Loading data. Please wait...</Typography>
          </Box>
        ) : merchantData.length > 0 ? (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3 
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