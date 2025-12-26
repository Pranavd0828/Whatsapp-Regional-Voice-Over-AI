import axios from 'axios';

export class AudioService {
    private apiKey: string;
    private voiceMap: Record<string, string>;

    constructor() {
        this.apiKey = process.env.ELEVENLABS_API_KEY || '';
        // Map detected dialect/gender to specific Voice IDs
        // These are example Voice IDs - replace with actual ones from your ElevenLabs account
        this.voiceMap = {
            'male_north_indian': 'JBFqnCBsd6RMkjVDRZzb', // Example ID
            'female_south_indian': 'EXAVITQu4vr4xnSDxMaL', // Example ID
            'default': '21m00Tcm4TlvDq8ikWAM' // Rachel
        };
    }

    async generateAudio(text: string, metadata: any): Promise<Buffer> {
        try {
            // Logic to select voice based on metadata
            // e.g., if metadata.language == 'Hindi' && metadata.sentiment == 'Casual' -> select specific voice
            const voiceId = this.selectVoice(metadata);

            const response = await axios.post(
                `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                {
                    text: text,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                },
                {
                    headers: {
                        'xi-api-key': this.apiKey,
                        'Content-Type': 'application/json',
                        'Accept': 'audio/mpeg'
                    },
                    responseType: 'arraybuffer'
                }
            );

            return Buffer.from(response.data);
        } catch (error) {
            console.error("Error in Audio Service:", error);
            throw error;
        }
    }

    private selectVoice(metadata: any): string {
        // Simple logic for prototype
        // Expand this based on the specific voices available
        console.log("Selecting voice for:", metadata);
        return this.voiceMap['default'];
    }
}
