# WhatsApp Integration Roadmap (Official Business API)

This document outlines the architecture required to move from the current **Browser Prototype** to a live **WhatsApp Bot**.

## Architecture Overview
Instead of a React frontend, the "User Interface" becomes the WhatsApp Mobile App. Your FastAPI backend will serve as a **Webhook Handler** for Meta.

### 1. Prerequisites
-   **Meta Business Account**: Required to access the WhatsApp Business API.
-   **Phone Number**: A specific phone number dedicated to the bot (cannot be your personal active number).
-   **Hosting**: The FastAPI backend must be deployed publicly (e.g., AWS, Railway, DigitalOcean) with HTTPS (required for Webhooks).

### 2. Technical Flow

#### Step A: Inbound Message (User -> Bot)
1.  User sends a text or voice note to your Bot Number.
2.  Meta hits your Webhook URL: `POST https://your-api.com/webhooks/whatsapp`.
3.  **FastAPI**:
    -   Validates the request signature (security).
    -   Extracts the user's text (or transcribes audio using something like OpenAI Whisper).

#### Step B: Processing (Your Current Logic)
1.  **Dialect Detection**: Pass text to Gemini (Same as current `main.py`).
2.  **Audio Generation**:
    -   If English -> ElevenLabs.
    -   If Hindi/Mix -> Cartesia.
3.  **Audio Storage**: The generated MP3 must be uploaded to a temporary URL or Meta's Media Endpoint to get a `media_id`.

#### Step C: Outbound Reply (Bot -> User)
1.  **FastAPI**: Calls Meta Graph API (`POST /messages`).
2.  Payload includes the `media_id` of the generated audio.
3.  User receives a **Voice Note** in WhatsApp.

## Recommended Tech Stack Update

### Middleware (Optional but Recommended)
**Twilio for WhatsApp**:
-   **Pros**: Much easier API than raw Meta Graph API; handles media hosting/formatting for you.
-   **Cons**: Slight extra cost per message.
-   **Why**: Getting a raw Meta app approved can be tedious. Twilio Sandbox lets you test immediately.

### Code Adjustments Needed
1.  **New Endpoint**: `/webhook` (GET for verification, POST for messages).
2.  **Audio Hosting**: We can't stream bytes directly to WhatsApp. We need to save the file (S3 or temporary local storage) -> Send URL to Twilio/Meta -> Delete file.

## "No-Code" Alternatives
-   **n8n / Zapier**: You can use n8n to catch the WhatsApp webhook, send the text to your FastAPI agent, get the audio back, and send it to WhatsApp. This minimizes coding the boilerplate webhook logic.
