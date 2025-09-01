'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CornerDownLeft, Loader2, MessageCircle, X, Contact } from 'lucide-react';
import { chat } from '@/ai/flows/chatbot-flow';
import type { ChatInput } from '@/ai/schemas/chatbot-schema';

type Message = ChatInput['history'][0];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Hello! How can I help you today? You can ask me about events, vendors, or how to get involved.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat({ history: newMessages });
      setMessages([...newMessages, { role: 'model', content: response }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages([
        ...newMessages,
        { role: 'model', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // Using `querySelector` to get the viewport element inside the ScrollArea
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      >
        <Button
          onClick={toggleOpen}
          size="icon"
          className="w-16 h-16 rounded-full shadow-lg"
          aria-label="Toggle Chatbot"
        >
          {isOpen ? <X className="h-8 w-8" /> : <MessageCircle className="h-8 w-8" />}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[70vh] max-h-[600px] bg-card border rounded-lg shadow-xl flex flex-col"
          >
            <header className="p-4 border-b flex justify-between items-center">
              <h3 className="font-headline text-lg">PDSCC Assistant</h3>
               <Button variant="outline" size="sm" asChild>
                    <a href="/contact">
                        <Contact className="mr-2 h-4 w-4" />
                        Contact Us
                    </a>
               </Button>
            </header>

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-end gap-2',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'p-3 rounded-lg max-w-[80%]',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-lg bg-secondary">
                           <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                 )}
              </div>
            </ScrollArea>

            <footer className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input}>
                   {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CornerDownLeft className="h-4 w-4" />}
                </Button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
