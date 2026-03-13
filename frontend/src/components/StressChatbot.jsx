import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Loader2, Sparkles, Heart } from 'lucide-react';
import api from '../api';

const StressChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hi there! I'm your Stress-Relief companion. How are you feeling today? I'm here to listen and help you unwind." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await api.post('/api/ai/chatbot', {
                prompt: input,
                history: messages.slice(-5) // Send last 5 messages for context
            });

            if (res.data.success) {
                setMessages(prev => [...prev, { role: 'assistant', text: res.data.text }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I'm having a bit of trouble connecting right now. But I'm still here for you." }]);
            }
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm having a technical glitch, but remember that taking a deep breath always helps!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                {isOpen ? <X size={32} className="text-white" /> : <MessageCircle size={32} className="text-white" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: -20, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100, x: 20 }}
                        className="absolute bottom-20 right-0 w-[400px] h-[550px] bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Bot size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-lg tracking-tight">Stress Relief AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                            <Sparkles size={20} className="text-white/50" />
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth custom-scrollbar">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl flex gap-3 ${
                                        msg.role === 'user' 
                                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                                            : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                                    }`}>
                                        <div className="flex-shrink-0 mt-1">
                                            {msg.role === 'user' ? <User size={16} /> : <Heart size={16} className="text-rose-400" />}
                                        </div>
                                        <p className="text-sm leading-relaxed font-medium">
                                            {msg.text}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                        <Loader2 size={16} className="text-indigo-400 animate-spin" />
                                        <span className="text-sm text-slate-400 font-bold animate-pulse">Thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white/[0.02] border-t border-white/5">
                            <div className="relative flex items-center gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Tell me how you're feeling..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={20} />
                                </motion.button>
                            </div>
                            <p className="text-[10px] text-center text-slate-600 font-black uppercase tracking-[0.2em] mt-4">
                                Powered by Gemini Flash
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StressChatbot;
