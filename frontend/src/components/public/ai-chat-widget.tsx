"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<{role: 'user' | 'ai', content: string, links?: string}[]>([]);
  const router = useRouter();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message;
    setMessage('');
    setResponses(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/ai/search', { query: userMsg });
      
      const parsedParams = data.data.interpretedQuery;
      let aiResponse = `I found some matches based on your request.`;
      
      // Build a URL to redirect them to properties page
      const searchParams = new URLSearchParams();
      if (parsedParams.type) searchParams.set('type', parsedParams.type);
      if (parsedParams.city?.contains) searchParams.set('city', parsedParams.city.contains);
      
      const link = `/properties?${searchParams.toString()}`;

      setResponses(prev => [...prev, { role: 'ai', content: aiResponse, links: link }]);
    } catch (error) {
      setResponses(prev => [...prev, { role: 'ai', content: "I'm having trouble processing that right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-background border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold">AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-primary-foreground/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-muted/10">
              <div className="bg-muted p-3 rounded-xl rounded-tl-none self-start max-w-[80%] text-sm">
                Hi! I'm your AI assistant. Tell me what kind of property you're looking for, e.g., "Show me 3 BHK flats in Bangalore under 2 Cr."
              </div>
              
              {responses.map((res, i) => (
                <div key={i} className={`p-3 rounded-xl text-sm max-w-[80%] ${res.role === 'user' ? 'bg-primary text-primary-foreground self-end rounded-tr-none' : 'bg-muted self-start rounded-tl-none'}`}>
                  {res.content}
                  {res.links && (
                    <Button 
                      variant="link" 
                      className="block p-0 h-auto mt-2 text-blue-500" 
                      onClick={() => router.push(res.links!)}
                    >
                      View Results
                    </Button>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="bg-muted p-3 rounded-xl rounded-tl-none self-start text-sm text-muted-foreground animate-pulse">
                  Thinking...
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2">
              <Input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..." 
                className="flex-1 border-none bg-muted/50 focus-visible:ring-1"
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={loading || !message.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <Button 
          size="lg" 
          className="rounded-full w-14 h-14 shadow-2xl p-0 flex items-center justify-center animate-bounce"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}
