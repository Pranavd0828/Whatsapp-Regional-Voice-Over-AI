'use client';

import React, { useState } from 'react';
import { Phone, Map, Music, Grid, MessageCircle, Navigation, Loader2, Volume2, Mic } from 'lucide-react';

export default function CarPlayDashboard() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    interface Notification {
        sender: string;
        message: string;
        appName: string;
    }

    // Notification Data
    const notification: Notification = {
        sender: 'Rahul',
        message: 'Bhai, kaha pohcha?',
        appName: 'WhatsApp',
    };

    const handleNotificationClick = async () => {
        if (isLoading || isPlaying) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8001/generate-audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: notification.message,
                    sender: notification.sender
                }),
            });

            if (!response.ok) throw new Error('Audio generation failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const audio = new Audio(url);

            audio.onplay = () => {
                setIsLoading(false);
                setIsPlaying(true);
            };

            audio.onended = () => {
                setIsPlaying(false);
                window.URL.revokeObjectURL(url);
            };

            await audio.play();
        } catch (error) {
            console.error('Playback failed:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full max-w-6xl aspect-[16/9] bg-[#1c1c1e] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">

            {/* 1. Sidebar (Fixed Left) */}
            <div className="w-24 bg-[#2c2c2e] flex flex-col items-center py-6 space-y-8 border-r border-gray-700 z-20">
                <div className="flex flex-col space-y-1">
                    <div className="text-gray-400 text-xs font-medium pl-1">10:45</div>
                    <div className="flex px-2 space-x-1">
                        <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                        <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                        <div className="w-1 h-2 bg-green-500 rounded-full"></div>
                    </div>
                </div>

                {/* Dock Icons */}
                <div className="flex flex-col space-y-6 w-full items-center">
                    <div className="p-3 bg-gray-600/30 rounded-xl hover:bg-gray-600/50 transition cursor-pointer">
                        <Map size={32} className="text-blue-400" />
                    </div>
                    <div className="p-3 bg-gray-600/30 rounded-xl hover:bg-gray-600/50 transition cursor-pointer">
                        <Music size={32} className="text-red-400" />
                    </div>
                    <div className="p-3 bg-gray-600/30 rounded-xl hover:bg-gray-600/50 transition cursor-pointer">
                        <Phone size={32} className="text-green-400" />
                    </div>
                    <div className="p-3 bg-gray-600/30 rounded-xl hover:bg-gray-600/50 transition cursor-pointer relative">
                        <MessageCircle size={32} className="text-green-500" />
                        <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-[#2c2c2e]"></div>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="p-3 rounded-full border-2 border-gray-500">
                        <Grid size={24} className="text-white" />
                    </div>
                </div>
            </div>

            {/* 2. Main Canvas (Map Background) */}
            <div className="flex-1 relative bg-gray-900 overflow-hidden">
                {/* CSS-based Map Placeholder (Dark Mode) */}
                <div className="absolute inset-0 bg-[#242f3e] opacity-100">
                    {/* Roads */}
                    <div className="absolute top-0 left-1/3 w-8 h-full bg-[#3e4c5b] transform -skew-x-12 ring-2 ring-gray-700"></div>
                    <div className="absolute top-1/2 left-0 w-full h-10 bg-[#3e4c5b] transform -rotate-12 ring-2 ring-gray-700"></div>
                    {/* Parks */}
                    <div className="absolute top-10 right-20 w-48 h-48 bg-[#2a382e] rounded-full opacity-80 blur-xl"></div>
                    {/* Route */}
                    <div className="absolute top-0 left-1/3 w-4 h-full bg-blue-500/80 transform -skew-x-12 blur-[1px] shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                    {/* Navigation Arrow */}
                    <div className="absolute bottom-1/4 left-[38%] p-3 bg-white rounded-full shadow-lg z-10 animate-pulse">
                        <Navigation size={32} className="text-blue-600 fill-blue-600 transform rotate-45" />
                    </div>
                </div>

                {/* Navigation UI Overlay */}
                <div className="absolute top-6 left-6 bg-[#1c1c1e]/90 backdrop-blur-md p-4 rounded-2xl border border-gray-700 shadow-xl max-w-xs">
                    <div className="flex items-start space-x-4">
                        <div className="bg-green-600 p-2 rounded-lg">
                            <Navigation size={32} className="text-white transform -rotate-90" />
                        </div>
                        <div>
                            <div className="text-gray-400 text-sm font-medium">Next Turn</div>
                            <div className="text-white text-2xl font-bold leading-tight">500m</div>
                            <div className="text-gray-300 text-lg">Turn Left</div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-[#1c1c1e]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-700 shadow-lg">
                    <div className="flex space-x-4 text-sm font-medium">
                        <div className="text-green-500">14 min</div>
                        <div className="text-gray-400">10.2 km</div>
                        <div className="text-white">10:59 ETA</div>
                    </div>
                </div>

                {/* 3. The Action Layer (Notification Banner) */}
                <div
                    onClick={handleNotificationClick}
                    className={`
                absolute top-4 right-4 md:right-auto md:left-1/2 md:transform md:-translate-x-1/2 
                w-full max-w-md bg-[#1c1c1e]/95 backdrop-blur-xl
                rounded-2xl shadow-2xl border border-gray-700/50 
                flex items-center p-4 space-x-4 cursor-pointer
                transition-all duration-500 ease-out hover:scale-105 active:scale-95
                ${isLoading ? 'animate-pulse ring-2 ring-green-500/50' : 'animate-slide-down'}
            `}
                    style={{ animation: 'slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                    {/* App Icon */}
                    <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <MessageCircle size={28} className="text-white fill-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <span className="text-white font-bold text-lg truncate">{notification.sender}</span>
                            <span className="text-gray-400 text-xs font-medium">Now</span>
                        </div>
                        <div className="text-gray-300 text-base truncate leading-snug">
                            {isLoading ? 'Translating & Speaking...' : isPlaying ? 'Playing Audio...' : notification.message}
                        </div>
                    </div>

                    {/* Status Icon */}
                    <div className="text-gray-400">
                        {isLoading ? (
                            <Loader2 size={24} className="animate-spin text-green-500" />
                        ) : isPlaying ? (
                            <Volume2 size={24} className="text-blue-500 animate-pulse" />
                        ) : (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
