import React, { useState, useEffect } from "react";
import { Plus, MessageSquare, Info, Trash2 } from "lucide-react";
import { apiClient } from "../utils/api";
import { ConversationStarter, BotInfo } from "../types";

interface SidebarProps {
  onClearChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClearChat }) => {
  const [conversationStarters, setConversationStarters] = useState<string[]>(
    []
  );
  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [starters, info] = await Promise.all([
          apiClient.getConversationStarters(),
          apiClient.getBotInfo(),
        ]);
        setConversationStarters(starters.starters);
        setBotInfo(info);
      } catch (error) {
        console.error("Failed to load sidebar data:", error);
        // Set fallback data
        setConversationStarters([
          "Hi! Tell me about yourself.",
          "What are your core technical skills?",
          "Show me your most recent projects.",
          "What's your experience with AI?",
        ]);
      }
    };

    loadData();
  }, []);

  const handleStarterClick = (starter: string) => {
    // This would need to be passed down from parent to send message
    // For now, we'll just copy to clipboard or log
    navigator.clipboard?.writeText(starter);
  };

  return (
    <div className="w-80 bg-background-sidebar border-r border-divider flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-divider">
        <button
          onClick={onClearChat}
          className="w-full flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-background-chat rounded-md transition-colors"
        >
          <Plus size={16} />
          <span>New conversation</span>
        </button>
      </div>

      {/* Conversation Starters */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
            <MessageSquare size={14} />
            Conversation Starters
          </h3>
          <div className="space-y-2">
            {conversationStarters.map((starter, index) => (
              <button
                key={index}
                onClick={() => handleStarterClick(starter)}
                className="w-full text-left p-3 text-sm text-text-secondary hover:text-text-primary hover:bg-background-chat rounded-md transition-colors"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>

        {/* Bot Info Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full flex items-center gap-2 p-3 text-sm text-text-secondary hover:text-text-primary hover:bg-background-chat rounded-md transition-colors"
          >
            <Info size={14} />
            About NadavBot
          </button>

          {showInfo && botInfo && (
            <div className="mt-2 p-3 bg-background-chat rounded-md text-xs text-text-secondary space-y-2">
              <p>{botInfo.description}</p>

              <div>
                <h4 className="font-medium text-text-primary mb-1">
                  Capabilities:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {botInfo.capabilities.map((capability, index) => (
                    <li key={index}>{capability}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-text-primary mb-1">
                  Example Questions:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {botInfo.example_questions
                    .slice(0, 3)
                    .map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-divider">
        <button
          onClick={onClearChat}
          className="w-full flex items-center gap-2 p-2 text-sm text-text-secondary hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
        >
          <Trash2 size={14} />
          Clear conversation
        </button>

        <div className="mt-4 text-xs text-text-secondary text-center">
          <p>Powered by Graph RAG</p>
          <p>Built with LangGraph & React</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
