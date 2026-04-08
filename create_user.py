import requests
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

url = f"{os.getenv('APPWRITE_ENDPOINT')}/users"
headers = {
    'X-Appwrite-Project': os.getenv('APPWRITE_PROJECT_ID'),
    'X-Appwrite-Key': os.getenv('APPWRITE_API_KEY'),
    'Content-Type': 'application/json'
}

data = {
    'userId': 'unique_admin_id',
    'email': 'admin@smartbuy.ai',
    'password': 'SmartBuy@2026',
    'name': 'Project Owner'
}

print(f"Connecting to {url}...")
try:
    r = requests.post(url, headers=headers, json=data)
    if r.status_code == 201:
        print("✅ SUCCESS: Account created!")
    else:
        print(f"❌ FAILED: {r.status_code}")
        print(r.text)
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
