import os
import base64
from requests import post
import json
import sys

client_id = os.getenv('VITE_SPOTIFY_CLIENT_ID')
client_secret = os.getenv('VITE_SPOTIFY_CLIENT_SECRET')

def get_token():
    if not client_id or not client_secret:
        sys.stderr.write("Missing VITE_SPOTIFY_CLIENT_ID or VITE_SPOTIFY_CLIENT_SECRET environment variables")
        return None
    
    url = "https://accounts.spotify.com/api/token"
    auth_string = f"{client_id}:{client_secret}"
    auth_bytes = auth_string.encode('utf-8')
    auth_base64 = base64.b64encode(auth_bytes).decode('utf-8')
    
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    response = post(url, headers=headers, data=data)
    response.raise_for_status()
    
    json_response = response.json()
    return json_response.get("access_token")

try:
    token = get_token()
    if token:
        print(token)  # Ensures only the token is printed on successful retrieval
except Exception as e:
    sys.stderr.write(f"Error retrieving Spotify token: {str(e)}")