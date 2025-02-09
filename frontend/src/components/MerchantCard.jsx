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
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import '../styles/MerchantCard.css';

const MerchantCard = ({ merchant }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="merchant-card">
      <CardContent>
        {/* Header: Name and Account Status */}
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h5" component="div">
            {merchant.name}
          </Typography>
          {merchant.accountStatus && (
            <Chip
              label={merchant.accountStatus.status}
              color={merchant.accountStatus.status === 'Active' ? 'success' : 'error'}
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Box>

        {/* Product Status Section */}
        <Typography variant="h6" gutterBottom>
          Product Status
        </Typography>
        <div className="status-grid">
          <div className="status-item">
            <Typography color="success.main" variant="h4">
              {merchant.productStatus?.approved || 0}
            </Typography>
            <Typography>Approved</Typography>
          </div>
          <div className="status-item">
            <Typography color="error.main" variant="h4">
              {merchant.productStatus?.disapproved || 0}
            </Typography>
            <Typography>Disapproved</Typography>
          </div>
          <div className="status-item">
            <Typography color="warning.main" variant="h4">
              {merchant.productStatus?.pending || 0}
            </Typography>
            <Typography>Pending</Typography>
          </div>
          <div className="status-item">
            <Typography color="text.secondary" variant="h4">
              {merchant.productStatus?.expired || 0}
            </Typography>
            <Typography>Expired</Typography>
          </div>
        </div>

        {/* Account Level Issues */}
        {merchant.accountStatus?.issues?.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom color="error">
              Account Level Issues
            </Typography>
            {merchant.accountStatus.issues.map((issue, index) => (
              <Box key={index} mb={1}>
                <Typography variant="body2" color="error">
                  • {issue.title || issue.detail}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Item Level Issues */}
        {merchant.itemLevelIssues?.length > 0 && (
          <Box mt={3}>
            <Accordion 
              expanded={expanded} 
              onChange={() => setExpanded(!expanded)}
              sx={{ backgroundColor: '#f8f9fa' }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6">
                    Item Level Issues ({merchant.itemLevelIssues.length})
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {merchant.itemLevelIssues.map((issue, index) => (
                  <Box key={index} mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {issue.severity === 'error' ? (
                        <ErrorIcon color="error" fontSize="small" />
                      ) : (
                        <WarningIcon color="warning" fontSize="small" />
                      )}
                      <Typography variant="subtitle2">
                        {issue.code.replace(/_/g, ' ').toUpperCase()}
                      </Typography>
                      <Chip 
                        label={`${issue.count} items`}
                        size="small"
                        color={issue.severity === 'error' ? 'error' : 'warning'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {issue.detail}
                    </Typography>
                    {issue.documentation && (
                      <a
                        href={issue.documentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="documentation-link"
                      >
                        View Documentation
                      </a>
                    )}
                    {index < merchant.itemLevelIssues.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MerchantCard; 