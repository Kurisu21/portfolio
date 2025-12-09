import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm an AI assistant. How can I help you?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showLongLoadingBanner, setShowLongLoadingBanner] = useState(false);
    const loadingTimeoutRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Handle long loading banner (15 seconds)
    useEffect(() => {
        if (isLoading) {
            setShowLongLoadingBanner(false);
            // Show banner after 15 seconds
            loadingTimeoutRef.current = setTimeout(() => {
                setShowLongLoadingBanner(true);
            }, 15000);
        } else {
            // Clear timeout if loading stops
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
            }
            setShowLongLoadingBanner(false);
        }

        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, [isLoading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // Use environment variable for production (Render backend), or relative URL for same-server deployment
            // In development, Vite proxy handles /api/chat
            // In production on Render (separate frontend/backend), use VITE_API_URL
            const apiUrl = import.meta.env.VITE_API_URL || 
                          (import.meta.env.PROD ? 'https://ij-server.onrender.com/api/chat' : '/api/chat');
            const response = await axios.post(apiUrl, {
                question: inputText,
            });

            const botMessage = {
                id: Date.now() + 1,
                text: response.data.text || response.data.answer || "Sorry, I couldn't get a response.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, something went wrong. Please try again later.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className={`fixed bottom-8 right-8 p-4 bg-accent text-primary rounded-full shadow-lg z-50 ${isOpen ? 'hidden' : 'block'}`}
            >
                <MessageSquare className="h-6 w-6" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-8 right-8 w-96 h-[500px] bg-secondary border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary/50 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-accent/20 rounded-full">
                                    <Bot className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">AI Assistant</h3>
                                    <div className="flex items-center space-x-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-xs text-slate-400">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                                ? 'bg-accent text-primary rounded-br-none'
                                                : 'bg-secondary border border-white/10 text-slate-300 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-secondary p-3 rounded-2xl rounded-bl-none border border-white/10">
                                        <Loader2 className="h-5 w-5 text-accent animate-spin" />
                                    </div>
                                </div>
                            )}
                            
                            {/* Long Loading Banner */}
                            <AnimatePresence>
                                {showLongLoadingBanner && isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="bg-accent/10 border border-accent/30 rounded-lg p-3 mb-2"
                                    >
                                        <div className="flex items-start space-x-2">
                                            <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs text-accent font-medium mb-1">
                                                    Server is spinning up...
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Render free tier servers spin down after inactivity. This may take 30-60 seconds on first request.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-primary/50 border-t border-white/10 backdrop-blur-md">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-secondary border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2 focus:outline-none focus:border-accent transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputText.trim()}
                                    className="bg-accent text-primary p-2 rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
