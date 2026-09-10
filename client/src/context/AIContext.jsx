import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { aiService } from '../services/aiService';
import { useAuth } from './AuthContext';

const AIContext = createContext();

const INITIAL_MESSAGE = {
  id: 'welcome-msg',
  role: 'assistant',
  content: '🌾 Welcome to Farmer Market Connect! I am your AI Agricultural Assistant powered by Groq llama-3.1-8b. How can I help you discover fresh produce, connect with farmers, or track your orders today?',
  timestamp: new Date().toISOString()
};

export const AIProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Suggested prompt pills
  const suggestedQueries = [
    'Find fresh organic vegetables',
    'Where can I find 20kg aged Basmati rice?',
    'How do I list my crops as a farmer?',
    'How do I track my delivery status?'
  ];

  // Load history if user is authenticated
  useEffect(() => {
    const fetchHistory = async () => {
      if (isAuthenticated) {
        try {
          const res = await aiService.getHistory();
          if (res.data.messages && res.data.messages.length > 0) {
            setMessages([INITIAL_MESSAGE, ...res.data.messages]);
          }
        } catch {
          // If history fetch fails, fallback to initial
        }
      }
    };

    fetchHistory();
  }, [isAuthenticated]);

  const toggleAssistant = () => setIsOpen((prev) => !prev);
  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);

  const sendMessage = async (content) => {
    if (!content || content.trim() === '') return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Pass formatted history to API
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const response = await aiService.sendMessage(content, historyPayload);

      const assistantMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.data.reply,
        products: response.data.products || [],
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message || 'Unable to connect to the AI assistant. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          isError: true,
          content: '⚠️ I encountered an error answering your question. Please ensure your backend has network access or try again shortly.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = async () => {
    setMessages([INITIAL_MESSAGE]);
    if (isAuthenticated) {
      try {
        await aiService.clearHistory();
      } catch {
        // Ignore silent cleanup errors
      }
    }
  };

  return (
    <AIContext.Provider
      value={{
        isOpen,
        messages,
        isLoading,
        error,
        suggestedQueries,
        toggleAssistant,
        openAssistant,
        closeAssistant,
        sendMessage,
        clearConversation
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
