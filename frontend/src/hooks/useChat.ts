import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatResponse } from '../types';
import { apiClient } from '../utils/api';
import { generateId } from '../utils/helpers';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response: ChatResponse = await apiClient.sendMessage(
        content,
        messages
      );

      // Remove loading message and add actual response
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => !msg.isLoading);
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
        };
        return [...filteredMessages, assistantMessage];
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      // Remove loading message and add error message
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => !msg.isLoading);
        const errorMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your message. Please try again.',
          timestamp: new Date(),
        };
        return [...filteredMessages, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const startConversation = useCallback(async () => {
    try {
      const welcomeMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: "Hi! I'm NadavBot 👋\n\nI'm here to tell you about Nadav's experience, skills, and projects. Feel free to ask me anything about his technical background, work experience, or recent projects!\n\nWhat would you like to know?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } catch (err) {
      console.error('Failed to start conversation:', err);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    startConversation,
    messagesEndRef,
  };
};