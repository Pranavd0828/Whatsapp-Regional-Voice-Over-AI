# Demo Architecture Decisions

## Why I used pre-recorded audio for the demo

### The Limitation of Static Hosting
I hosted this demo on GitHub Pages to provide a publicly accessible link. GitHub Pages is a static hosting service. This means it can only serve standard files like HTML, CSS, and images to the browser. It does not support running the Python server that my application uses to process text and detect languages.

### The Simulation Strategy
I bypassed this limitation by creating a simulation of the user experience. I ran the standard application locally on my machine to generate the audio for the specific demo messages. I then saved these audio files and bundled them with the frontend code. When a user interacts with the live demo, the site plays these pre-generated files. This creates the illusion of a live system without needing a backend server.

### Security and Key Management
This architecture also protects my security. Direct communication with the ElevenLabs and Cartesia APIs requires authentication with a private API key. If I enabled the frontend to call these services directly, I would have to embed my secret keys into the public code. This would allow anyone to steal my credentials. By performing the generation step locally, I ensure that my API keys never leave my private environment.
