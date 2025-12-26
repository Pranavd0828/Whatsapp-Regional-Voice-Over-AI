"use client";

import React from 'react';
import { Phone, Video, Search, MoreVertical, Paperclip, Smile, Mic, Send } from 'lucide-react';
import MessageBubble from './MessageBubble';

const MOCK_MESSAGES = [
    { id: 1, sender: "Rahul", text: "Bhai, scene kya hai aaj raat ka?", isMe: false, timestamp: "7:45 PM" },
    { id: 2, sender: "Sneha", text: "I think we are meeting at 8 PM, right?", isMe: false, timestamp: "7:48 PM" },
    { id: 3, sender: "Rahul", text: "Haan, par place decide nahi hua ab tak.", isMe: false, timestamp: "7:50 PM" },
    { id: 4, sender: "Sneha", text: "Why don't we go to the new cafe in CP?", isMe: false, timestamp: "7:55 PM" },
    { id: 5, sender: "Rahul", text: "Sahi hai, done karte hain. Main aata hoon wahan.", isMe: false, timestamp: "8:02 PM" },
    { id: 6, sender: "Sneha", text: "Perfect, see you there!", isMe: false, timestamp: "8:03 PM" },
];

export default function ChatWindow() {
    return (
        <div className="flex flex-col h-[calc(100vh-40px)] w-full max-w-4xl mx-auto bg-[#efeae2] relative shadow-xl rounded-lg overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#f0f2f5] border-l border-gray-300">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=College+Buddies&background=random" alt="Group Icon" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-800 font-semibold text-sm">College Buddies</span>
                        <span className="text-gray-500 text-xs truncate">Rahul, Sneha, Arjun, Priya, Rohan, You</span>
                    </div>
                </div>

                <div className="flex items-center space-x-5 text-gray-500">
                    <Search size={20} className="cursor-pointer" />
                    <MoreVertical size={20} className="cursor-pointer" />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-center opacity-90">
                {MOCK_MESSAGES.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        sender={msg.sender}
                        text={msg.text}
                        isMe={msg.isMe}
                        timestamp={msg.timestamp}
                    />
                ))}
            </div>

            {/* Input Area */}
            <div className="flex items-center px-4 py-3 bg-[#f0f2f5] space-x-3">
                <Smile size={24} className="text-gray-500 cursor-pointer" />
                <Paperclip size={24} className="text-gray-500 cursor-pointer" />

                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Type a message"
                        className="w-full py-2 px-4 rounded-lg bg-white border border-transparent focus:border-white focus:outline-none text-sm text-gray-700 placeholder-gray-500"
                    />
                </div>

                <Mic size={24} className="text-gray-500 cursor-pointer" />
            </div>
        </div>
    );
}
