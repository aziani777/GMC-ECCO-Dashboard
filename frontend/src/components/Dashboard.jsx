import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import MerchantCard from './MerchantCard';

const Dashboard = ({ selectedRegion }) => {
  const [merchantData, setMerchantData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Selected Region:', selectedRegion);

  useEffect(() => {
    const fetchMerchantData = async () => {
      console.log('Fetching data for region:', selectedRegion);
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/merchants/${selectedRegion}`);
        const data = await response.json();
        console.log('API Response:', data);
        setMerchantData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantData();
  }, [selectedRegion]);

  console.log('Current merchant data:', merchantData);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {Object.entries(merchantData).map(([merchantName, merchant]) => (
          <Grid item xs={12} key={merchantName}>
            <MerchantCard merchant={merchant} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard; 