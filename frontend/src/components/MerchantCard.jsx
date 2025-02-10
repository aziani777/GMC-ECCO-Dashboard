import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Box,
  Divider,
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import '../styles/MerchantCard.css';

const MerchantCard = ({ merchant }) => {
  const [expanded, setExpanded] = useState(false);
  const [showIssues, setShowIssues] = useState(false);
  
  // Extract statistics from merchant data
  const stats = merchant?.data?.products?.[0]?.statistics || {};
  const accountIssues = merchant?.data?.accountLevelIssues || [];
  const itemIssues = merchant?.data?.products?.[0]?.itemLevelIssues || [];

  return (
    <Card className="merchant-card" sx={{
      width: 300,
      height: 'fit-content',
      m: 2,
      p: 3,
      backgroundColor: '#f5f9ff',
      borderRadius: 2,
      boxShadow: 3
    }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        {merchant.name}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box sx={{ 
          p: 2, 
          bgcolor: '#fff', 
          borderRadius: 1,
          textAlign: 'center'
        }}>
          <Typography variant="h4" color="success.main">
            {stats.active || 0}
          </Typography>
          <Typography>Approved</Typography>
        </Box>
        
        <Box sx={{ 
          p: 2, 
          bgcolor: '#fff', 
          borderRadius: 1,
          textAlign: 'center'
        }}>
          <Typography variant="h4" color="error.main">
            {stats.disapproved || 0}
          </Typography>
          <Typography>Disapproved</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <IconButton 
          onClick={() => setShowIssues(!showIssues)}
          sx={{ width: '100%' }}
        >
          {showIssues ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        
        <Collapse in={showIssues}>
          {accountIssues.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Account Issues
              </Typography>
              {accountIssues.map((issue, index) => (
                <Typography key={index} color="error" variant="body2">
                  • {issue.title}
                </Typography>
              ))}
            </Box>
          )}

          {itemIssues.length > 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Item Issues
              </Typography>
              {itemIssues.map((issue, index) => (
                <Typography key={index} color="error" variant="body2">
                  • {issue.description} ({issue.numItems} items)
                </Typography>
              ))}
            </Box>
          )}
        </Collapse>
      </Box>
    </Card>
  );
};

export default MerchantCard; 