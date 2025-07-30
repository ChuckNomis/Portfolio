import React from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import WelcomeScreen from './WelcomeScreen';
import QuestionSuggestions from './QuestionSuggestions';
import './ChatArea.css';

const ChatArea = ({ 
  messages, 
  isTyping, 
  onSendMessage, 
  onQuestionSelect,
  currentInput,
  setCurrentInput,
  messagesEndRef,
  showQuestions,
  error,
  isLoading
}) => {
  const hasMessages = messages.length > 0;

  return (
    <div className="modern-chat-area">
      <div className="chat-content">
        {!hasMessages ? (
          <div className="welcome-container">
            <WelcomeScreen onQuestionSelect={onQuestionSelect} />
          </div>
        ) : (
          <div className="messages-container">
            <MessageList 
              messages={messages} 
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
            />
            
            {showQuestions && !isTyping && (
              <QuestionSuggestions onQuestionSelect={onQuestionSelect} />
            )}
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}
      </div>

      <InputArea 
        onSendMessage={onSendMessage}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        disabled={isTyping || isLoading}
      />
    </div>
  );
};

export default ChatArea;