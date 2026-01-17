import firebase_admin
from firebase_admin import credentials, firestore
import os

SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

SIGNALS_COLLECTION = 'signals'
ZONES_COLLECTION = 'zones'
USERS_COLLECTION = 'users'
NOTIFICATIONS_COLLECTION = 'notifications'
