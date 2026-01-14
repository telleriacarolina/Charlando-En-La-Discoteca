import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Create an ephemeral (temporary) session for anonymous users
   * Perfect for nightlife/festival temporary messaging
   */
  async createEphemeralSession(userAgent?: string, ipAddress?: string) {
    const sessionId = uuidv4();
    const tempUsername = `guest_${Math.random().toString(36).substring(2, 8)}`;
    
    // Create temporary session that expires in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const session = await this.prisma.tempSession.create({
      data: {
        sessionId,
        tempUsername,
        expiresAt,
        userAgent,
        ipAddress,
        isActive: true,
      },
    });

    // Generate JWT token for the ephemeral session
    const token = this.jwtService.sign({
      sessionId: session.sessionId,
      username: session.tempUsername,
      type: 'ephemeral',
    });

    return {
      sessionId: session.sessionId,
      username: session.tempUsername,
      token,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * Validate and refresh an ephemeral session
   */
  async validateEphemeralSession(sessionId: string) {
    const session = await this.prisma.tempSession.findUnique({
      where: { sessionId },
    });

    if (!session || !session.isActive) {
      return null;
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      await this.prisma.tempSession.update({
        where: { sessionId },
        data: { isActive: false },
      });
      return null;
    }

    // Update last activity
    await this.prisma.tempSession.update({
      where: { sessionId },
      data: { lastActivityAt: new Date() },
    });

    return session;
  }

  /**
   * End an ephemeral session
   */
  async endEphemeralSession(sessionId: string) {
    await this.prisma.tempSession.update({
      where: { sessionId },
      data: { isActive: false },
    });

    return { success: true };
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      return null;
    }
  }
}
