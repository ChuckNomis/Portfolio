import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "../types";
import { formatTimestamp } from "../utils/helpers";
import { User, Bot } from "lucide-react";
import TypingIndicator from "./TypingIndicator";

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const isLoading = message.isLoading;

  return (
    <div
      className={`flex gap-3 message-bubble ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          isUser ? "bg-bubble-user-bg" : "bg-bubble-assistant-bg"
        }`}
      >
        {isUser ? (
          <User size={16} className="text-bubble-user-text" />
        ) : (
          <Bot size={16} className="text-bubble-assistant-text" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[80%] ${isUser ? "text-right" : "text-left"}`}
      >
        <div
          className={`inline-block px-3 py-2 rounded-bubble ${
            isUser
              ? "bg-bubble-user-bg text-bubble-user-text ml-auto"
              : "bg-bubble-assistant-bg text-bubble-assistant-text"
          }`}
        >
          {isLoading ? (
            <TypingIndicator />
          ) : isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div className="message-content prose prose-sm prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom link component
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                  // Custom code component
                  code: ({ node, inline, className, children, ...props }) => {
                    return inline ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp */}
        {!isLoading && (
          <div
            className={`text-xs text-text-secondary mt-1 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {formatTimestamp(message.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
