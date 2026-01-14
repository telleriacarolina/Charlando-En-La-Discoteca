import { Controller, Post, Get, Body, Headers, Ip, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Create a new ephemeral session
   * POST /auth/ephemeral
   */
  @Post('ephemeral')
  async createEphemeralSession(
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.createEphemeralSession(userAgent, ipAddress);
  }

  /**
   * Validate current session
   * GET /auth/validate
   */
  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validateSession(@CurrentUser() user: any) {
    return {
      valid: true,
      user: {
        sessionId: user.sessionId,
        username: user.username,
        type: user.type,
      },
    };
  }

  /**
   * End ephemeral session
   * POST /auth/logout
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: any) {
    return this.authService.endEphemeralSession(user.sessionId);
  }
}
