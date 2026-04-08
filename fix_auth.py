import requests
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

# Note: The 'projects' API is only reachable if the key has projects.write
# Or we can check and see if we can just create a session!
endpoint = os.getenv('APPWRITE_ENDPOINT')
pj_id = os.getenv('APPWRITE_PROJECT_ID')
api_key = os.getenv('APPWRITE_API_KEY')

# We'll try to enable password auth via project patch
url = f"{endpoint}/projects/{pj_id}/auth/password"
headers = {
    'X-Appwrite-Project': pj_id,
    'X-Appwrite-Key': api_key,
    'Content-Type': 'application/json'
}

print(f"Enabling Email/Password Auth for {pj_id}...")
try:
    r = requests.patch(url, headers=headers, json={'enabled': True})
    if r.status_code == 200:
        print("✅ SUCCESS: Email/Password Auth is now ENABLED!")
    else:
        print(f"❌ FAILED: {r.status_code}")
        print(r.text)
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
