import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Clean up expired sessions
   * Runs every hour to remove expired ephemeral sessions
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredSessions() {
    const now = new Date();

    const result = await this.prisma.tempSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          {
            AND: [
              { isActive: false },
              { lastActivityAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            ],
          },
        ],
      },
    });

    if (result.count > 0) {
      console.log(`🧹 Cleaned up ${result.count} expired sessions`);
    }

    return result;
  }

  /**
   * Get active session count
   */
  async getActiveSessionCount(): Promise<number> {
    return this.prisma.tempSession.count({
      where: {
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  /**
   * Mark session as inactive
   */
  async deactivateSession(sessionId: string) {
    return this.prisma.tempSession.update({
      where: { sessionId },
      data: { isActive: false },
    });
  }
}
