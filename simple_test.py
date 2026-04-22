import requests

print("START")
API_URL = "http://127.0.0.1:5001"
try:
    print(f"URL: {API_URL}/auth/login")
    r = requests.post(f"{API_URL}/auth/login", json={"username":"admin","password":"admin123"})
    print(f"STATUS: {r.status_code}")
    print(f"JSON: {r.json()}")
except Exception as e:
    print(f"ERROR: {e}")
