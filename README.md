# GMC-ECCO-Dashboard

## Setup Instructions

1. Clone the repository
2. Set up Google Cloud credentials:
   - Create service_account.json in backend/config/
   - Create client_secrets.json in backend/
3. Install dependencies:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
4. Run the application:
   - Start backend: `python app.py`
   - Open frontend/index.html in browser

Note: Credential files are not included for security reasons.
