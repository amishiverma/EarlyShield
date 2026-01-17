from typing import List, Optional, Dict, Any
from firebase_config import db, SIGNALS_COLLECTION, ZONES_COLLECTION, USERS_COLLECTION, NOTIFICATIONS_COLLECTION
from models import Signal, Zone, Stats, User, Notification, Coordinates
from google.cloud.firestore_v1.base_query import FieldFilter

SEED_SIGNALS = [
    {
        'id': 's1',
        'title': 'Connectivity Outage: North Dorms',
        'category': 'IT Infrastructure',
        'location': 'North Dorms - Block A',
        'timestamp': '12m ago',
        'riskLevel': 'Critical',
        'description': 'Structural Infrastructure • 8 nodes affected. Students reporting total loss of connectivity.',
        'status': 'Open',
    },
    {
        'id': 's2',
        'title': 'Chemical Storage Variance',
        'category': 'Safety',
        'location': 'Science Dept',
        'timestamp': '45m ago',
        'riskLevel': 'Moderate',
        'description': 'Pressure sensor deviation in Lab 4. Maintenance team notified.',
        'status': 'Investigating',
    },
    {
        'id': 's3',
        'title': 'New SAP Intervention Request',
        'category': 'Administration',
        'location': 'Student Services',
        'timestamp': '2h ago',
        'riskLevel': 'Low',
        'description': 'Academic Distress Signal triggered by attendance logs.',
        'status': 'Open',
    },
]

SEED_ZONES = [
    {'id': 'z1', 'name': "SVKM's NMIMS", 'category': 'Safety', 'riskLevel': 'Critical', 'signalCount': 12, 'coordinates': {'x': 50, 'y': 50}, 'latLng': [19.1034, 72.8369], 'details': 'Zone A • Critical Priority'},
    {'id': 'z2', 'name': 'Narsee Monjee College', 'category': 'Facilities', 'riskLevel': 'Moderate', 'signalCount': 3, 'coordinates': {'x': 52, 'y': 48}, 'latLng': [19.1028, 72.8365], 'details': 'Zone B • HVAC Maintenance'},
    {'id': 'z3', 'name': 'Mithibai College', 'category': 'Safety', 'riskLevel': 'Stable', 'signalCount': 0, 'coordinates': {'x': 48, 'y': 52}, 'latLng': [19.1025, 72.8360], 'details': 'Zone C • All Clear'},
    {'id': 'z4', 'name': 'D. J. Sanghvi Engineering', 'category': 'IT', 'riskLevel': 'Critical', 'signalCount': 8, 'coordinates': {'x': 55, 'y': 45}, 'latLng': [19.1070, 72.8360], 'details': 'Zone D • Server Overheat'},
    {'id': 'z5', 'name': 'Usha Pravin Gandhi College', 'category': 'General', 'riskLevel': 'Stable', 'signalCount': 0, 'coordinates': {'x': 51, 'y': 51}, 'latLng': [19.1029, 72.8372], 'details': 'Zone E • Monitoring'},
    {'id': 'z6', 'name': 'Jitendra Chauhan Law College', 'category': 'Facilities', 'riskLevel': 'Stable', 'signalCount': 0, 'coordinates': {'x': 50, 'y': 53}, 'latLng': [19.1026, 72.8362], 'details': 'Zone F'},
    {'id': 'z7', 'name': 'Pravin Gandhi College of Law', 'category': 'IT', 'riskLevel': 'Moderate', 'signalCount': 2, 'coordinates': {'x': 49, 'y': 50}, 'latLng': [19.1030, 72.8375], 'details': 'Zone G • Network Slowdown'},
    {'id': 'z8', 'name': 'Bhagubhai Mafatlal Polytechnic', 'category': 'Facilities', 'riskLevel': 'Critical', 'signalCount': 5, 'coordinates': {'x': 45, 'y': 55}, 'latLng': [19.1045, 72.8355], 'details': 'Zone H • Power Fluctuation'},
    {'id': 'z9', 'name': 'Acharya A. V. Patel Jr College', 'category': 'General', 'riskLevel': 'Stable', 'signalCount': 0, 'coordinates': {'x': 47, 'y': 53}, 'latLng': [19.1038, 72.8368], 'details': 'Zone I'},
    {'id': 'z10', 'name': 'C. N. M. School', 'category': 'General', 'riskLevel': 'Stable', 'signalCount': 0, 'coordinates': {'x': 55, 'y': 47}, 'latLng': [19.1060, 72.8348], 'details': 'Zone J'},
    {'id': 'z11', 'name': 'Smt. Gokalibai High School', 'category': 'General', 'riskLevel': 'Stable', 'signalCount': 0, 'coordinates': {'x': 46, 'y': 50}, 'latLng': [19.1015, 72.8380], 'details': 'Zone K'},
]

