import os
import requests
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

url = "https://api.elevenlabs.io/v1/voices"

headers = {
  "Accept": "application/json",
  "xi-api-key": ELEVENLABS_API_KEY
}

response = requests.get(url, headers=headers)
voices = response.json().get('voices', [])

print(f"Found {len(voices)} voices.")
for voice in voices:
    name = voice.get('name')
    voice_id = voice.get('voice_id')
    labels = voice.get('labels', {})
    accent = labels.get('accent', 'N/A')
    description = labels.get('description', 'N/A')
    
    print(f"Name: {name} | ID: {voice_id} | Accent: {accent} | Desc: {description}")
