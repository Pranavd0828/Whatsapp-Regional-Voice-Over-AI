"use client";

import React, { useState, useRef } from 'react';
import { Volume2, Loader2, Play, Pause } from 'lucide-react';

interface MessageBubbleProps {
    sender: string;
    text: string;
    isMe: boolean;
    timestamp: string;
}

export default function MessageBubble({ sender, text, isMe, timestamp }: MessageBubbleProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayAudio = async () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }

        setIsLoading(true);

        try {
            // Check if we already have the audio url (caching locally for this session)
            // For now, always fetch fresh for simplicity or if previous fetch failed
            const response = await fetch('http://localhost:8001/generate-audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, sender }),
            });

            if (!response.ok) {
                console.error("Failed to fetch audio");
                setIsLoading(false);
                return;
            }

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);

            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.onended = () => setIsPlaying(false);
                audioRef.current.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error("Error playing audio:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-3`}>
            <div
                className={`relative max-w-[65%] p-2 rounded-lg shadow-sm text-sm 
                    ${isMe ? 'bg-[#d9fdd3]' : 'bg-white'} 
                    ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'}
                `}
            >
                {/* Sender Name (for group chat) */}
                {!isMe && <div className="text-xs font-bold text-orange-800 mb-1">{sender}</div>}

                {/* Message Text */}
                <div className="pr-16 text-gray-800 leading-relaxed">
                    {text}
                </div>

                {/* Metadata Row: Timestamp + Play Button */}
                <div className="absolute right-2 bottom-1 flex items-center space-x-2">
                    <span className="text-[11px] text-gray-500">{timestamp}</span>

                    {/* Play Button */}
                    <button
                        onClick={handlePlayAudio}
                        disabled={isLoading}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="Play Smart Audio"
                    >
                        {isLoading ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : isPlaying ? (
                            <Pause size={14} />
                        ) : (
                            <Volume2 size={14} />
                        )}
                    </button>

                    {/* Hidden Audio Element */}
                    <audio ref={audioRef} className="hidden" />
                </div>
            </div>
        </div>
    );
}
