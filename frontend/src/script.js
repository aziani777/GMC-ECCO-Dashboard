// Function to fetch merchant data by region
export const fetchMerchantsByRegion = async (region) => {
  try {
    const response = await fetch(`https://gmc-ecco-backend.onrender.com/api/merchants/${region}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching merchants:', error);
    return { data: [] };
  }
};

// Function to create merchant card HTML
export const createMerchantCard = (merchant) => {
  return {
    name: merchant.name || 'Unknown Merchant',
    country: merchant.country || 'Unknown Country',
    status: merchant.status || 'Unknown Status',
    revenue: merchant.revenue || '0',
    orders: merchant.orders || '0'
  };
};

// Function to update the display with merchant data
export const updateMerchantDisplay = async (region) => {
  try {
    const merchants = await fetchMerchantsByRegion(region);
    return merchants.data.map(merchant => createMerchantCard(merchant));
  } catch (error) {
    console.error('Error updating display:', error);
    return [];
  }
}; 