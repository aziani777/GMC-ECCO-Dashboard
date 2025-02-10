import { Container, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import MerchantCard from './MerchantCard';
import { fetchMerchants } from './api';

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
                const data = await fetchMerchants(selectedRegion);
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
            {/* Debug section */}
            <pre style={{background: '#f5f5f5', padding: '10px', marginBottom: '20px'}}>
                {JSON.stringify(merchantData, null, 2)}
            </pre>
            
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