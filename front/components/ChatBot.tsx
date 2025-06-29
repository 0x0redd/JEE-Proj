'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2,
  Building2,
  Minimize2,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { chatService } from '../services/chatService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  className?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant immobilier. Je peux vous aider à trouver des biens immobiliers au Maroc, répondre à vos questions sur les prix, quartiers, et processus d\'achat. Comment puis-je vous aider ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await chatService.checkHealth();
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
        console.error('Chat service not available:', error);
      }
    };
    
    checkConnection();
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await chatService.sendMessage(userMessage.text);

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsConnected(true);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.error || 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Erreur de connexion. Veuillez vérifier que le service est disponible et réessayer.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    try {
      await chatService.clearMemory();
      setMessages([
        {
          id: '1',
          text: 'Bonjour ! Je suis votre assistant immobilier. Je peux vous aider à trouver des biens immobiliers au Maroc, répondre à vos questions sur les prix, quartiers, et processus d\'achat. Comment puis-je vous aider ?',
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900 transition-all duration-200 shadow-lg"
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-state="closed"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="30" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white block border-gray-200 align-middle"
          >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" className="border-gray-200" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Container */}
      <div 
        style={{ boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
        className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white dark:bg-slate-900 p-6 rounded-lg border border-[#e5e7eb] dark:border-slate-700 w-[440px] h-[634px] flex flex-col"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex flex-col space-y-1.5">
            <h2 className="font-semibold text-lg tracking-tight text-gray-900 dark:text-white">Assistant Immobilier</h2>
            <p className="text-sm text-[#6b7280] dark:text-slate-400 leading-3">
              {isConnected ? 'Powered by Llama 3.2' : 'Hors ligne'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4 text-gray-600 dark:text-slate-400" />
              ) : (
                <Minimize2 className="h-4 w-4 text-gray-600 dark:text-slate-400" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <X className="h-4 w-4 text-gray-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Chat Messages Container */}
            <div className="flex-1 overflow-hidden min-h-0">
              <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3 my-4 text-gray-600 dark:text-slate-300 text-sm flex-1">
                      <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                        <div className="rounded-full bg-gray-100 dark:bg-slate-800 border dark:border-slate-700 p-1">
                          {message.sender === 'bot' ? (
                            <svg 
                              stroke="none" 
                              fill="currentColor" 
                              strokeWidth="1.5"
                              viewBox="0 0 24 24" 
                              aria-hidden="true" 
                              height="20" 
                              width="20" 
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-blue-600 dark:text-blue-400"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                              />
                            </svg>
                          ) : (
                            <svg 
                              stroke="none" 
                              fill="currentColor" 
                              strokeWidth="0"
                              viewBox="0 0 16 16" 
                              height="20" 
                              width="20" 
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-gray-600 dark:text-slate-400"
                            >
                              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                            </svg>
                          )}
                        </div>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="leading-relaxed">
                          <span className="block font-bold text-gray-700 dark:text-slate-200">
                            {message.sender === 'bot' ? 'Assistant' : 'Vous'}
                          </span>
                          <span className="whitespace-pre-wrap break-words">{message.text}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                          {message.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 my-4 text-gray-600 dark:text-slate-300 text-sm flex-1">
                      <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                        <div className="rounded-full bg-gray-100 dark:bg-slate-800 border dark:border-slate-700 p-1">
                          <svg 
                            stroke="none" 
                            fill="currentColor" 
                            strokeWidth="1.5"
                            viewBox="0 0 24 24" 
                            aria-hidden="true" 
                            height="20" 
                            width="20" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-blue-600 dark:text-blue-400"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                            />
                          </svg>
                        </div>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="leading-relaxed">
                          <span className="block font-bold text-gray-700 dark:text-slate-200">Assistant</span>
                          <span className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                            <span>En train d'écrire...</span>
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Box */}
            <div className="flex items-center pt-4 border-t border-gray-200 dark:border-slate-700 flex-shrink-0">
              <form 
                className="flex items-center justify-center w-full space-x-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex h-10 w-full rounded-md border border-[#e5e7eb] dark:border-slate-600 px-3 py-2 text-sm placeholder-[#6b7280] dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9ca3af] dark:focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] dark:text-white focus-visible:ring-offset-2 bg-white dark:bg-slate-800"
                  placeholder={isConnected ? "Tapez votre message..." : "Service indisponible"}
                  disabled={isLoading || !isConnected}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading || !isConnected}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] dark:bg-blue-600 dark:hover:bg-blue-700 h-10 px-4 py-2 transition-colors"
                  type="submit"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Clear Chat Button */}
            <div className="flex justify-center mt-3 flex-shrink-0">
              <button
                onClick={clearChat}
                className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
              >
                Effacer la conversation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 