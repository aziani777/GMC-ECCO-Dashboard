import { Container, Grid } from '@mui/material';
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

    // ... rest of your component code ...
};

export default Dashboard; 