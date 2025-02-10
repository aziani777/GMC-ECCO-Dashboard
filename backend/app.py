from flask import Flask, jsonify
from flask_cors import CORS
from google.oauth2 import service_account
from googleapiclient.discovery import build
import os
import json

app = Flask(__name__)
CORS(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

GLOBAL_MERCHANTS = [
    {'merchant_id': '6000402', 'name': 'ECCO US'},    # US
    {'merchant_id': '126580264', 'name': 'ECCO CA'},  # CA
    {'merchant_id': '124463984', 'name': 'ECCO AU'}   # AU
]

EUROPE_MERCHANTS = [
    {'merchant_id': '115079344', 'name': 'ECCO GB'},
    {'merchant_id': '115975194', 'name': 'ECCO FR'},
    {'merchant_id': '117076029', 'name': 'ECCO DE'}
]

def initialize_content_api():
    try:
        credentials_info = json.loads(os.getenv('SERVICE_ACCOUNT_JSON'))
        credentials = service_account.Credentials.from_service_account_info(
            credentials_info,
            scopes=['https://www.googleapis.com/auth/content']
        )
        return build('content', 'v2.1', credentials=credentials)
    except Exception as e:
        app.logger.error(f"Error initializing Content API: {str(e)}")
        raise

def get_global_merchant_status(service, merchant):
    try:
        # Direct API call to get account status
        status = service.accountstatuses().get(
            merchantId=merchant['merchant_id'],
            accountId=merchant['merchant_id']  # Same as merchantId for global
        ).execute()
        
        return {
            'name': merchant['name'],
            'data': status
        }
    except Exception as e:
        app.logger.error(f"Error getting status for {merchant['name']}: {str(e)}")
        return {
            'name': merchant['name'],
            'error': str(e)
        }

def get_europe_merchant_statuses(service):
    try:
        # Get all statuses for MCA account
        response = service.accountstatuses().list(
            merchantId='117117533'  # MCA account ID
        ).execute()
        
        merchant_data = []
        resources = response.get('resources', [])
        
        # Filter and map responses to specific merchants
        for merchant in EUROPE_MERCHANTS:
            merchant_status = next(
                (status for status in resources if status.get('accountId') == merchant['merchant_id']),
                None
            )
            
            if merchant_status:
                merchant_data.append({
                    'name': merchant['name'],
                    'data': merchant_status
                })
            else:
                merchant_data.append({
                    'name': merchant['name'],
                    'error': 'Status not found'
                })
        
        return merchant_data
    except Exception as e:
        app.logger.error(f"Error getting Europe merchant statuses: {str(e)}")
        raise

@app.route('/api/merchants/<region>')
def get_merchants(region):
    try:
        service = initialize_content_api()
        
        if region == 'global':
            merchant_data = []
            for merchant in GLOBAL_MERCHANTS:
                status = get_global_merchant_status(service, merchant)
                merchant_data.append(status)
            
            return jsonify({
                "ECCO GLOBAL": {
                    "name": "ECCO GLOBAL",
                    "data": merchant_data
                }
            })
        elif region == 'europe':
            merchant_data = get_europe_merchant_statuses(service)
            return jsonify({
                "ECCO EUROPE": {
                    "name": "ECCO EUROPE",
                    "data": merchant_data
                }
            })
        else:
            return jsonify({"error": "Invalid region"}), 400
            
    except Exception as e:
        app.logger.error(f"Server error in get_merchants: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)