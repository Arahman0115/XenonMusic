import os
import base64
from requests import post
import json
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
env_path = Path(__file__).resolve().parents[1] / 'vite-project' / '.env'

# Load environment variables from .env file
load_dotenv(dotenv_path=env_path)

client_id = os.getenv('VITE_SPOTIFY_CLIENT_ID')
client_secret = os.getenv('VITE_SPOTIFY_CLIENT_SECRET')

def get_token():
    if not client_id or not client_secret:
        raise ValueError("Missing VITE_SPOTIFY_CLIENT_ID or VITE_SPOTIFY_CLIENT_SECRET environment variables")
    
    url = "https://accounts.spotify.com/api/token"
    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode('utf-8')
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")
    
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    response = post(url, headers=headers, data=data)
    response.raise_for_status()
    
    json_response = response.json()
    token = json_response.get("access_token")
    return token

def update_env_file(token):
    with open(env_path, 'r') as file:
        lines = file.readlines()
    
    with open(env_path, 'w') as file:
        token_updated = False
        for line in lines:
            if line.startswith('VITE_SPOTIFY_TOKEN='):
                file.write(f'VITE_SPOTIFY_TOKEN={token}\n')
                token_updated = True
            else:
                file.write(line)
        
        if not token_updated:
            file.write(f'\nVITE_SPOTIFY_TOKEN={token}\n')
            print('Token updated in .env file')

try:
    token = get_token()
    update_env_file(token)
    print(f"Spotify token retrieved and updated successfully: {token}")
except Exception as e:
    print(f"Error retrieving Spotify token: {str(e)}")