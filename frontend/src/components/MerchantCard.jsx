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
  paddingBottom: theme.spacing(2),
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    transform: 'translateY(-4px)'
  }
}));

const StatContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(4),
  padding: theme.spacing(4, 2),
  marginTop: theme.spacing(2)
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2)
}));

const MerchantCard = ({ merchant }) => {
  const [expanded, setExpanded] = useState(false);
  const issueCount = merchant.itemLevelIssues?.length || 0;

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          {merchant.name}
        </Typography>
        
        <Typography sx={{ color: '#546e7a', mb: 2 }}>
          ID: {merchant.country}
        </Typography>
        
        <Typography 
          sx={{ 
            color: merchant.status === 'Active' ? '#2e7d32' : '#d32f2f',
            fontWeight: 'bold',
            mb: 3
          }}
        >
          Status: {merchant.status}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <StatContainer>
          <StatItem>
            <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              {merchant.active}
            </Typography>
            <Typography variant="body1" sx={{ color: '#546e7a', mt: 1 }}>
              Active
            </Typography>
          </StatItem>
          <StatItem>
            <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
              {merchant.disapproved}
            </Typography>
            <Typography variant="body1" sx={{ color: '#546e7a', mt: 1 }}>
              Disapproved
            </Typography>
          </StatItem>
        </StatContainer>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Item Level Issues: {issueCount}
            </Typography>
            <List>
              {merchant.itemLevelIssues?.map((issue, index) => (
                <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                  <ListItemText
                    primary={issue.description}
                    secondary={`Affected items: ${issue.numItems}`}
                    primaryTypographyProps={{ 
                      sx: { color: '#1976d2', fontWeight: 'medium', mb: 1 }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {issue.detail}
                  </Typography>
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