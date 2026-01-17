import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '../services/ai';
import { GenerateContentResponse } from '@google/genai';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hello! I am EarlyShield AI. How can I assist you with campus safety today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Prepare history for API (excluding the last user message we just added visually)
      const history = messages.map(m => ({ role: m.role, parts: m.text }));
      
      const stream = await chatWithGemini(history, userMsg);
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullResponse += c.text;
          setMessages(prev => {
            const newArr = [...prev];
            newArr[newArr.length - 1].text = fullResponse;
            return newArr;
          });
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the network right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end pointer-events-auto">
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] bg-white dark:bg-surface rounded-2xl shadow-2xl border border-surface-variant flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">smart_toy</span>
              <div>
                <h3 className="font-bold text-sm">EarlyShield AI</h3>
                <p className="text-[10px] opacity-80">Powered by Gemini 1.5 Pro</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-variant/10">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-white dark:bg-surface-variant border border-surface-variant rounded-bl-none text-text-main shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-white dark:bg-surface-variant border border-surface-variant p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                    <span className="w-2 h-2 bg-text-secondary/40 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-text-secondary/40 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-text-secondary/40 rounded-full animate-bounce delay-150"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-surface border-t border-surface-variant">
            <div className="flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about campus safety..."
                className="flex-1 bg-surface-variant/30 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary text-text-main"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all transform hover:scale-105 ${isOpen ? 'bg-surface-variant text-text-main' : 'bg-primary text-white'}`}
      >
        <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'forum'}</span>
      </button>
    </div>
  );
};

export default ChatBot;