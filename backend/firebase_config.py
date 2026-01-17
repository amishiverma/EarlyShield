import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

if not firebase_admin._apps:
    # Try to get from environment variable first (for Render)
    firebase_creds_json = os.getenv('FIREBASE_CREDENTIALS')
    if firebase_creds_json:
        cred_dict = json.loads(firebase_creds_json)
        cred = credentials.Certificate(cred_dict)
    else:
        # Fall back to local file (for local development)
        SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    
    firebase_admin.initialize_app(cred)

db = firestore.client()

SIGNALS_COLLECTION = 'signals'
ZONES_COLLECTION = 'zones'
USERS_COLLECTION = 'users'
NOTIFICATIONS_COLLECTION = 'notifications'
