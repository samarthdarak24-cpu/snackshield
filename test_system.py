import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import requests
import json
import time

API_URL = "http://127.0.0.1:5001"

def test_flow():
    print("--- [Audit] SnackShield System Audit ---")
    
    # 1. Login
    print("\n1. Testing Login (admin/admin123)...")
    login_data = {"username": "admin", "password": "admin123"}
    try:
        print("Sending POST request to /auth/login...")
        r = requests.post(f"{API_URL}/auth/login", json=login_data, timeout=10)
        print(f"DEBUG: Status {r.status_code}")
        print(f"Raw Response Content: {r.text[:100]}")
        if r.status_code == 200:
            token = r.json()['token']
            print(f"OK: Login Success! Token: {token[:20]}...")
        else:
            print(f"FAIL: Login Failed: {r.status_code}")
            return
    except Exception as e:
        print(f"FAIL: Error Caught: {type(e).__name__}: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Add Company
    print("\n2. Testing Add Company...")
    comp_data = {
        "company_name": "Audit Snack Co",
        "license_number": f"LIC-{int(time.time())}",
        "factory_code": "AUD"
    }
    r = requests.post(f"{API_URL}/api/companies", json=comp_data, headers=headers)
    print(f"{'OK' if r.status_code == 201 else 'FAIL'} Add Company Status: {r.status_code}")
    
    # Get Company ID
    r = requests.get(f"{API_URL}/api/companies", headers=headers)
    companies = r.json()
    audit_comp = next(c for c in companies if c['name'] == "Audit Snack Co")
    comp_id = audit_comp['id']
    print(f"OK: Found Company ID: {comp_id}")

    # 3. Add Product
    print("\n3. Testing Product Registration...")
    prod_data = {
        "company_id": comp_id,
        "product_name": "Audit Chips",
        "batch_number": "BATCH-00x",
        "mfg_date": "2024-01-01",
        "exp_date": "2025-01-01"
    }
    r = requests.post(f"{API_URL}/api/products", json=prod_data, headers=headers)
    if r.status_code == 201:
        pid = r.json()['product_id']
        print(f"OK: Product Registered! ID: {pid}")
    else:
        print(f"FAIL: Product Reg Failed: {r.text}")
        return

    # 4. Verify Product (Genuine)
    print("\n4. Testing Verification (Genuine)...")
    r = requests.post(f"{API_URL}/api/verify", json={"product_id": pid, "location": "Audit Lab"})
    print(f"Result: {r.json()['message']}")
    if "Genuine" in r.json()['message']:
        print("OK: Correctly identified as Genuine.")
    else:
        print(f"FAIL: Ident Failed: {r.json()['message']}")

    # 5. Verify Fake
    print("\n5. Testing Verification (Fake)...")
    r = requests.post(f"{API_URL}/api/verify", json={"product_id": "FAKE-ID-999", "location": "Audit Lab"})
    print(f"Result: {r.json()['message']}")
    if "Fake" in r.json()['message']:
        print("OK: Correctly identified as Fake.")

    # 6. Check Dashboard Stats
    print("\n6. Testing Dashboard Stats...")
    r = requests.get(f"{API_URL}/api/stats", headers=headers)
    stats = r.json()
    print(f"OK: Stats: {stats}")
    print("\n--- Audit Complete ---")

if __name__ == "__main__":
    test_flow()
