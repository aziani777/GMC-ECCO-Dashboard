const fetchMerchants = async (region) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/merchants/${region}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}; 