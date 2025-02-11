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

const IssueHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8
  }
}));

const MerchantCard = ({ merchant }) => {
  const [expanded, setExpanded] = useState(false);
  const issueCount = merchant.itemLevelIssues?.length || 0;
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Calculate disapproval rate
  const totalProducts = merchant.active + merchant.disapproved;
  const disapprovalRate = totalProducts > 0 
    ? ((merchant.disapproved / totalProducts) * 100).toFixed(2) 
    : '0.00';

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
          {merchant.name}
        </Typography>
        
        <Typography sx={{ color: '#546e7a', mb: 1 }}>
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

        <Typography 
          sx={{ 
            textAlign: 'center', 
            mt: 2, 
            color: disapprovalRate > 5 ? '#d32f2f' : '#546e7a',
            fontWeight: 'medium'
          }}
        >
          Disapproval Rate: {disapprovalRate}%
        </Typography>

        <IssueHeader onClick={toggleExpanded}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Item Level Issues: {issueCount}
          </Typography>
          <IconButton
            sx={{ 
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s'
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </IssueHeader>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
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
        </Collapse>
      </CardContent>
    </StyledCard>
  );
};

export default MerchantCard; 