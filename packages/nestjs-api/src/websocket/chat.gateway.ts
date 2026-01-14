import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { AuthService } from '../auth/auth.service';

interface AuthenticatedSocket extends Socket {
  user?: {
    sessionId: string;
    username: string;
    type: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:19006'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private venueUsers: Map<string, Set<string>> = new Map();

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Authenticate the socket connection
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.authService.verifyToken(token);
      
      if (!payload) {
        client.disconnect();
        return;
      }

      client.user = {
        sessionId: payload.sessionId,
        username: payload.username,
        type: payload.type,
      };

      console.log(`✅ Client connected: ${client.user.username} (${client.id})`);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.user) {
      console.log(`❌ Client disconnected: ${client.user.username} (${client.id})`);
      
      // Remove user from all venue rooms
      this.venueUsers.forEach((users, venueId) => {
        if (users.has(client.id)) {
          users.delete(client.id);
          this.server.to(venueId).emit('user_left', {
            username: client.user.username,
            activeUsers: users.size,
          });
        }
      });
    }
  }

  @SubscribeMessage('join_venue')
  async handleJoinVenue(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { venueId: string },
  ) {
    if (!client.user) {
      return { error: 'Not authenticated' };
    }

    const { venueId } = data;
    
    // Join the venue room
    client.join(venueId);

    // Track user in venue
    if (!this.venueUsers.has(venueId)) {
      this.venueUsers.set(venueId, new Set());
    }
    this.venueUsers.get(venueId).add(client.id);

    // Notify others in the venue
    client.to(venueId).emit('user_joined', {
      username: client.user.username,
      activeUsers: this.venueUsers.get(venueId).size,
    });

    console.log(`👤 ${client.user.username} joined venue ${venueId}`);

    return {
      success: true,
      activeUsers: this.venueUsers.get(venueId).size,
    };
  }

  @SubscribeMessage('leave_venue')
  async handleLeaveVenue(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { venueId: string },
  ) {
    if (!client.user) {
      return { error: 'Not authenticated' };
    }

    const { venueId } = data;
    
    // Leave the venue room
    client.leave(venueId);

    // Remove user from venue tracking
    if (this.venueUsers.has(venueId)) {
      this.venueUsers.get(venueId).delete(client.id);
      
      // Notify others in the venue
      client.to(venueId).emit('user_left', {
        username: client.user.username,
        activeUsers: this.venueUsers.get(venueId).size,
      });
    }

    console.log(`👋 ${client.user.username} left venue ${venueId}`);

    return { success: true };
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { venueId: string; content: string },
  ) {
    if (!client.user) {
      return { error: 'Not authenticated' };
    }

    const { venueId, content } = data;

    // Validate message
    if (!content || content.trim().length === 0) {
      return { error: 'Message cannot be empty' };
    }

    if (content.length > 500) {
      return { error: 'Message too long (max 500 characters)' };
    }

    try {
      // Save message to database (ephemeral)
      const message = await this.chatService.createMessage(
        venueId,
        client.user.sessionId,
        client.user.username,
        content.trim(),
      );

      // Broadcast message to all users in the venue
      this.server.to(venueId).emit('new_message', {
        id: message.id,
        content: message.content,
        username: message.senderUsername,
        createdAt: message.createdAt,
      });

      console.log(`💬 Message from ${client.user.username} in ${venueId}`);

      return { success: true, messageId: message.id };
    } catch (error) {
      console.error('Error sending message:', error);
      return { error: 'Failed to send message' };
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { venueId: string; isTyping: boolean },
  ) {
    if (!client.user) {
      return;
    }

    const { venueId, isTyping } = data;

    // Broadcast typing indicator to others in the venue
    client.to(venueId).emit('user_typing', {
      username: client.user.username,
      isTyping,
    });
  }
}
