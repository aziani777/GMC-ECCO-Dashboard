import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Box, 
  Collapse, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  CardContent
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease-in-out'
  }
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1)
}));

const MerchantCard = ({ merchant }) => {
  const [showIssues, setShowIssues] = useState(false);
  
  // Get Shopping destination statistics
  const shoppingStats = merchant?.data?.products?.find(
    p => p.destination === 'Shopping' && p.channel === 'online'
  )?.statistics || {};

  const accountIssues = merchant?.data?.accountLevelIssues || [];
  const itemIssues = merchant?.data?.products?.find(
    p => p.destination === 'Shopping'
  )?.itemLevelIssues || [];

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {merchant.name}
        </Typography>
        
        <Typography color="textSecondary" gutterBottom>
          ID: {merchant.country}
        </Typography>
        
        <Typography 
          color={merchant.status === 'Active' ? 'success.main' : 'error.main'} 
          gutterBottom
        >
          Status: {merchant.status}
        </Typography>

        <StatBox>
          <Box>
            <Typography variant="body2" color="textSecondary">Active</Typography>
            <Typography variant="h6" color="success.main">{merchant.active}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">Disapproved</Typography>
            <Typography variant="h6" color="error.main">{merchant.disapproved}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">Total</Typography>
            <Typography variant="h6">{merchant.total}</Typography>
          </Box>
        </StatBox>

        {(accountIssues.length > 0 || itemIssues.length > 0) && (
          <>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                View Issues
              </Typography>
              <IconButton 
                onClick={() => setShowIssues(!showIssues)}
                size="small"
              >
                {showIssues ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Box>

            <Collapse in={showIssues}>
              {accountIssues.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    Account Issues
                  </Typography>
                  <List dense>
                    {accountIssues.map((issue, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemText 
                          primary={issue.title}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'error.main'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {itemIssues.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    Item Issues
                  </Typography>
                  <List dense>
                    {itemIssues.map((issue, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemText 
                          primary={`${issue.description} (${issue.numItems} items)`}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'warning.main'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Collapse>
          </>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default MerchantCard; 