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
  Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
    <Card sx={{
      width: 300,
      height: 'fit-content',
      backgroundColor: '#f5f9ff',
      borderRadius: 2,
      boxShadow: 3,
      overflow: 'visible'
    }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          {merchant.name}
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 2,
          mb: 2
        }}>
          <Box sx={{ 
            p: 2, 
            bgcolor: '#fff', 
            borderRadius: 1,
            textAlign: 'center',
            boxShadow: 1
          }}>
            <Typography variant="h4" color="success.main">
              {shoppingStats.active || 0}
            </Typography>
            <Typography color="text.secondary">Approved</Typography>
          </Box>
          
          <Box sx={{ 
            p: 2, 
            bgcolor: '#fff', 
            borderRadius: 1,
            textAlign: 'center',
            boxShadow: 1
          }}>
            <Typography variant="h4" color="error.main">
              {shoppingStats.disapproved || 0}
            </Typography>
            <Typography color="text.secondary">Disapproved</Typography>
          </Box>
        </Box>

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
      </Box>
    </Card>
  );
};

export default MerchantCard; 