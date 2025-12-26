# WhatsApp Regional Voice Over AI

This project is a React-based WhatsApp clone that features a "Smart Audio Playback" system. It allows users to listen to chat messages in their native regional dialects (e.g., Hindi, Punjabi) with authentic accents.

## Features

- **Frontend**: Next.js 14 application making use of Tailwind CSS for a WhatsApp Web look and feel.
- **Backend**: FastAPI (Python) server handling text processing and audio generation.
- **AI Intelligence**: Uses Google Gemini to detect dialects and transliterate authentic scripts.
- **Text to Speech**: Uses ElevenLabs with specific Voice IDs for high-fidelity Indian accents.

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- An ElevenLabs API Key
- A Google Gemini API Key

## Setup Instructions

### 1. Backend Setup

The backend handles the AI logic.

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   Open `backend/.env` (create it if missing) and add your keys:
   ```
   GEMINI_API_KEY=your_gemini_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_key_here
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8001
   ```
   The API will be available at `http://localhost:8001`.

### 2. Frontend Setup

The frontend provides the chat interface.

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:3000`.

## Usage

1. Start both the backend and frontend servers.
2. Open the web interface.
3. Click the **Play Icon** next to any message (e.g., Rahul's message).
4. The system will detect the language, generate audio, and play it back with the correct accent.

## Project Structure

- **backend/**: Contains the Python FastAPI server and AI logic.
- **frontend/**: Contains the Next.js application and UI components.
