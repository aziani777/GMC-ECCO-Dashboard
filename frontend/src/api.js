import { API_BASE_URL } from './config';

const fetchMerchants = async (region) => {
    try {
        const url = `${API_BASE_URL}/api/merchants/${region}`;
        console.log('Fetching from:', url); // Debug log
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response not OK:', response.status, errorText);
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