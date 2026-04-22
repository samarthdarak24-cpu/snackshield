import requests
import time

API_URL = "http://127.0.0.1:5001"
print("--- SnackShield System Verification ---")

def run_audit():
    # 1. Login
    print("Step 1: Login...")
    r = requests.post(f"{API_URL}/auth/login", json={"username":"admin","password":"admin123"})
    if r.status_code != 200:
        print(f"FAILED: {r.text}")
        return
    token = r.json()['token']
    headers = {"Authorization": f"Bearer {token}"}
    print("OK: Logged in.")

    # 2. Add Company
    print("\nStep 2: Add Company...")
    comp_code = f"AUD{int(time.time() % 1000)}"
    r = requests.post(f"{API_URL}/api/companies", json={
        "company_name": "Audit Snack Co",
        "license_number": f"LIC-{int(time.time())}",
        "factory_code": comp_code
    }, headers=headers)
    if r.status_code != 201:
        print(f"FAILED: {r.text}")
        return
    print(f"OK: Company {comp_code} added.")

    # 3. Get Company ID
    r = requests.get(f"{API_URL}/api/companies", headers=headers)
    companies = r.json()
    comp_id = companies[-1]['id']
    print(f"OK: Using Company ID {comp_id}")

    # 4. Add Product
    print("\nStep 3: Register Product...")
    r = requests.post(f"{API_URL}/api/products", json={
        "company_id": comp_id,
        "product_name": "Audit Chips",
        "batch_number": "B001",
        "mfg_date": "2024-01-01",
        "exp_date": "2025-01-01"
    }, headers=headers)
    if r.status_code != 201:
        print(f"FAILED: {r.text}")
        return
    pid = r.json()['product_id']
    print(f"OK: Product ID {pid} registered.")

    # 5. Verify Product
    print("\nStep 4: Verify Product (Genuine)...")
    r = requests.post(f"{API_URL}/api/verify", json={"product_id": pid, "location": "NYC"})
    res = r.json()
    print(f"Result: {res['message']}")
    if res['status'] == "Genuine":
        print("OK: Success.")
    else:
        print("FAILED: Wrong status.")

    # 6. Verify Fake
    print("\nStep 5: Verify Fake Product...")
    r = requests.post(f"{API_URL}/api/verify", json={"product_id": "FAKE-123", "location": "NYC"})
    res = r.json()
    print(f"Result: {res['message']}")
    if res['status'] == "Fake":
        print("OK: Success.")

    # 7. Analytics
    print("\nStep 6: Dashboard Stats...")
    r = requests.get(f"{API_URL}/api/stats", headers=headers)
    print(f"Stats: {r.json()}")
    print("\n--- Audit Finished Successfully ---")

if __name__ == "__main__":
    run_audit()
