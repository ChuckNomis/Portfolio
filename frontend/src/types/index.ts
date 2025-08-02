export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatResponse {
  response: string;
  sources?: string[];
  conversation_id?: string;
}

export interface BotInfo {
  name: string;
  description: string;
  capabilities: string[];
  example_questions: string[];
  limitations: string[];
}

export interface ConversationStarter {
  starters: string[];
}