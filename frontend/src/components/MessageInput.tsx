import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end bg-input-bg border border-input-border rounded-input">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isLoading}
          className="flex-1 bg-transparent text-input-text placeholder-text-secondary px-input py-3 border-none outline-none resize-none min-h-[48px] max-h-32 input-focus"
          rows={1}
        />

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`m-2 p-2 rounded-md transition-colors ${
            message.trim() && !isLoading
              ? "bg-button-primary hover:bg-button-hover text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
