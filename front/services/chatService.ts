const API_BASE_URL = 'http://localhost:8080/api';

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  response: string;
  timestamp: number;
  success: boolean;
  error?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  model: string;
  ollama_url: string;
  timestamp: number;
}

export class ChatService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async sendMessage(message: string): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  static async sendMessageStream(message: string): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/chat/stream', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  static async clearMemory(): Promise<{ message: string; success: boolean }> {
    return this.makeRequest<{ message: string; success: boolean }>('/chat/clear-memory', {
      method: 'POST',
    });
  }

  static async checkHealth(): Promise<HealthResponse> {
    return this.makeRequest<HealthResponse>('/chat/health');
  }

  static async testConnection(): Promise<boolean> {
    try {
      await this.checkHealth();
      return true;
    } catch (error) {
      console.error('Chat service connection failed:', error);
      return false;
    }
  }
}

// Example usage and error handling
export const chatService = {
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      return await ChatService.sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  },

  async checkHealth(): Promise<HealthResponse> {
    try {
      return await ChatService.checkHealth();
    } catch (error) {
      console.error('Error checking health:', error);
      throw new Error('Failed to check service health.');
    }
  },

  async clearMemory(): Promise<{ message: string; success: boolean }> {
    try {
      return await ChatService.clearMemory();
    } catch (error) {
      console.error('Error clearing memory:', error);
      throw new Error('Failed to clear conversation memory.');
    }
  },
}; 