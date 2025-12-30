from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import os
import io
import json
import requests
from dotenv import load_dotenv

# ---------------------------------------------------------
# 1. SETUP & CONFIGURATION
# ---------------------------------------------------------
load_dotenv()

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CARTESIA_API_KEY = os.getenv("CARTESIA_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

# Initialize Cartesia
from cartesia import Cartesia
client = Cartesia(api_key=CARTESIA_API_KEY)

# Initialize Gemini
try:
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
except ImportError:
    print("Gemini SDK not found or configured correctly.")
    model = None

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# 2. VOICE MAPPING
# ---------------------------------------------------------
# Cartesia (Indian/Hinglish)
CARTESIA_VOICE_MAP = {
    "Rahul": "791d5162-d5eb-40f0-8189-f19db44611d8",   # Ayush (Male)
    "You": "791d5162-d5eb-40f0-8189-f19db44611d8",     # Ayush (Male)
    "Sneha": "9cebb910-d4b7-4a4a-85a4-12c79137724c",   # Aarti (Female)
}

# ElevenLabs (English Only) - Fallback/Premium English
ELEVENLABS_VOICE_MAP = {
    "Rahul": "k7nOSUCadIEwB6fdJmbw",   # User ID 1 (Male)
    "You": "Uyx98Ek4uMNmWN7E28CD",     # User ID 3 
    "Sneha": "1qEiC6qsybMkmnNdVMbK",   # User ID 1 (Female)
}

class AudioRequest(BaseModel):
    text: str
    sender: str

# ---------------------------------------------------------
# 3. HELPER FUNCTIONS
# ---------------------------------------------------------

async def generate_elevenlabs_audio(text: str, sender: str):
    """
    Generates audio using ElevenLabs (Best for Pure English)
    """
    voice_id = ELEVENLABS_VOICE_MAP.get(sender, "JBFqnCBsd6RMkjVDRZzb")
    print(f"Routing to ElevenLabs | Voice: {voice_id} | Text: {text}")
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
    }
    
    response = requests.post(url, json=data, headers=headers)
    if response.status_code != 200:
        raise Exception(f"ElevenLabs Error: {response.text}")
        
    return StreamingResponse(io.BytesIO(response.content), media_type="audio/mpeg")

async def generate_cartesia_audio(text: str, sender: str):
    """
    Generates audio using Cartesia Sonic (Best for Hindi/Hinglish/Code-Switching)
    """
    voice_id = CARTESIA_VOICE_MAP.get(sender, "791d5162-d5eb-40f0-8189-f19db44611d8")
    print(f"Routing to Cartesia | Voice: {voice_id} | Text: {text}")
    
    audio_generator = client.tts.bytes(
        model_id="sonic-multilingual",
        transcript=text,
        voice={"mode": "id", "id": voice_id},
        output_format={"container": "mp3", "bit_rate": 128000, "sample_rate": 44100},
    )
    return StreamingResponse(audio_generator, media_type="audio/mpeg")

# ---------------------------------------------------------
# 4. MAIN ENDPOINT
# ---------------------------------------------------------

@app.post("/generate-audio")
async def generate_audio(request: AudioRequest):
    text = request.text
    sender = request.sender
    print(f"Received text from {sender}: {text}")

    # 1. Detect Dialect & Transliterate via Gemini
    native_text = text
    detected_dialect = "english" # Default
    
    try:
        if model:
            response = model.generate_content(
                f"""
                You are a linguistic expert specializing in Indian languages.
                
                1. Identify the language/dialect of this text: "{text}"
                2. Transliterate Hindi/Indic text into its NATIVE SCRIPT (Devanagari).
                
                CRITICAL RULE FOR PRONUNCIATION (CODE-SWITCHING):
                - If a word is English (e.g., 'Done', 'Scene', 'Late', 'Bro'), KEEP IT IN LATIN SCRIPT.
                - Do NOT transliterate English words to Devanagari.
                - Only transliterate the Hindi words.
                
                Example: "Sahi hai, done karte hain." -> "सही है, Done करते हैं।"
                Example: "Main late ho gaya." -> "मैं Late हो गया।"
                
                Return JSON:
                {{
                    "dialect": "hindi or english or hinglish",
                    "native_text": "the mixed script text"
                }}
                """
            )
            cleaned = response.text.replace('```json', '').replace('```', '')
            data = json.loads(cleaned)
            native_text = data.get("native_text", text)
            detected_dialect = data.get("dialect", "english").lower()
            print(f"Gemini: {data}")
    except Exception as e:
        print(f"Gemini Error: {e}")

    # 2. Hybrid Routing Logic
    try:
        # If pure English or explicitly English -> ElevenLabs
        if detected_dialect == 'english':
             return await generate_elevenlabs_audio(native_text, sender)
        else:
             # Hindi, Hinglish, or Mixed -> Cartesia
             return await generate_cartesia_audio(native_text, sender)

    except Exception as e:
        print(f"Audio Gen Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
