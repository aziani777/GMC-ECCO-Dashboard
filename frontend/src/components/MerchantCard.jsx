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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f0f8ff', // Light blue background
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

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const MerchantCard = ({ merchant }) => {
  const [showIssues, setShowIssues] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  // Get Shopping destination statistics
  const shoppingStats = merchant?.data?.products?.find(
    p => p.destination === 'Shopping' && p.channel === 'online'
  )?.statistics || {};

  const accountIssues = merchant?.data?.accountLevelIssues || [];
  const itemIssues = merchant?.data?.products?.find(
    p => p.destination === 'Shopping'
  )?.itemLevelIssues || [];

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Item Level Issues:
            </Typography>
            <List dense>
              {itemIssues.map((issue, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={issue.description}
                    secondary={`Affected items: ${issue.numItems}`}
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