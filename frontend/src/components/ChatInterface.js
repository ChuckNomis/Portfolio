import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { chatAPI, sessionUtils } from '../services/api';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [showQuestions, setShowQuestions] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize session on component mount
  useEffect(() => {
    initializeSession();
    loadChatSessions();
  }, []);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      let sessionId = sessionUtils.getCurrentSessionId();
      
      if (!sessionId) {
        sessionId = await sessionUtils.generateNewSession();
      }
      
      setCurrentSessionId(sessionId);
      
      // Try to load existing chat history
      if (sessionId) {
        await loadChatHistory(sessionId);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      setError('Failed to initialize chat session');
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatHistory = async (sessionId) => {
    try {
      const historyData = await chatAPI.getChatHistory(sessionId);
      
      // Convert backend format to frontend format
      const loadedMessages = historyData.messages.map(msg => ({
        id: msg.id,
        type: msg.type,
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      }));
      
      setMessages(loadedMessages);
      setShowQuestions(loadedMessages.length === 0);
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Don't show error for empty history, just start fresh
      setMessages([]);
      setShowQuestions(true);
    }
  };

  const loadChatSessions = async () => {
    try {
      const sessionsData = await chatAPI.getChatSessions();
      setChatSessions(sessionsData.sessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || isTyping) return;

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowQuestions(false);
    setError(null);

    try {
      // Send message to backend
      const response = await chatAPI.sendMessage(message, currentSessionId);
      
      // Add assistant response
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.response,
        timestamp: new Date(response.timestamp)
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update session ID if it changed (new session)
      if (response.session_id !== currentSessionId) {
        setCurrentSessionId(response.session_id);
        sessionUtils.setCurrentSessionId(response.session_id);
        // Reload sessions to show the new one
        loadChatSessions();
      }
      
      // Show questions again after response
      setTimeout(() => {
        setShowQuestions(true);
      }, 100);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Show questions again even on error
      setTimeout(() => {
        setShowQuestions(true);
      }, 100);
      
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionSelect = (question) => {
    handleSendMessage(question);
  };

  const handleNewChat = async () => {
    try {
      setIsLoading(true);
      
      // Generate new session
      const newSessionId = await sessionUtils.generateNewSession();
      setCurrentSessionId(newSessionId);
      
      // Clear current messages
      setMessages([]);
      setShowQuestions(true);
      setError(null);
      
      // Reload sessions list
      await loadChatSessions();
      
    } catch (error) {
      console.error('Error creating new chat:', error);
      setError('Failed to create new chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionSelect = async (sessionId) => {
    if (sessionId === currentSessionId) return;
    
    try {
      setIsLoading(true);
      setCurrentSessionId(sessionId);
      sessionUtils.setCurrentSessionId(sessionId);
      
      await loadChatHistory(sessionId);
      setError(null);
      
    } catch (error) {
      console.error('Error switching session:', error);
      setError('Failed to load chat session');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="chat-interface">
        <Sidebar 
          onNewChat={handleNewChat}
          chatSessions={chatSessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
        />
        <div className="loading-container">
          <div className="loading-spinner">Loading NadavGPT...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <Sidebar 
        onNewChat={handleNewChat}
        chatSessions={chatSessions}
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
      />
      <ChatArea 
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onQuestionSelect={handleQuestionSelect}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        messagesEndRef={messagesEndRef}
        showQuestions={showQuestions}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInterface;