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
    return null;
  }
};

// Function to extract merchant statistics from the data
const extractMerchantStats = (merchantData) => {
  if (!merchantData?.data?.products) return null;
  
  // Get the Shopping destination stats
  const shoppingStats = merchantData.data.products.find(
    product => product.destination === 'Shopping'
  );

  if (!shoppingStats?.statistics) return null;

  return {
    active: parseInt(shoppingStats.statistics.active) || 0,
    disapproved: parseInt(shoppingStats.statistics.disapproved) || 0,
    pending: parseInt(shoppingStats.statistics.pending) || 0,
    total: parseInt(shoppingStats.statistics.active) + 
           parseInt(shoppingStats.statistics.disapproved) + 
           parseInt(shoppingStats.statistics.pending) || 0
  };
};

// Function to create merchant card data
export const createMerchantCard = (merchant) => {
  const stats = extractMerchantStats(merchant);
  
  // Get item level issues from Shopping destination
  const shoppingProduct = merchant.data?.products?.find(
    product => product.destination === 'Shopping'
  );
  
  return {
    name: merchant.name || 'Unknown Merchant',
    country: merchant.data?.accountId || 'Unknown ID',
    status: merchant.data?.websiteClaimed ? 'Active' : 'Inactive',
    active: stats?.active || 0,
    disapproved: stats?.disapproved || 0,
    total: stats?.total || 0,
    itemLevelIssues: shoppingProduct?.itemLevelIssues || []
  };
};

// Function to update the display with merchant data
export const updateMerchantDisplay = async (region) => {
  try {
    const response = await fetchMerchantsByRegion(region);
    if (!response) return [];

    // Handle different data structures for GLOBAL and EUROPE
    const merchants = response[`ECCO ${region.toUpperCase()}`]?.data || [];
    return merchants.map(merchant => createMerchantCard(merchant));
  } catch (error) {
    console.error('Error updating display:', error);
    return [];
  }
}; 