import { toast } from 'react-toastify';

export interface WebSocketMessage {
  type: 'chat' | 'notification' | 'essay_update' | 'feedback' | 'mentor_request' | 'system';
  data: any;
  timestamp: string;
  senderId?: string;
  recipientId?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  recipientId?: string;
  roomId?: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface NotificationMessage {
  id: string;
  type: 'essay' | 'deadline' | 'progress' | 'mentor' | 'general';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  timestamp: string;
}

export interface EssayUpdate {
  essayId: string;
  userId: string;
  action: 'created' | 'updated' | 'deleted' | 'feedback_ready';
  title?: string;
  content?: string;
  timestamp: string;
}

export interface FeedbackUpdate {
  essayId: string;
  feedbackId: string;
  type: 'generated' | 'updated' | 'resolved';
  severity: 'low' | 'medium' | 'high';
  title: string;
  timestamp: string;
}

export interface MentorRequest {
  id: string;
  studentId: string;
  studentName: string;
  essayId?: string;
  essayTitle?: string;
  type: 'feedback' | 'consultation' | 'review';
  priority: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Map<string, ((data: any) => void)[]> = new Map();
  private connectionHandlers: ((connected: boolean) => void)[] = [];
  private isConnecting = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.REACT_APP_WS_URL || window.location.host;
    return `${protocol}//${host}/ws`;
  }

  private connect(): void {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No auth token available for WebSocket connection');
      this.isConnecting = false;
      return;
    }

    try {
      const wsUrl = `${this.getWebSocketUrl()}?token=${token}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.notifyConnectionHandlers(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.stopHeartbeat();
        this.notifyConnectionHandlers(false);
        
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        this.connect();
      }
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({
          type: 'system',
          data: { action: 'ping' },
          timestamp: new Date().toISOString()
        });
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message.data);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    }

    // Handle specific message types
    switch (message.type) {
      case 'notification':
        this.handleNotification(message.data as NotificationMessage);
        break;
      case 'chat':
        this.handleChatMessage(message.data as ChatMessage);
        break;
      case 'essay_update':
        this.handleEssayUpdate(message.data as EssayUpdate);
        break;
      case 'feedback':
        this.handleFeedbackUpdate(message.data as FeedbackUpdate);
        break;
      case 'mentor_request':
        this.handleMentorRequest(message.data as MentorRequest);
        break;
    }
  }

  private handleNotification(notification: NotificationMessage): void {
    // Show toast notification
    const toastType = notification.priority === 'high' ? 'error' : 
                     notification.priority === 'medium' ? 'warning' : 'info';
    
    toast(notification.message, {
      type: toastType,
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  private handleChatMessage(chatMessage: ChatMessage): void {
    // Handle incoming chat messages
    console.log('Received chat message:', chatMessage);
  }

  private handleEssayUpdate(essayUpdate: EssayUpdate): void {
    // Handle essay updates
    console.log('Essay update received:', essayUpdate);
  }

  private handleFeedbackUpdate(feedbackUpdate: FeedbackUpdate): void {
    // Handle feedback updates
    console.log('Feedback update received:', feedbackUpdate);
  }

  private handleMentorRequest(mentorRequest: MentorRequest): void {
    // Handle mentor requests
    console.log('Mentor request received:', mentorRequest);
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(connected);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }

  // Public methods
  public send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  public sendChatMessage(content: string, recipientId?: string, roomId?: string, attachments?: FileAttachment[]): void {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      senderId: 'current-user', // Will be set by backend
      senderName: 'Current User', // Will be set by backend
      recipientId,
      roomId,
      timestamp: new Date().toISOString(),
      type: 'text',
      attachments
    };

    this.send({
      type: 'chat',
      data: message,
      timestamp: new Date().toISOString()
    });
  }

  public sendMentorRequest(
    studentId: string,
    type: 'feedback' | 'consultation' | 'review',
    priority: 'high' | 'medium' | 'low',
    message: string,
    essayId?: string
  ): void {
    const mentorRequest: MentorRequest = {
      id: Date.now().toString(),
      studentId,
      studentName: 'Student Name', // Will be set by backend
      essayId,
      essayTitle: 'Essay Title', // Will be set by backend
      type,
      priority,
      message,
      timestamp: new Date().toISOString()
    };

    this.send({
      type: 'mentor_request',
      data: mentorRequest,
      timestamp: new Date().toISOString()
    });
  }

  public joinRoom(roomId: string): void {
    this.send({
      type: 'system',
      data: { action: 'join_room', roomId },
      timestamp: new Date().toISOString()
    });
  }

  public leaveRoom(roomId: string): void {
    this.send({
      type: 'system',
      data: { action: 'leave_room', roomId },
      timestamp: new Date().toISOString()
    });
  }

  public subscribeToMessageType(type: string, handler: (data: any) => void): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);
  }

  public unsubscribeFromMessageType(type: string, handler: (data: any) => void): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  public onConnectionChange(handler: (connected: boolean) => void): void {
    this.connectionHandlers.push(handler);
  }

  public offConnectionChange(handler: (connected: boolean) => void): void {
    const index = this.connectionHandlers.indexOf(handler);
    if (index > -1) {
      this.connectionHandlers.splice(index, 1);
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 