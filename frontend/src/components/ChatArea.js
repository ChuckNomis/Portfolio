import React from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import WelcomeScreen from './WelcomeScreen';
import './ChatArea.css';

const ChatArea = ({ 
  messages, 
  isTyping, 
  onSendMessage, 
  onQuestionSelect,
  currentInput,
  setCurrentInput,
  messagesEndRef
}) => {
  const hasMessages = messages.length > 0;

  return (
    <div className="chat-area">
      <div className="chat-header">
        <h1 className="chat-title">NadavGPT</h1>
        <p className="chat-subtitle">Ask me anything about Nadav Simon, AI Engineer</p>
      </div>

      <div className="chat-content">
        {!hasMessages ? (
          <WelcomeScreen onQuestionSelect={onQuestionSelect} />
        ) : (
          <MessageList 
            messages={messages} 
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
          />
        )}
      </div>

      <InputArea 
        onSendMessage={onSendMessage}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        disabled={isTyping}
      />
    </div>
  );
};

export default ChatArea;