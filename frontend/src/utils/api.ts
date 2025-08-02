import { ChatMessage, ChatResponse, BotInfo, ConversationStarter } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000' 
  : 'https://your-backend-domain.com';

export class ApiClient {
  async sendMessage(message: string, conversationHistory: ChatMessage[]): Promise<ChatResponse> {
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversation_history: formattedHistory
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getBotInfo(): Promise<BotInfo> {
    const response = await fetch(`${API_BASE_URL}/info`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getConversationStarters(): Promise<ConversationStarter> {
    const response = await fetch(`${API_BASE_URL}/conversation/suggest`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async checkHealth(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export const apiClient = new ApiClient();