SEED_USERS = {
    'Admin': {
        'name': "Elena R.",
        'role': "Senior Safety Officer",
        'avatar': "https://lh3.googleusercontent.com/aida-public/AB6AXuCDsquM8W_8wrc4mSLbXSGzX5Ol8iJZV3n7h3UIQoKQN0cvhsZtHPaO6EgSEKgK1AQL9Vi8Fmel7QH4GApvEQwRjNPbCW6vBxZArxuFfrqUt6UEQYOUHKwqwMJ7txroBdbflF0259u8ctVeFsXx_xN57yaKyWG9aTm0LWN-Js6LJtzh9WJTq18jWCryU6-L0vHzX1GVS2f15SaacTOaVoOVLUvOYWc200qDBqrTjce1HJkgCQ9cc9jdo6pEiEMcQnPoYLz0kqG1cBo",
        'email': "elena.r@earlyshield.edu",
        'department': "Campus Security & Risk",
        'idString': "CSR-2024-8842"
    },
    'Student': {
        'name': "Alex M.",
        'role': "Computer Science",
        'avatar': "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        'email': "alex.m@student.earlyshield.edu",
        'department': "Engineering",
        'idString': "S-2109923"
    },
    'Management': {
        'name': "Dr. Sarah J.",
        'role': "Dean of Student Affairs",
        'avatar': "https://api.dicebear.com/7.x/avataaars/svg?seed=Sorelle",
        'email': "sarah.j@earlyshield.edu",
        'department': "Administration",
        'idString': "ADM-004"
    },
}

SEED_NOTIFICATIONS = [
    {'id': 1, 'title': 'High Risk at DJ Sanghvi', 'time': '2m ago', 'read': False},
    {'id': 2, 'title': 'Network Restore: Library', 'time': '15m ago', 'read': False},
    {'id': 3, 'title': 'Shift Change Report Ready', 'time': '1h ago', 'read': True},
    {'id': 4, 'title': 'Maintenance Scheduled: Zone B', 'time': '3h ago', 'read': True},
]


def initialize_firestore():
    signals_ref = db.collection(SIGNALS_COLLECTION)
    if not list(signals_ref.limit(1).stream()):
        print("Seeding signals collection...")
        for signal in SEED_SIGNALS:
            signals_ref.document(signal['id']).set(signal)
    
    zones_ref = db.collection(ZONES_COLLECTION)
    if not list(zones_ref.limit(1).stream()):
        print("Seeding zones collection...")
        for zone in SEED_ZONES:
            zones_ref.document(zone['id']).set(zone)
    
    users_ref = db.collection(USERS_COLLECTION)
    if not list(users_ref.limit(1).stream()):
        print("Seeding users collection...")
        for user_type, user_data in SEED_USERS.items():
            users_ref.document(user_type).set(user_data)
    
    notifs_ref = db.collection(NOTIFICATIONS_COLLECTION)
    if not list(notifs_ref.limit(1).stream()):
        print("Seeding notifications collection...")
        for notif in SEED_NOTIFICATIONS:
            notifs_ref.document(str(notif['id'])).set(notif)
    
    print("Firestore initialization complete!")


