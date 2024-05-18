#spottoken.py
import os
import base64
from requests import post
import json
from dotenv import load_dotenv
load_dotenv()

client_id = os.getenv('VITE_SPOTIFY_CLIENT_ID')
client_secret = os.getenv('VITE_SPOTIFY_CLIENT_SECRET')

def get_token():
    url = "https://accounts.spotify.com/api/token"
    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode('utf-8')
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    results = post(url, headers=headers, data=data)
    json_results = json.loads(results.content)
    token = json_results["access_token"]
    return token

token = get_token()
print(token)