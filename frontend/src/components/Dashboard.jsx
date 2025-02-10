import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MerchantCard from './MerchantCard';

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
    marginRight: '10px',
    filter: 'brightness(0) invert(1)' // Makes the logo white
  }
});

const Dashboard = ({ data, activeRegion, setActiveRegion }) => {
  console.log('Dashboard props:', { data, activeRegion });
  
  // Get the correct data based on region
  const regionKey = `ECCO ${activeRegion?.toUpperCase()}`;
  const merchants = data?.[regionKey]?.data || [];

  // Define explicit handler functions with arrow function syntax
  const handleGlobalClick = () => {
    console.log('Clicking Global');
    setActiveRegion('global');
  };

  const handleEuropeClick = () => {
    console.log('Clicking Europe');
    setActiveRegion('europe');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu>
        <LogoContainer>
          <img 
            src="/ecco.png" 
            alt="ECCO" 
            style={{ filter: 'brightness(0) invert(1)' }} // Makes the logo white
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
        
        <Box 
          onClick={handleGlobalClick}
          sx={{
            p: 2,
            cursor: 'pointer',
            bgcolor: activeRegion === 'global' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderRadius: 1,
            mb: 1,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <Typography sx={{ color: 'white' }}>🌐 Global</Typography>
        </Box>
        
        <Box 
          onClick={handleEuropeClick}
          sx={{
            p: 2,
            cursor: 'pointer',
            bgcolor: activeRegion === 'europe' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <Typography sx={{ color: 'white' }}>🌍 Europe</Typography>
        </Box>
      </SideMenu>

      <ContentArea>
        <Typography variant="h5" sx={{ mb: 4 }}>
          ECCO Shoes - {activeRegion?.toUpperCase() || 'GLOBAL'}
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3 
        }}>
          {merchants.map((merchant, index) => (
            <MerchantCard key={index} merchant={merchant} />
          ))}
        </Box>
      </ContentArea>
    </Box>
  );
};

export default Dashboard; 