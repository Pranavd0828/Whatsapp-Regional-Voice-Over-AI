import twilio from 'twilio';
import { IntelligenceService } from './intelligence.service';
import { AudioService } from './audio.service';
import fs from 'fs';
import path from 'path';

export class WhatsappService {
    private client: twilio.Twilio;
    private intelligenceService: IntelligenceService;
    private audioService: AudioService;
    private publicUrl: string; // URL where this server is exposed (ngrok)

    constructor() {
        this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        this.intelligenceService = new IntelligenceService();
        this.audioService = new AudioService();
        this.publicUrl = process.env.PUBLIC_URL || 'http://localhost:3000';
    }

    async handleIncomingMessage(req: any, res: any) {
        // 1. Acknowledge the webhook immediately to avoid timeout
        res.status(200).send('<Response></Response>');

        const initialMessage = req.body;
        const bodyText = initialMessage.Body;
        const sender = initialMessage.From; // "whatsapp:+1234567890"

        if (!bodyText) return;

        console.log(`Received message from ${sender}: ${bodyText}`);

        try {
            // 2. Intelligence Layer
            console.log('Analyzing text...');
            const metadata = await this.intelligenceService.analyzeText(bodyText);
            console.log('Metadata:', metadata);

            if (!metadata) {
                console.error("Failed to analyze text");
                return;
            }

            // 3. Audio Layer
            console.log('Generating audio...');
            const audioBuffer = await this.audioService.generateAudio(bodyText, metadata);

            // Save audio to a public static folder so Twilio can access it
            // In production, upload to S3/Cloud Storage. For MVP, local static file.
            const fileName = `audio_${Date.now()}.mp3`;
            const publicDir = path.join(process.cwd(), 'public');
            if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir);
            }
            fs.writeFileSync(path.join(publicDir, fileName), audioBuffer);
            const mediaUrl = `${this.publicUrl}/static/${fileName}`;

            // 4. Delivery Layer
            console.log('Sending audio response...');
            await this.client.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER, // "whatsapp:+14155238886"
                to: sender,
                mediaUrl: [mediaUrl]
            });

            console.log('Audio sent successfully!');

        } catch (error) {
            console.error('Error processing message:', error);
            // Optional: Send text error message back to user
        }
    }
}
