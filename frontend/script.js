console.log('Script starting...');

// Add API base URL constant and cache object at the top
const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5001';
const marketCardsCache = {
    global: null,
    europe: null,
    lastUpdate: null
};

// Add merchant configurations
const MERCHANT_CONFIG = {
    global: [
        {
            account_id: '6000402',    // US account
            name: 'ECCO US'
        },
        {
            account_id: '126580264',   // CA account
            name: 'ECCO CA'
        },
        {
            account_id: '124463984',   // AU account
            name: 'ECCO AU'
        }
    ],
    europe: [
        {
            account_id: '117117533',  // MCA account ID
            merchantId: '115079344',  // GB merchant ID
            name: 'ECCO GB'
        },
        {
            account_id: '117117533',
            merchantId: '117076029',
            name: 'ECCO DE'
        },
        {
            account_id: '117117533',
            merchantId: '115432148',
            name: 'ECCO DK'
        },
        {
            account_id: '117117533',
            merchantId: '115975194',
            name: 'ECCO FR'
        },
        {
            account_id: '117117533',
            merchantId: '117088301',
            name: 'ECCO NL'
        }
    ]
};

// Configuration for European merchants with their respective countries
const EUROPEAN_MERCHANTS = {
    'ECCO GB': { id: '115079344', country: 'GB' },
    'ECCO DE': { id: '117076029', country: 'DE' },
    'ECCO FR': { id: '115975194', country: 'FR' }
};

const ACCOUNT_ID = '117117533';

// Add debug logging function
function debug(message, data = null) {
    const timestamp = new Date().toISOString();
    if (data) {
        console.log(`[DEBUG ${timestamp}]`, message, data);
    } else {
        console.log(`[DEBUG ${timestamp}]`, message);
    }
}

