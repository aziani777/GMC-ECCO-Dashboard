from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from google.oauth2 import service_account
from googleapiclient.discovery import build
import os
import traceback
import json
import ssl
import certifi
import requests
import concurrent.futures
import time
import atexit
from google.auth.transport.requests import Request
from pathlib import Path
from os import environ

app = Flask(__name__)

# Update CORS to use environment variable for frontend URL
FRONTEND_URL = environ.get('FRONTEND_URL', 'http://localhost:8000')
CORS(app, 
     resources={r"/*": {
         "origins": [FRONTEND_URL],
         "methods": ["GET", "POST", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
     }})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', FRONTEND_URL)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Define merchant configurations
app.config['GLOBAL_MERCHANTS'] = [
    {
        'account_id': '6000402',    # US account (non-MCA)
        'name': 'ECCO US',    # Official Merchant Center name
        'path': 'merchants/6000402/products'  # Path for US products
    },
    {
        'account_id': '126580264',   # CA account
        'name': 'ECCO CA',    # Official Merchant Center name
        'path': 'merchants/126580264/products'  # Path for CA products
    },
    {
        'account_id': '124463984',   # AU account
        'name': 'ECCO AU',    # Official Merchant Center name
        'path': 'merchants/124463984/products'  # Path for AU products
    }
]

app.config['EUROPE_MERCHANTS'] = [
    {
        'account_id': '117117533',  # MCA account ID
        'merchantId': '115079344',  # GB merchant ID
        'name': 'ECCO GB',  # Official Merchant Center name
        'path': 'merchants/115079344/products'  # Path for GB products
    },
    {
        'account_id': '117117533',
        'merchantId': '117076029',
        'name': 'ECCO DE',
        'path': 'merchants/117076029/products'  # Path for DE products
    },
    {
        'account_id': '117117533',
        'merchantId': '115432148',
        'name': 'ECCO DK',
        'path': 'merchants/115432148/products'  # Path for DK products
    },
    {
        'account_id': '117117533',
        'merchantId': '115975194',
        'name': 'ECCO FR',
        'path': 'merchants/115975194/products'  # Path for FR products
    },
    {
        'account_id': '117117533',
        'merchantId': '117088301',
        'name': 'ECCO NL',
        'path': 'merchants/117088301/products'  # Path for NL products
    }
]

# Configure SSL context
ssl_context = ssl.create_default_context(cafile=certifi.where())

# Configure session with proper SSL settings
session = requests.Session()
session.verify = certifi.where()

# Retry configuration
MAX_RETRIES = 3
RETRY_DELAY = 1  # seconds

# Define the base directory and service account file path
BASE_DIR = Path(__file__).resolve().parent
SERVICE_ACCOUNT_FILE = BASE_DIR / 'config' / 'service_account.json'

# Load credentials and create API client
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE,
    scopes=['https://www.googleapis.com/auth/content']
)

# Initialize the Google API service
def initialize_service():
    SCOPES = ['https://www.googleapis.com/auth/content']
    
    # Update path to point to the config directory
    SERVICE_ACCOUNT_FILE = os.path.join(
        os.path.dirname(__file__), 
        'config', 
        'service_account.json'
    )
    
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        raise FileNotFoundError(
            f"Service account file not found at {SERVICE_ACCOUNT_FILE}. "
            "Please ensure the service account JSON file exists in the config directory."
        )
    
    try:
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        return build('content', 'v2.1', credentials=credentials)
    except Exception as e:
        print(f"Error initializing service: {str(e)}")
        raise

# Create the service instance
service = initialize_service()

def get_content_api_client():
    """Initialize the Content API client with proper credentials"""
    try:
        if not SERVICE_ACCOUNT_FILE.exists():
            app.logger.error(f"Service account file not found at: {SERVICE_ACCOUNT_FILE}")
            raise FileNotFoundError(
                f"Service account file not found at {SERVICE_ACCOUNT_FILE}. "
                "Please ensure the service account JSON file exists in the config directory."
            )

        # Verify file is readable and contains valid JSON
        try:
            with open(SERVICE_ACCOUNT_FILE, 'r') as f:
                json.load(f)  # Validate JSON format
            app.logger.info(f"Successfully verified service account file at: {SERVICE_ACCOUNT_FILE}")
        except json.JSONDecodeError:
            app.logger.error("Service account file contains invalid JSON")
            raise
        except PermissionError:
            app.logger.error(f"Permission denied reading service account file at: {SERVICE_ACCOUNT_FILE}")
            raise

        credentials = service_account.Credentials.from_service_account_file(
            str(SERVICE_ACCOUNT_FILE),
            scopes=['https://www.googleapis.com/auth/content']
        )
        return build('content', 'v2.1', credentials=credentials)
    except Exception as e:
        app.logger.error(f"Error creating API client: {str(e)}\n{traceback.format_exc()}")
        raise

def get_all_products(service, merchant_id):
    """Fetch all products using pagination"""
    products = []
    page_token = None
    
    while True:
        request = service.productstatuses().list(
            merchantId=merchant_id,
            maxResults=250,  # Max allowed per page
            pageToken=page_token if page_token else None
        )
        
        try:
            result = request.execute()
            if 'resources' in result:
                products.extend(result['resources'])
            
            # Check if there are more pages
            page_token = result.get('nextPageToken')
            if not page_token:
                break
                
        except Exception as e:
            print(f"Error fetching products page: {str(e)}")
            break
    
    return products

