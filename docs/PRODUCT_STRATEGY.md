# Product Strategy

## What we are doing

We are developing a "Code-Switching Audio Engine" for WhatsApp that intelligently reads messages aloud in the sender's native accent and language. This system autonomously switches between a premium English voice and a native Indian accent depending on whether the text is in English, Hindi, or a mix of both (Hinglish). Additionally, we are introducing a "CarPlay Mode" prototype, a distraction-free vehicle interface that allows drivers to listen to and navigate through their message queue without taking their eyes off the road.

## How we are executing this

We have implemented a hybrid AI architecture to achieve the highest possible audio fidelity. Incoming messages are first analyzed by Google Gemini to detect the specific dialect and handle complex transliterations, such as keeping English words like "Done" in Latin script to ensure correct pronunciation. Based on this analysis, the system routes the request to the optimal engine: ElevenLabs for pure English content and Cartesia AI for Hindi or mixed-language content. This backend is paired with a Next.js frontend that mimics the Apple CarPlay aesthetic, providing large touch targets and a streamlined notification flow for safe in-car use.

## Why we are doing this

Current Text-to-Speech solutions often fail to capture the nuance of daily Indian communication. Hearing a robotic, westernized voice try to pronounce Hindi phrases or "Hinglish" slang sounds unnatural and creates a disconnect for the user. By using region-specific AI voices, we restore the emotional context and authenticity of the message. Furthermore, reading text messages while driving is a major safety hazard. Our hands-free, audio-first interface solves this problem by allowing users to stay connected without compromising their safety or the safety of others on the road.

## Why now should we be doing this

Voice AI technology has finally matured to the point where latency is low enough for real-time conversation and quality is high enough to be indistinguishable from human speech. New models like Cartesia Sonic offer speed and accent capability that simply did not exist a year ago. As adoption of digital tools explodes across India's Tier 2 and Tier 3 cities, there is an urgent demand for interfaces that respect local linguistic diversity. If we do not address this need for vernacular voice computing now, we miss the opportunity to define the standard for how billions of non-native English speakers interact with technology.
