import { API_BASE_URL } from './config';

const fetchMerchants = async (region) => {
    try {
        console.log('Fetching from:', `${API_BASE_URL}/api/merchants/${region}`); // Debug log
        const response = await fetch(`${API_BASE_URL}/api/merchants/${region}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response data:', data); // Debug log
        return data;
    } catch (error) {
        console.error('Error fetching merchants:', error);
        throw error;
    }
};

export { fetchMerchants }; 