def get_merchant_accounts(region):
    """Get merchant account info based on region"""
    try:
        if region == 'global':
            return app.config['GLOBAL_MERCHANTS']
        elif region == 'europe':
            return app.config['EUROPE_MERCHANTS']
        else:
            return []
    except Exception as e:
        print(f"Error setting up merchant accounts: {str(e)}")
        raise

def get_merchant_data(merchant_id, account_id):
    # Only fetch essential data
    essential_data = {
        'accountStatus': get_account_status(merchant_id, account_id),
        'productStatus': get_product_status(merchant_id),
        'itemLevelIssues': get_item_issues(merchant_id)
    }
    
    # Remove null or empty values
    return {k: v for k, v in essential_data.items() if v}

def get_account_status(merchant_id, account_id):
    # Only fetch status and issues
    status = service.accountstatuses().get(
        merchantId=merchant_id,
        accountId=account_id
    ).execute()
    
    return {
        'status': status.get('accountStatus'),
        'issues': status.get('issues', [])
    }

def get_access_token():
    """Get access token from service account"""
    try:
        if not SERVICE_ACCOUNT_FILE.exists():
            app.logger.error(f"Service account file not found at: {SERVICE_ACCOUNT_FILE}")
            raise FileNotFoundError(f"Service account file not found at {SERVICE_ACCOUNT_FILE}")
        
        # Verify file is readable and contains valid JSON
        try:
            with open(SERVICE_ACCOUNT_FILE, 'r') as f:
                json.load(f)  # Validate JSON format
            app.logger.info(f"Successfully verified service account file at: {SERVICE_ACCOUNT_FILE}")
        except json.JSONDecodeError:
            app.logger.error("Service account file contains invalid JSON")
            raise
        except PermissionError:
            app.logger.error(f"Permission denied reading service account file at: {SERVICE_ACCOUNT_FILE}")
            raise
            
        credentials = service_account.Credentials.from_service_account_file(
            str(SERVICE_ACCOUNT_FILE),
            scopes=['https://www.googleapis.com/auth/content']
        )
        
        if not credentials.valid:
            credentials.refresh(Request())
        
        return credentials.token
    except Exception as e:
        app.logger.error(f"Error getting access token: {str(e)}\n{traceback.format_exc()}")
        raise

def fetch_merchant_data(merchant_id, account_id):
    for attempt in range(MAX_RETRIES):
        try:
            token = get_access_token()
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            url = f'https://www.googleapis.com/content/v2.1/{merchant_id}/accountstatuses/{account_id}'
            app.logger.info(f"Fetching data from: {url}")
            
            response = session.get(
                url, 
                headers=headers, 
                timeout=30,
                verify=certifi.where()
            )
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            app.logger.error(f"Attempt {attempt + 1} failed: {str(e)}")
            if attempt == MAX_RETRIES - 1:
                raise
            time.sleep(RETRY_DELAY)

@app.route('/api/merchants/global')
def get_global_merchants():
    try:
        app.logger.info("Fetching global merchants data")
        results = {}
        
        for merchant in app.config['GLOBAL_MERCHANTS']:
            try:
                results[merchant['name']] = fetch_merchant_data(
                    merchant['account_id'],
                    merchant['account_id']
                )
            except Exception as e:
                app.logger.error(f"Error fetching {merchant['name']}: {str(e)}")
                results[merchant['name']] = {'error': str(e)}
        
        return jsonify(results)
            
    except Exception as e:
        app.logger.error(f"Global merchants error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/merchants/europe')
def get_merchant_status():
    try:
        service = build('content', 'v2.1', credentials=credentials)
        account_statuses = {}
        
        # Define merchants with their IDs and country codes
        merchants = {
            'ECCO DE': {'merchantId': '117076029', 'country': 'DE'},
            'ECCO GB': {'merchantId': '115079344', 'country': 'GB'},
            'ECCO FR': {'merchantId': '115975194', 'country': 'FR'}
        }

        # Get the full status list once using the main account ID
        status_list = service.accountstatuses().list(
            merchantId='117117533'
        ).execute()

        # Process each merchant
        for merchant_name, info in merchants.items():
            # Find the matching status for this merchant
            merchant_status = None
            for status in status_list.get('resources', []):
                if str(status.get('accountId')) == str(info['merchantId']):
                    merchant_status = status
                    break

            if merchant_status:
                shopping_data = {
                    'products': [
                        product for product in merchant_status.get('products', [])
                        if (product.get('country') == info['country'] and 
                            product.get('destination') == 'Shopping' and 
                            product.get('channel') == 'online')
                    ]
                }
            else:
                shopping_data = {'products': []}
            
            account_statuses[merchant_name] = shopping_data

        return jsonify({"ECCO EU": account_statuses})
    except Exception as e:
        app.logger.error(f"Error getting account status: {str(e)}")
        return jsonify({'error': str(e)}), 500

def cleanup():
    session.close()

atexit.register(cleanup)

# Serve frontend files
@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../frontend', path)

if __name__ == '__main__':
    port = int(environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)