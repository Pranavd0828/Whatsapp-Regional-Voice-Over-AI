import OpenAI from 'openai';

export class IntelligenceService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async analyzeText(text: string): Promise<any> {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a linguistic expert specialized in code-switching analysis for Indian languages. 
            Analyze the input text and extract the following metadata in strict JSON format:
            - language: The primary language (e.g., Hindi, Malayalam, Tamil).
            - script: The script used (e.g., Romanized, Devanagari).
            - dialect: Specific dialect or accent cues (e.g., Bombay Hindi, Delhi Casual, Kerala Malayalam).
            - sentiment: The emotional tone.
            - original_text: The input text.
            - phonemes: (Optional) Phonetic approximation if useful for TTS.
            
            Example Input: "Kaha ja raha hai?"
            Example Output: {"language": "Hindi", "script": "Romanized", "dialect": "Delhi Casual", "sentiment": "Curious", "original_text": "Kaha ja raha hai?"}`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0].message.content;
            return content ? JSON.parse(content) : null;
        } catch (error) {
            console.error("Error in Intelligence Service:", error);
            throw error;
        }
    }
}
