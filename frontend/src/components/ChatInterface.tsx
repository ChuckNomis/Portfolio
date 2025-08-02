import React, { useEffect } from "react";
import { useChat } from "../hooks/useChat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import Sidebar from "./Sidebar";
import Header from "./Header";

const ChatInterface: React.FC = () => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    startConversation,
    messagesEndRef,
  } = useChat();

  useEffect(() => {
    // Start conversation with welcome message when component mounts
    startConversation();
  }, [startConversation]);

  return (
    <div className="flex h-screen bg-background-page text-text-primary font-sans">
      {/* Sidebar */}
      <Sidebar onClearChat={clearMessages} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 max-w-chat mx-auto w-full px-4">
            <MessageList
              messages={messages}
              isLoading={isLoading}
              error={error}
              messagesEndRef={messagesEndRef}
            />
          </div>

          {/* Input Area */}
          <div className="max-w-chat mx-auto w-full px-4 pb-4">
            <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
