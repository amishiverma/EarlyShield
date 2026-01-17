"""
Script to clear existing zones from Firestore and reseed with updated data.
Run this once to update the zones to only include SVKM trust colleges.
"""
from firebase_config import db, ZONES_COLLECTION

# Updated SVKM Trust Colleges Only
NEW_ZONES = [
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

def clear_and_reseed_zones():
    """Delete all existing zones and add updated ones."""
    zones_ref = db.collection(ZONES_COLLECTION)
    
    # Step 1: Delete all existing zones
    print("Deleting existing zones...")
    docs = zones_ref.stream()
    deleted_count = 0
    for doc in docs:
        doc.reference.delete()
        deleted_count += 1
    print(f"Deleted {deleted_count} zones.")
    
    # Step 2: Add new zones
    print("Adding updated SVKM zones...")
    for zone in NEW_ZONES:
        zones_ref.document(zone['id']).set(zone)
        print(f"  Added: {zone['name']}")
    
    print(f"\n✅ Done! Added {len(NEW_ZONES)} SVKM trust colleges.")

if __name__ == "__main__":
    clear_and_reseed_zones()
