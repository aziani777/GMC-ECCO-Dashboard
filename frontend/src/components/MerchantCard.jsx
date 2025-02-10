import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#e3f2fd',  // Nice light blue
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    transform: 'translateY(-4px)'
  }
}));

const StatContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 0),
  marginTop: theme.spacing(2)
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1)
}));

const MerchantCard = ({ merchant }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          {merchant.name}
        </Typography>
        
        <Typography sx={{ color: '#546e7a', mb: 1 }}>
          ID: {merchant.country}
        </Typography>
        
        <Typography 
          sx={{ 
            color: merchant.status === 'Active' ? '#2e7d32' : '#d32f2f',
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Status: {merchant.status}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <StatContainer>
          <StatItem>
            <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              {merchant.active}
            </Typography>
            <Typography variant="body2" sx={{ color: '#546e7a' }}>
              Active
            </Typography>
          </StatItem>
          <StatItem>
            <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
              {merchant.disapproved}
            </Typography>
            <Typography variant="body2" sx={{ color: '#546e7a' }}>
              Disapproved
            </Typography>
          </StatItem>
          <StatItem>
            <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              {merchant.total}
            </Typography>
            <Typography variant="body2" sx={{ color: '#546e7a' }}>
              Total
            </Typography>
          </StatItem>
        </StatContainer>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Item Level Issues:
            </Typography>
            <List dense sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }}>
              {merchant.itemLevelIssues?.map((issue, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={issue.description}
                    secondary={`Affected items: ${issue.numItems}`}
                    primaryTypographyProps={{ 
                      sx: { color: '#1976d2', fontWeight: 'medium' }
                    }}
                  />
                </ListItem>
              ))} 
            </List>
          </Box>
        </Collapse>
      </CardContent>
    </StyledCard>
  );
};

export default MerchantCard; 