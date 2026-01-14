import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get recent messages for a venue (limited for privacy)
   * Only returns last 50 messages and messages from last 2 hours
   */
  async getVenueMessages(venueId: string, limit: number = 50) {
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    const messages = await this.prisma.chatMessage.findMany({
      where: {
        loungeId: venueId,
        createdAt: {
          gte: twoHoursAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        content: true,
        createdAt: true,
        senderUsername: true,
      },
    });

    return messages.reverse(); // Return in chronological order
  }

  /**
   * Create a new message (called by WebSocket gateway)
   */
  async createMessage(
    venueId: string,
    sessionId: string,
    username: string,
    content: string,
  ) {
    // Messages are ephemeral - they'll be auto-deleted
    const message = await this.prisma.chatMessage.create({
      data: {
        loungeId: venueId,
        content,
        senderUsername: username,
        senderId: sessionId, // Using sessionId as senderId for anonymous users
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        senderUsername: true,
      },
    });

    return message;
  }

  /**
   * Delete old messages (privacy feature)
   * Should be run periodically to clean up
   */
  async deleteOldMessages(hoursOld: number = 24) {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hoursOld);

    const result = await this.prisma.chatMessage.deleteMany({
      where: {
        createdAt: {
          lt: cutoffTime,
        },
      },
    });

    return {
      deleted: result.count,
      cutoffTime,
    };
  }
}
