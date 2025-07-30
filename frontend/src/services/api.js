import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const chatAPI = {
  // Send a message and get response
  sendMessage: async (message, sessionId = null) => {
    try {
      const response = await apiClient.post('/chat/message', {
        message,
        session_id: sessionId,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error(error.response?.data?.detail || 'Failed to send message');
    }
  },

  // Get chat history for a session
  getChatHistory: async (sessionId) => {
    try {
      const response = await apiClient.get(`/chat/history/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get chat history');
    }
  },

  // Create a new chat session
  createNewSession: async () => {
    try {
      const response = await apiClient.post('/chat/new-session');
      return response.data;
    } catch (error) {
      console.error('Error creating new session:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create new session');
    }
  },

  // Get all chat sessions
  getChatSessions: async () => {
    try {
      const response = await apiClient.get('/chat/sessions');
      return response.data;
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get chat sessions');
    }
  },

  // Get contact information
  getContactInfo: async () => {
    try {
      const response = await apiClient.get('/contact');
      return response.data;
    } catch (error) {
      console.error('Error getting contact info:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get contact info');
    }
  },
};

// Session management utilities
export const sessionUtils = {
  // Get current session ID from localStorage
  getCurrentSessionId: () => {
    return localStorage.getItem('nadavgpt_session_id');
  },

  // Set current session ID in localStorage
  setCurrentSessionId: (sessionId) => {
    localStorage.setItem('nadavgpt_session_id', sessionId);
  },

  // Clear current session ID
  clearCurrentSessionId: () => {
    localStorage.removeItem('nadavgpt_session_id');
  },

  // Generate new session ID and store it
  generateNewSession: async () => {
    try {
      const newSession = await chatAPI.createNewSession();
      sessionUtils.setCurrentSessionId(newSession.session_id);
      return newSession.session_id;
    } catch (error) {
      // Fallback to local UUID generation
      const fallbackSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionUtils.setCurrentSessionId(fallbackSessionId);
      return fallbackSessionId;
    }
  },
};

export default apiClient;