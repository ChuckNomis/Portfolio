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
  showQuestions
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