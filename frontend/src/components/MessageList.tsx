import React from "react";
import { ChatMessage } from "../types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  error,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto chat-scrollbar py-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {error && (
        <div className="text-red-400 text-sm text-center py-2 px-4 bg-red-900/20 rounded-lg mx-4">
          {error}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
