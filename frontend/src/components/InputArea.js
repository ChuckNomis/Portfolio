import React, { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import './InputArea.css';

const InputArea = ({ onSendMessage, currentInput, setCurrentInput, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentInput.trim() && !disabled) {
      onSendMessage(currentInput.trim());
      setCurrentInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, you'd implement voice recording here
  };

  return (
    <div className="input-area">
      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <button 
              type="button" 
              className="attachment-btn"
              title="Attach file"
            >
              <Paperclip size={20} />
            </button>
            
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Nadav..."
              className="message-input"
              disabled={disabled}
              rows={1}
              maxLength={500}
            />
            
            <div className="input-actions">
              <button 
                type="button" 
                className={`voice-btn ${isRecording ? 'recording' : ''}`}
                onClick={toggleRecording}
                title="Voice input"
              >
                <Mic size={20} />
              </button>
              
              <button 
                type="submit" 
                className="send-btn"
                disabled={!currentInput.trim() || disabled}
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </form>
        
        <div className="input-footer">
          <p className="input-hint">
            NadavGPT can answer questions about Nadav's background, projects, and skills. 
            <span className="hint-highlight">Try the suggested questions above!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;