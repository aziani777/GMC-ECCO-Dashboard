import React from 'react';
import { Box, Typography, AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import MerchantCard from './MerchantCard';

const SideMenu = styled(Box)(({ theme }) => ({
  width: 250,
  backgroundColor: '#2D1B69',
  height: '100vh',
  padding: theme.spacing(2),
  color: 'white'
}));

const MenuItem = styled(Typography)(({ active }) => ({
  padding: '12px 16px',
  marginBottom: '8px',
  fontSize: '1.1rem',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)'
  }
}));

const Dashboard = ({ merchants, activeRegion, setActiveRegion }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <img src="/ecco.png" alt="ECCO" style={{ height: 40, marginRight: 10 }} />
          <img src="/gmc.png" alt="GMC" style={{ height: 30 }} />
        </Box>

        <Typography variant="h6" sx={{ mb: 3, pl: 2 }}>
          📊 Dashboard
        </Typography>

        <MenuItem 
          active={activeRegion === 'global'} 
          onClick={() => setActiveRegion('global')}
        >
          🌐 Global
        </MenuItem>
        
        <MenuItem 
          active={activeRegion === 'europe'} 
          onClick={() => setActiveRegion('europe')}
        >
          🌍 Europe
        </MenuItem>
      </SideMenu>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" sx={{ mb: 4 }}>
          ECCO Shoes
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3 
        }}>
          {merchants?.data?.map((merchant, index) => (
            <MerchantCard key={index} merchant={merchant} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 