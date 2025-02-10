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

const Dashboard = ({ merchants, activeRegion = 'global', onRegionChange }) => {
  console.log('Dashboard props:', { merchants, activeRegion, onRegionChange });

  const handleClick = (region) => {
    console.log('Clicking region:', region);
    if (typeof onRegionChange === 'function') {
      onRegionChange(region);
    }
  };

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
        
        <MenuButton
          component="button"
          active={activeRegion === 'global'}
          onClick={() => handleClick('global')}
        >
          🌐 Global
        </MenuButton>
        
        <MenuButton
          component="button"
          active={activeRegion === 'europe'}
          onClick={() => handleClick('europe')}
        >
          🌍 Europe
        </MenuButton>
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
          {(merchants?.data || []).map((merchant, index) => (
            <MerchantCard key={index} merchant={merchant} />
          ))}
        </Box>
      </ContentArea>
    </Box>
  );
};

export default Dashboard; 