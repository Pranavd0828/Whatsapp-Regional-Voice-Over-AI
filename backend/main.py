import os
import io
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Smart Audio Backend (Gemini + ElevenLabs) is running"}

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in .env")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Initialize ElevenLabs
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

class AudioRequest(BaseModel):
    text: str
    sender: str

# SENDER_VOICE_MAP: Maps specific characters to distinct VOICES (VERIFIED IDs)
# User Provided Native Indian Web/Voice Lab IDs
SENDER_VOICE_MAP = {
    # Men (Hindi/Regional)
    "Rahul": "k7nOSUCadIEwB6fdJmbw",   # User ID 1
    "You": "Uyx98Ek4uMNmWN7E28CD",     # User ID 3 (Default You)

    # Women (English/Regional)
    "Sneha": "1qEiC6qsybMkmnNdVMbK",   # User ID 1 (Female)
}

@app.post("/generate-audio")
async def generate_audio(request: AudioRequest):
    """
    1. Detect dialect AND Transliterate using Google Gemini.
    2. Generate Audio using ElevenLabs (Multilingual v2) with Sender-Specific Voice.
    """
    text = request.text
    sender = request.sender
    print(f"Received text from {sender}: {text}")

    # 1. Detect Dialect & Transliterate via Gemini
    try:
        response = model.generate_content(
            f"""
            You are a linguistic expert specializing in Indian languages.
            
            1. Identify the language/dialect of this text: "{text}"
            2. Transliterate the text into its NATIVE SCRIPT (e.g., Hindi -> Devanagari).
            
            CRITICAL RULE FOR PRONUNCIATION:
            For English words mixed in the sentence (like 'done', 'scene', 'late'), TRANSLITERATE THEM PHONETICALLY into the native script.
            
            SPECIFIC OVERRIDES:
            - "Done" -> "डन" (Short 'a' sound, NOT 'दून' or 'डोन')
            - "Scene" -> "सीन"
            - "Project" -> "प्रोजेक्ट"
            
            Example: "Sahi hai, done karte hain." -> "सही है, डन करते हैं।"
            Example: "Main late ho gaya." -> "मैं लेट हो गया।"
            
            Return the result in strict JSON format:
            {{
                "dialect": "one of [hindi, marathi, gujarati, tamil, telugu, malayalam, punjabi, bengali, kannada, english]",
                "native_text": "the fully transliterated text"
            }}
            """
        )
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        import json
        data = json.loads(clean_text)
        
        detected_dialect = data.get("dialect", "english").lower()
        native_text = data.get("native_text", text)
        print(f"Detected: {detected_dialect}, Native Script: {native_text}")
             
    except Exception as e:
        print(f"Error in dialect detection/transliteration: {e}")
        detected_dialect = "english"
        native_text = text

    # 2. Select Voice ID based on SENDER (Gender/Character specific)
    # Using specific sender map, falling back to a default male voice if unknown
    voice_id = SENDER_VOICE_MAP.get(sender, "JBFqnCBsd6RMkjVDRZzb")
    print(f"Using Voice ID: {voice_id} for Sender: {sender}")

    # 3. Generate Audio via ElevenLabs
    try:
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
        }
        data = {
            "text": native_text,  # CRITICAL: Sending native script forces authentic accent
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        
        eleven_response = requests.post(url, json=data, headers=headers)
        
        if eleven_response.status_code != 200:
             print(f"ElevenLabs Error: {eleven_response.text}")
             raise HTTPException(status_code=500, detail="ElevenLabs Generation Failed")

        return StreamingResponse(io.BytesIO(eleven_response.content), media_type="audio/mpeg")

    except Exception as e:
         print(f"Error in TTS: {e}")
         raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
