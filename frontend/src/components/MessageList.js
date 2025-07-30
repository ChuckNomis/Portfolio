import React from 'react';
import { User, Sparkles } from 'lucide-react';
import './MessageList.css';

const MessageList = ({ messages, isTyping, messagesEndRef }) => {
  const TypingIndicator = () => (
    <div className="message assistant">
      <div className="message-avatar">
        <Sparkles size={20} color="var(--bg-primary)" />
      </div>
      <div className="message-content">
        <div className="typing-indicator">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.type}`}>
          <div className="message-avatar">
            {message.type === 'user' ? (
              <User size={20} />
            ) : (
              <Sparkles size={20} color="var(--bg-primary)" />
            )}
          </div>
          <div className="message-content">
            <div className="message-text">
              {message.content.split('\n').map((line, index) => (
                <div key={index}>
                  {line}
                  {index < message.content.split('\n').length - 1 && <br />}
                </div>
              ))}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      ))}
      
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;