// Fetch function using Promises
function fetchRegionData(region) {
    debug(`Fetching data for ${region}`);
    return fetch(`${API_BASE_URL}/api/merchants/${region}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            debug(`Data received for ${region}`, data);
            return data;
        })
        .catch(error => {
            debug(`Error fetching ${region} data:`, error);
            throw error;
        });
}

// Update initialization code to handle both regions
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM loaded - Initializing application');
    initializeData();  // Start loading the data
    
    const root = document.getElementById('root');
    if (!root) {
        debug('ERROR: Root element not found');
        return;
    }

    // Clear any existing content
    root.innerHTML = '';
    debug('Root cleared');

    // Create sections
    const globalSection = createSection('global');
    const europeSection = createSection('europe');
    
    // Add sections to root
    root.appendChild(globalSection);
    root.appendChild(europeSection);
    debug('Sections created and added to root');

    // Initialize menu click handlers for both Global and Europe
    const globalItem = document.querySelector('[data-region="global"]');
    const europeItem = document.querySelector('[data-region="europe"]');
    
    debug('Looking for menu items:', { global: globalItem, europe: europeItem });

    // Handle Global menu item
    if (globalItem) {
        setupMenuItem(globalItem, 'global');
    } else {
        debug('ERROR: Global menu item not found');
    }

    // Handle Europe menu item
    if (europeItem) {
        setupMenuItem(europeItem, 'europe');
    } else {
        debug('ERROR: Europe menu item not found');
    }
});

// Keep sections empty until clicked
function createSection(region) {
    const section = document.createElement('div');
    section.id = `${region}-section`;
    section.innerHTML = `
        <div id="${region}-cards" class="cards-container" style="
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            padding: 20px;
        "></div>
    `;
    return section;
}

// Add function to render merchant card
function renderMerchantCard(merchantName, merchantData) {
    // Get the first product's statistics (usually Shopping)
    const stats = merchantData.products[0].statistics;
    
    // Get all issues across all products
    const allIssues = merchantData.products.reduce((issues, product) => {
        if (product.itemLevelIssues) {
            issues.push(...product.itemLevelIssues);
        }
        return issues;
    }, []);

    // Count critical issues (those with servability: disapproved)
    const criticalIssues = allIssues.filter(issue => issue.servability === 'disapproved').length;

    return `
        <div class="merchant-card" style="
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            width: 300px;
        ">
            <h3 style="
                margin: 0 0 15px 0;
                color: #333;
                font-size: 18px;
                border-bottom: 2px solid ${criticalIssues > 0 ? '#f44336' : '#4CAF50'};
                padding-bottom: 10px;
            ">${merchantName}</h3>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Active Products:</span>
                    <span style="color: #4CAF50; font-weight: bold;">${stats.active}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Disapproved:</span>
                    <span style="color: #f44336; font-weight: bold;">${stats.disapproved}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Critical Issues:</span>
                    <span style="color: ${criticalIssues > 0 ? '#f44336' : '#4CAF50'}; font-weight: bold;">
                        ${criticalIssues}
                    </span>
                </div>
            </div>

            ${criticalIssues > 0 ? `
                <div style="
                    background: #ffebee;
                    border: 1px solid #ffcdd2;
                    border-radius: 4px;
                    padding: 10px;
                    font-size: 14px;
                    color: #c62828;
                ">
                    ⚠️ Requires immediate attention
                </div>
            ` : ''}
        </div>
    `;
}

// Update setupMenuItem function to use the configuration
function setupMenuItem(menuItem, region) {
    // Add visual indication that it's clickable
    menuItem.style.cursor = 'pointer';
    menuItem.style.padding = '10px';
    menuItem.style.backgroundColor = '#f5f5f5';
    menuItem.style.borderRadius = '4px';
    
    // Add hover effect
    menuItem.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#e0e0e0';
    });
    
    menuItem.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#f5f5f5';
    });

    // Add click handler
    menuItem.onclick = function() {
        debug(`${region} clicked`);
        
        // Hide other section
        const otherRegion = region === 'global' ? 'europe' : 'global';
        document.getElementById(`${otherRegion}-cards`).style.display = 'none';
        
        const cardsContainer = document.getElementById(`${region}-cards`);
        cardsContainer.style.display = 'flex';
        
        if (cardsContainer) {
            // Show loading message
            cardsContainer.innerHTML = `
                <div style="
                    padding: 20px;
                    margin: 20px;
                    background: #e3f2fd;
                    border: 1px solid #90caf9;
                    border-radius: 4px;
                    text-align: center;
                    color: #1976d2;
                    font-size: 16px;
                ">
                    Loading ${region.charAt(0).toUpperCase() + region.slice(1)} data. Please wait...
                </div>
            `;

            // Fetch data
            fetchRegionData(region)
                .then(data => {
                    debug(`Rendering ${region} data`, data);
                    const merchantConfig = MERCHANT_CONFIG[region];
                    
                    const cardsHtml = merchantConfig
                        .map(config => {
                            const merchantData = data[config.name];
                            if (merchantData) {
                                return renderMerchantCard(config.name, merchantData);
                            }
                            return '';
                        })
                        .filter(html => html) // Remove empty strings
                        .join('');
                    
                    if (!cardsHtml) {
                        cardsContainer.innerHTML = `
                            <div style="padding: 20px; text-align: center;">
                                No merchants found for ${region}
                            </div>
                        `;
                    } else {
                        cardsContainer.innerHTML = cardsHtml;
                    }
                })
                .catch(error => {
                    debug('Error:', error);
                    cardsContainer.innerHTML = `
                        <div style="color: red; padding: 20px;">
                            Error loading data: ${error.message}
                        </div>
                    `;
                });
        } else {
            debug(`ERROR: ${region} cards container not found`);
        }
    };
    
    debug(`${region} click handler attached`);
}

// Update selectRegion to use Promises
function selectRegion(region) {
    console.log(`Selecting region: ${region}`);
    const cardsContainer = document.getElementById(`${region}-cards`);
    
    if (!cardsContainer) {
        console.error(`Container for ${region} not found`);
        return;
    }

    // Show loading message
    cardsContainer.innerHTML = `
        <div style="
            padding: 20px;
            margin: 20px;
            background: #e3f2fd;
            border: 1px solid #90caf9;
            border-radius: 4px;
            text-align: center;
            color: #1976d2;
            font-size: 16px;
        ">
            Loading ${region.charAt(0).toUpperCase() + region.slice(1)} data. Please wait...
        </div>
    `;

    // Fetch and render data
    fetchRegionData(region)
        .then(data => {
            if (!data) {
                throw new Error('No data received');
            }
            const cardsHtml = Object.entries(data)
                .map(([merchantName, merchant]) => renderMerchantCard(merchantName, merchant))
                .join('');
                
            cardsContainer.innerHTML = cardsHtml;
            updateLastFetchTime();
        })
        .catch(error => {
            console.error(`Error loading ${region} data:`, error);
            cardsContainer.innerHTML = `<div style="color: red; padding: 20px;">Error loading data: ${error.message}</div>`;
        });
}

// Add refresh button
function addRefreshButton() {
    const refreshButton = document.createElement('button');
    refreshButton.innerHTML = '🔄 Refresh All Data';
    refreshButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background: #4A148C;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 1000;
    `;
    refreshButton.addEventListener('mouseover', () => {
        refreshButton.style.background = '#6a1b9a';
    });
    refreshButton.addEventListener('mouseout', () => {
        refreshButton.style.background = '#4A148C';
    });
    refreshButton.addEventListener('click', () => {
        refreshButton.disabled = true;
        refreshButton.innerHTML = '🔄 Refreshing...';
        
        // Clear the cache
        marketCardsCache.global = null;
        marketCardsCache.europe = null;
        marketCardsCache.lastUpdate = null;
        
        // Refresh both sections
        Promise.all([
            fetchRegionData('global'),
            fetchRegionData('europe')
        ]).then(() => {
            refreshButton.disabled = false;
            refreshButton.innerHTML = '🔄 Refresh All Data';
        }).catch(error => {
            console.error('Error refreshing data:', error);
            refreshButton.disabled = false;
            refreshButton.innerHTML = '🔄 Refresh Failed';
        });
    });
    document.body.appendChild(refreshButton);
}

// Add last update time display
function addLastUpdateDisplay() {
    const lastUpdateDisplay = document.createElement('div');
    lastUpdateDisplay.id = 'lastUpdateTime';
    lastUpdateDisplay.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        background: #e3f2fd;
        border-radius: 4px;
        color: #333;
        font-size: 14px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 1000;
    `;
    document.body.appendChild(lastUpdateDisplay);
}

// Update last fetch time
function updateLastFetchTime() {
    if (!marketCardsCache.lastUpdate) return;
    
    const lastUpdateDisplay = document.getElementById('lastUpdateTime');
    if (lastUpdateDisplay) {
        const date = new Date(marketCardsCache.lastUpdate);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
        lastUpdateDisplay.textContent = `Last updated: ${formattedDate}, ${formattedTime}`;
    }
}

// Initialize data
function initializeData() {
    return Promise.all([
        fetchRegionData('global'),
        fetchRegionData('europe')
    ]).then(() => {
        addRefreshButton();
        addLastUpdateDisplay();
        updateLastFetchTime();
    }).catch(error => {
        console.error('Error initializing data:', error);
    });
}

function getProductStatistics(merchant) {
    // Get the Shopping destination statistics
    const shoppingStats = merchant?.products?.find(
        product => product.destination === 'Shopping'
    )?.statistics || { active: 0, disapproved: 0 };

    return {
        approved: parseInt(shoppingStats.active) || 0,
        disapproved: parseInt(shoppingStats.disapproved) || 0
    };
}

// Single fetch attempt with timeout
async function fetchWithTimeout(url, options = {}, timeout = FETCH_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        console.log(`Fetching from URL: ${url}`); // Debug log
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
            },
        });
        clearTimeout(timeoutId);

        // Log response status
        console.log(`Response status: ${response.status}`);
        
        if (response.status === 404) {
            throw new Error('Endpoint not found. Please check the API URL.');
        }
        
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Check if cached data is valid
function isCacheValid(region) {
    if (!marketCardsCache[region]) return false;
    const age = Date.now() - marketCardsCache[region].timestamp;
    return age < CACHE_DURATION;
}

// Load data for all regions
async function preloadAllData() {
    const regions = ['global', 'europe'];
    const loadPromises = regions.map(region => {
        if (!isCacheValid(region)) {
            return fetchRegionData(region);
        }
        return Promise.resolve(marketCardsCache[region]);
    });

    await Promise.all(loadPromises);
    console.log('All regions preloaded');
}

// Add function to filter and process merchant data
function filterMerchantData(region, data) {
    if (region === 'europe') {
        // European market filters with correct merchant IDs
        const europeanMerchants = {
            'ECCO GB': '115079344',  // GB merchant ID
            'ECCO DE': '117076029',  // DE merchant ID
            'ECCO FR': '115975194'   // FR merchant ID
        };

        // Filter data to only include European merchants
        const filteredData = Object.keys(data)
            .filter(key => europeanMerchants[key])
            .reduce((obj, key) => {
                // Verify the merchant has the correct account ID (117117533)
                if (data[key].accountId === '117117533') {
                    obj[key] = data[key];
                } else {
                    console.warn(`Merchant ${key} has incorrect account ID: ${data[key].accountId}`);
                }
                return obj;
            }, {});

        if (Object.keys(filteredData).length === 0) {
            console.warn('No matching European merchants found');
            return data; // Return original data if no matches found
        }

        return filteredData;
    }
    
    return data; // Return unfiltered data for global view
}

// Function to fetch merchant data using list method with merchant filter
async function fetchMerchantStatus(merchantId, countryCode) {
    try {
        // Use list method with merchant filter in query params
        const response = await fetch(`/api/merchants/list?merchantId=${merchantId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Get the merchant data
        const merchantData = data[merchantId];
        if (!merchantData || merchantData.accountId !== ACCOUNT_ID) return null;

        // Create a new merchant object with filtered products
        return {
            ...merchantData,
            products: merchantData.products.filter(product => 
                product.country === countryCode && 
                product.destination === 'Shopping' &&
                product.channel === 'online'
            )
        };
    } catch (error) {
        console.error(`Error fetching merchant ${merchantId}:`, error);
        return null;
    }
}

async function renderSummaryData(region) {
    console.log(`Rendering summary data for ${region}...`);
    const cardsContainer = document.getElementById(`${region}-cards`);
    
    try {
        if (region === 'europe') {
            // Fetch data for each European merchant
            const merchantPromises = Object.entries(EUROPEAN_MERCHANTS).map(async ([name, config]) => {
                const data = await fetchMerchantStatus(config.id, config.country);
                if (data && data.products && data.products.length > 0) {
                    return [name, data];
                }
                return null;
            });

            // Wait for all merchant data to be fetched
            const merchantResults = await Promise.all(merchantPromises);
            
            // Combine into single object, filtering out null results
            const data = merchantResults
                .filter(result => result !== null)
                .reduce((acc, [name, data]) => {
                    acc[name] = data;
                    return acc;
                }, {});

            if (Object.keys(data).length === 0) {
                throw new Error('No European merchant data available');
            }

            cardsContainer.innerHTML = createSummaryTable(region, data);
        } else {
            // Global data fetch remains unchanged
            const response = await fetch('/api/merchants/global');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            cardsContainer.innerHTML = createSummaryTable(region, data);
        }

        updateLastFetchTime();
    } catch (error) {
        console.error(`Error rendering summary data for ${region}:`, error);
        cardsContainer.innerHTML = `
            <div style="color: red; padding: 20px;">
                Error loading data: ${error.message}
            </div>
        `;
    }
}

// Navigation handling
document.addEventListener('DOMContentLoaded', () => {
    // Add styles for the menu
    const menuStyles = `
        .nav-item {
            padding: 15px 20px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: background 0.3s;
            background: #4A148C; /* Dark purple */
        }
        .nav-item:hover {
            background: #7B1FA2; /* Medium purple */
        }
        .nav-item.active {
            background: #9C27B0; /* Light purple */
        }
        
        .merchant-card {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-width: 300px;
            flex: 1;
        }
        
        .merchant-container {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            padding: 20px;
        }
    `;
    
    // Add menu styles to document
    const menuStyleSheet = document.createElement('style');
    menuStyleSheet.textContent = menuStyles;
    document.head.appendChild(menuStyleSheet);

    // Get all navigation items
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            const region = item.dataset.region;
            
            if (region === 'europe') {
                try {
                    const rootElement = document.getElementById('root');
                    if (!rootElement) {
                        console.error('Root element not found');
                        return;
                    }
                    rootElement.innerHTML = 'Loading...';

                    // Update to use API_BASE_URL instead of hardcoded localhost
                    const response = await fetch(`${API_BASE_URL}/api/merchants/europe`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        mode: 'cors'
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Data received:', data);

                    if (data && data["ECCO EU"] && Object.keys(data["ECCO EU"]).length > 0) {
                        const merchantContainer = document.createElement('div');
                        merchantContainer.className = 'merchant-container';

                        Object.entries(data["ECCO EU"]).forEach(([merchantName, merchantData]) => {
                            const stats = merchantData.products[0]?.statistics || { 
                                active: 0, 
                                disapproved: 0, 
                                expiring: 0, 
                                pending: 0 
                            };
                            
                            const card = document.createElement('div');
                            card.className = 'merchant-card';
                            card.innerHTML = `
                                <h2>${merchantName}</h2>
                                <h3>Product Status</h3>
                                <div class="status-grid">
                                    <div class="status-item">
                                        <span class="number approved">${stats.active || 0}</span>
                                        <span class="label">Approved</span>
                                    </div>
                                    <div class="status-item">
                                        <span class="number disapproved">${stats.disapproved || 0}</span>
                                        <span class="label">Disapproved</span>
                                    </div>
                                    <div class="status-item">
                                        <span class="number pending">${stats.pending || 0}</span>
                                        <span class="label">Pending</span>
                                    </div>
                                    <div class="status-item">
                                        <span class="number expired">${stats.expiring || 0}</span>
                                        <span class="label">Expired</span>
                                    </div>
                                </div>
                            `;
                            
                            merchantContainer.appendChild(card);
                        });

                        rootElement.innerHTML = '';
                        rootElement.appendChild(merchantContainer);
                    } else {
                        rootElement.innerHTML = 'No merchants found for Europe';
                    }

                } catch (error) {
                    console.error('Error details:', error);
                    // Add more user-friendly error handling
                    const rootElement = document.getElementById('root');
                    if (rootElement) {
                        rootElement.innerHTML = `
                            <div style="padding: 20px; color: #f44336; text-align: center;">
                                <h3>Error Loading Data</h3>
                                <p>${error.message}</p>
                                <button onclick="location.reload()" style="
                                    padding: 10px 20px;
                                    background: #4A148C;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    margin-top: 10px;
                                ">Retry</button>
                            </div>
                        `;
                    }
                }
            }
        });
    });
});

// Add the styles
const styles = `
    .merchant-card h2 {
        margin: 0 0 20px 0;
        font-size: 24px;
    }
    
    .merchant-card h3 {
        margin: 0 0 15px 0;
        font-size: 18px;
    }
    
    .status-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }
    
    .status-item {
        background: #f5f5f5;
        padding: 15px;
        border-radius: 6px;
        text-align: center;
    }
    
    .number {
        display: block;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .approved { color: #4CAF50; }
    .disapproved { color: #f44336; }
    .pending { color: #FF9800; }
    .expired { color: #9E9E9E; }
    
    .label {
        font-size: 14px;
        color: #666;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);