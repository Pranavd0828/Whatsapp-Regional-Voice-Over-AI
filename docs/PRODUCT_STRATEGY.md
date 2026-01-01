# Product Strategy

## What we are doing

We are developing a **"Code-Switching Audio Engine" for WhatsApp** that serves as an intelligent companion for drivers. This product is not a standalone navigation app; rather, it is a specialized **Voice Integration** designed to work seamlessly within the **Apple CarPlay and Android Auto** ecosystems.

It solves a specific gap: standard voice assistants (Siri/Google Assistant) struggle with mixed-language (Hinglish) messages. Our solution overlays a high-fidelity, region-aware audio layer onto the existing WhatsApp experience, allowing users to listen to and interact with messages in their native accent while keeping their navigation (Google Maps/Apple Maps) active in the background.

## How we are executing this

We have implemented a hybrid AI architecture to achieve the highest possible audio fidelity. Incoming messages are first analyzed by Google Gemini to detect the specific dialect and handle complex transliterations, such as keeping English words like "Done" in Latin script to ensure correct pronunciation. Based on this analysis, the system routes the request to the optimal engine: ElevenLabs for pure English content and Cartesia AI for Hindi or mixed-language content. This backend is paired with a Next.js frontend that mimics the Apple CarPlay aesthetic, providing large touch targets and a streamlined notification flow for safe in-car use.

## Why we are doing this

Current Text-to-Speech solutions often fail to capture the nuance of daily Indian communication. Hearing a robotic, westernized voice try to pronounce Hindi phrases or "Hinglish" slang sounds unnatural and creates a disconnect for the user. By using region-specific AI voices, we restore the emotional context and authenticity of the message. Furthermore, reading text messages while driving is a major safety hazard. Our hands-free, audio-first interface solves this problem by allowing users to stay connected without compromising their safety or the safety of others on the road.

## Why now should we be doing this

Voice AI technology has finally matured to the point where latency is low enough for real-time conversation and quality is high enough to be indistinguishable from human speech. New models like Cartesia Sonic offer speed and accent capability that simply did not exist a year ago. As adoption of digital tools explodes across India's Tier 2 and Tier 3 cities, there is an urgent demand for interfaces that respect local linguistic diversity. If we do not address this need for vernacular voice computing now, we miss the opportunity to define the standard for how billions of non-native English speakers interact with technology.