def get_all_signals() -> List[Dict[str, Any]]:
    docs = db.collection(SIGNALS_COLLECTION).stream()
    return [doc.to_dict() for doc in docs]


def get_signal_by_id(signal_id: str) -> Optional[Dict[str, Any]]:
    doc = db.collection(SIGNALS_COLLECTION).document(signal_id).get()
    return doc.to_dict() if doc.exists else None


def create_signal(signal_data: Dict[str, Any]) -> Dict[str, Any]:
    signals = get_all_signals()
    max_id = max([int(s['id'][1:]) for s in signals], default=0)
    new_id = f's{max_id + 1}'
    
    signal_data['id'] = new_id
    db.collection(SIGNALS_COLLECTION).document(new_id).set(signal_data)
    return signal_data


def update_signal(signal_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    doc_ref = db.collection(SIGNALS_COLLECTION).document(signal_id)
    doc = doc_ref.get()
    if not doc.exists:
        return None
    doc_ref.update(updates)
    return doc_ref.get().to_dict()


def delete_signal(signal_id: str) -> bool:
    doc_ref = db.collection(SIGNALS_COLLECTION).document(signal_id)
    if not doc_ref.get().exists:
        return False
    doc_ref.delete()
    return True


def get_all_zones() -> List[Dict[str, Any]]:
    docs = db.collection(ZONES_COLLECTION).stream()
    return [doc.to_dict() for doc in docs]


def get_zone_by_id(zone_id: str) -> Optional[Dict[str, Any]]:
    doc = db.collection(ZONES_COLLECTION).document(zone_id).get()
    return doc.to_dict() if doc.exists else None


def update_zone(zone_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    doc_ref = db.collection(ZONES_COLLECTION).document(zone_id)
    doc = doc_ref.get()
    if not doc.exists:
        return None
    doc_ref.update(updates)
    return doc_ref.get().to_dict()


def get_user_by_type(user_type: str) -> Optional[Dict[str, Any]]:
    doc = db.collection(USERS_COLLECTION).document(user_type).get()
    return doc.to_dict() if doc.exists else None


def update_user(user_type: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    doc_ref = db.collection(USERS_COLLECTION).document(user_type)
    doc = doc_ref.get()
    if not doc.exists:
        return None
    doc_ref.update(updates)
    return doc_ref.get().to_dict()


def get_all_notifications() -> List[Dict[str, Any]]:
    docs = db.collection(NOTIFICATIONS_COLLECTION).stream()
    return [doc.to_dict() for doc in docs]


def get_notification_by_id(notification_id: int) -> Optional[Dict[str, Any]]:
    doc = db.collection(NOTIFICATIONS_COLLECTION).document(str(notification_id)).get()
    return doc.to_dict() if doc.exists else None


def update_notification(notification_id: int, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    doc_ref = db.collection(NOTIFICATIONS_COLLECTION).document(str(notification_id))
    doc = doc_ref.get()
    if not doc.exists:
        return None
    doc_ref.update(updates)
    return doc_ref.get().to_dict()


def create_notification(notif_data: Dict[str, Any]) -> Dict[str, Any]:
    notifications = get_all_notifications()
    max_id = max([n['id'] for n in notifications], default=0)
    new_id = max_id + 1
    
    notif_data['id'] = new_id
    db.collection(NOTIFICATIONS_COLLECTION).document(str(new_id)).set(notif_data)
    return notif_data


def mark_all_notifications_read() -> None:
    docs = db.collection(NOTIFICATIONS_COLLECTION).stream()
    for doc in docs:
        doc.reference.update({'read': True})


def get_stats() -> Dict[str, Any]:
    signals = get_all_signals()
    active_count = len([s for s in signals if s.get('status') != 'Resolved'])
    critical_count = len([s for s in signals if s.get('riskLevel') == 'Critical'])
    
    health = 100 - (active_count * 2) - (critical_count * 3)
    health = max(0, min(100, health))
    
    return {
        'healthScore': health,
        'activeSignals': active_count,
        'trend': [65, 70, 68, 75, 80, 85, health]
    }
