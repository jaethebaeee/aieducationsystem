import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface WebSocketMessage<T = unknown> {
  type: 'chat' | 'notification' | 'essay_update' | 'feedback' | 'mentor_request' | 'system';
  data: T;
  timestamp: string;
  senderId?: string;
  recipientId?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  recipientId?: string | undefined;
  roomId?: string | undefined;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  attachments?: FileAttachment[] | undefined;
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

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  userRole?: string;
  isAlive?: boolean;
}

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, AuthenticatedWebSocket> = new Map();
  private rooms: Map<string, Set<string>> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startHeartbeat();
  }

  // TODO: Type the server parameter more strictly if possible
  public initialize(server: any): void {
    this.wss = new WebSocketServer({ 
      server: server as any,
      path: '/ws'
    });

    this.wss.on('connection', (ws: AuthenticatedWebSocket, request: IncomingMessage) => {
      this.handleConnection(ws, request);
    });

    logger.info('WebSocket server initialized');
  }

  private async handleConnection(ws: AuthenticatedWebSocket, request: IncomingMessage): Promise<void> {
    try {
      // Extract token from query parameters
      const url = new URL(request.url!, `http://${request.headers.host}`);
      const token = url.searchParams.get('token');

      if (!token) {
        ws.close(1008, 'Authentication token required');
        return;
      }

      // Verify JWT token
      interface JwtPayload { userId: string; role: string; }
      const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as JwtPayload;
      ws.userId = decoded.userId;
      ws.userRole = decoded.role;
      ws.isAlive = true;

      // Add client to map
      if (ws.userId) {
        this.clients.set(ws.userId, ws);

        // Send welcome message
        this.sendToClient(ws.userId, {
          type: 'system',
          data: { 
            action: 'connected',
            message: 'Connected to AdmitAI Korea WebSocket server',
            userId: ws.userId,
            userRole: ws.userRole
          },
          timestamp: new Date().toISOString()
        });
      }

      // Set up message handler
      ws.on('message', (data: Buffer) => {
        this.handleMessage(ws, data);
      });

      // Set up close handler
      ws.on('close', (code: number, reason: Buffer) => {
        this.handleDisconnection(ws, code, reason.toString());
      });

      // Set up error handler
      ws.on('error', (error: Error) => {
        logger.error('WebSocket error:', error);
        this.handleDisconnection(ws, 1011, 'Internal error');
      });

      // Set up pong handler for heartbeat
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      logger.info(`WebSocket client connected: ${ws.userId} (${ws.userRole})`);

    } catch (error) {
      logger.error('WebSocket authentication error:', error);
      ws.close(1008, 'Authentication failed');
    }
  }

  private handleMessage(ws: AuthenticatedWebSocket, data: Buffer): void {
    try {
      const message: WebSocketMessage = JSON.parse(data.toString());
      
      // Validate message structure
      if (!message.type || !message.timestamp) {
        this.sendToClient(ws.userId!, {
          type: 'system',
          data: { action: 'error', message: 'Invalid message format' },
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Handle different message types
      switch (message.type) {
        case 'chat':
          this.handleChatMessage(ws, message.data as ChatMessage);
          break;
        case 'system':
          this.handleSystemMessage(ws, message.data);
          break;
        case 'mentor_request':
          this.handleMentorRequest(ws, message.data as MentorRequest);
          break;
        default:
          logger.warn(`Unknown message type: ${message.type}`);
      }

    } catch (error) {
      logger.error('Error handling WebSocket message:', error);
      this.sendToClient(ws.userId!, {
        type: 'system',
        data: { action: 'error', message: 'Failed to process message' },
        timestamp: new Date().toISOString()
      });
    }
  }

  private async handleChatMessage(ws: AuthenticatedWebSocket, chatMessage: ChatMessage): Promise<void> {
    try {
      // Get user information
      const user = await prisma.user.findUnique({
        where: { id: ws.userId! },
        select: { firstName: true, lastName: true }
      });

      if (!user) {
        return;
      }

      // For now, we'll just broadcast the message without saving to database
      // since chatMessage model doesn't exist in Prisma schema yet
      const broadcastMessage: ChatMessage = {
        id: `msg_${Date.now()}_${ws.userId}`,
        content: chatMessage.content,
        senderId: ws.userId!,
        senderName: `${user.firstName} ${user.lastName}`,
        recipientId: chatMessage.recipientId,
        roomId: chatMessage.roomId,
        timestamp: new Date().toISOString(),
        type: chatMessage.type,
        attachments: chatMessage.attachments
      };

      // Send to recipient or room
      if (chatMessage.recipientId) {
        this.sendToClient(chatMessage.recipientId, {
          type: 'chat',
          data: broadcastMessage,
          timestamp: new Date().toISOString()
        });
      } else if (chatMessage.roomId) {
        this.sendToRoom(chatMessage.roomId, {
          type: 'chat',
          data: broadcastMessage,
          timestamp: new Date().toISOString()
        });
      }

      logger.info(`Chat message sent from ${ws.userId} to ${chatMessage.recipientId || chatMessage.roomId}`);

    } catch (error) {
      logger.error('Error handling chat message:', error);
    }
  }

  // TODO: Define a more specific type for system message data
  private handleSystemMessage(ws: AuthenticatedWebSocket, data: any): void {
    switch (data.action) {
      case 'ping':
        this.sendToClient(ws.userId!, {
          type: 'system',
          data: { action: 'pong' },
          timestamp: new Date().toISOString()
        });
        break;
      case 'join_room':
        this.joinRoom(ws.userId!, data.roomId!);
        break;
      case 'leave_room':
        this.leaveRoom(ws.userId!, data.roomId!);
        break;
      default:
        logger.warn(`Unknown system action: ${data.action}`);
    }
  }

  private async handleMentorRequest(ws: AuthenticatedWebSocket, mentorRequest: MentorRequest): Promise<void> {
    try {
      // Get user information
      const user = await prisma.user.findUnique({
        where: { id: ws.userId! },
        select: { firstName: true, lastName: true }
      });

      if (!user) {
        return;
      }

      // For now, we'll just send notifications without saving to database
      // since mentorRequest model doesn't exist in Prisma schema yet
      const requestId = `req_${Date.now()}_${ws.userId}`;

      // Find mentors to notify
      const mentors = await prisma.user.findMany({
        where: { role: 'MENTOR' },
        select: { id: true }
      });

      // Send notification to all mentors
      const notificationMessage: NotificationMessage = {
        id: requestId,
        type: 'mentor',
        title: 'New Mentor Request',
        message: `${user.firstName} ${user.lastName} has requested ${mentorRequest.type} assistance`,
        priority: mentorRequest.priority,
        actionUrl: `/mentor/requests/${requestId}`,
        timestamp: new Date().toISOString()
      };

      mentors.forEach((mentor: { id: string }) => {
        this.sendToClient(mentor.id, {
          type: 'notification',
          data: notificationMessage,
          timestamp: new Date().toISOString()
        });
      });

      logger.info(`Mentor request created by ${ws.userId} and sent to ${mentors.length} mentors`);

    } catch (error) {
      logger.error('Error handling mentor request:', error);
    }
  }

  private handleDisconnection(ws: AuthenticatedWebSocket, code: number, reason: string): void {
    if (ws.userId) {
      this.clients.delete(ws.userId);
      
      // Remove from all rooms
      this.rooms.forEach((members, roomId) => {
        members.delete(ws.userId!);
        if (members.size === 0) {
          this.rooms.delete(roomId);
        }
      });

      logger.info(`WebSocket client disconnected: ${ws.userId} (${code}: ${reason})`);
    }
  }

  private joinRoom(userId: string, roomId: string): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(userId);

    this.sendToClient(userId, {
      type: 'system',
      data: { action: 'joined_room', roomId },
      timestamp: new Date().toISOString()
    });

    logger.info(`User ${userId} joined room ${roomId}`);
  }

  private leaveRoom(userId: string, roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(userId);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }

    this.sendToClient(userId, {
      type: 'system',
      data: { action: 'left_room', roomId },
      timestamp: new Date().toISOString()
    });

    logger.info(`User ${userId} left room ${roomId}`);
  }

  private sendToRoom(roomId: string, message: WebSocketMessage): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.forEach(userId => {
        this.sendToClient(userId, message);
      });
    }
  }

  private sendToClient(userId: string, message: WebSocketMessage): void {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(message));
      } catch (error) {
        logger.error(`Error sending message to ${userId}:`, error);
        this.clients.delete(userId);
      }
    }
  }

  // Public methods for external use
  public sendNotification(userId: string, notification: NotificationMessage): void {
    this.sendToClient(userId, {
      type: 'notification',
      data: notification,
      timestamp: new Date().toISOString()
    });
  }

  public sendEssayUpdate(userId: string, essayUpdate: EssayUpdate): void {
    this.sendToClient(userId, {
      type: 'essay_update',
      data: essayUpdate,
      timestamp: new Date().toISOString()
    });
  }

  public sendFeedbackUpdate(userId: string, feedbackUpdate: FeedbackUpdate): void {
    this.sendToClient(userId, {
      type: 'feedback',
      data: feedbackUpdate,
      timestamp: new Date().toISOString()
    });
  }

  public broadcastToRole(role: string, message: WebSocketMessage): void {
    this.clients.forEach((client, userId) => {
      if (client.userRole === role) {
        this.sendToClient(userId, message);
      }
    });
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client, userId) => {
        if (client.isAlive === false) {
          logger.info(`Terminating inactive connection: ${userId}`);
          this.clients.delete(userId);
          return client.terminate();
        }

        client.isAlive = false;
        client.ping();
      });
    }, 30000); // Check every 30 seconds
  }

  public getStats(): { connectedClients: number; activeRooms: number; totalRooms: number } {
    return {
      connectedClients: this.clients.size,
      activeRooms: this.rooms.size,
      totalRooms: Array.from(this.rooms.values()).reduce((acc, room) => acc + room.size, 0)
    };
  }

  public shutdown(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.clients.forEach(client => {
      client.close(1001, 'Server shutdown');
    });

    this.clients.clear();
    this.rooms.clear();

    if (this.wss) {
      this.wss.close();
    }

    logger.info('WebSocket server shutdown complete');
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 