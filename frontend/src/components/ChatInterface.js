import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { mockResponses } from '../data/mockData';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [showQuestions, setShowQuestions] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowQuestions(false); // Hide questions while processing

    // Simulate typing delay
    setTimeout(() => {
      let botResponse;
      
      // Check if message matches pre-defined questions
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('educational background') || lowerMessage.includes('education')) {
        botResponse = mockResponses.education;
      } else if (lowerMessage.includes('projects') || lowerMessage.includes('show me')) {
        botResponse = mockResponses.projects;
      } else if (lowerMessage.includes('skills') || lowerMessage.includes('what skills')) {
        botResponse = mockResponses.skills;
      } else if (lowerMessage.includes('tell me about nadav') || lowerMessage.includes('about nadav')) {
        botResponse = mockResponses.about;
      } else if (lowerMessage.includes('courses') || lowerMessage.includes('what courses')) {
        botResponse = mockResponses.courses;
      } else {
        botResponse = "Don't be greedy! Please select from the available questions to learn about Nadav.";
      }

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // Show questions again after response
      setTimeout(() => {
        setShowQuestions(true);
      }, 500);
    }, 1500);
  };

  const handleQuestionSelect = (question) => {
    handleSendMessage(question);
  };

  return (
    <div className="chat-interface">
      <Sidebar />
      <ChatArea 
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onQuestionSelect={handleQuestionSelect}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        messagesEndRef={messagesEndRef}
        showQuestions={showQuestions}
      />
    </div>
  );
};

export default ChatInterface;