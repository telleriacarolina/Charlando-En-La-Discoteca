import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    // For ephemeral sessions, validate the session is still active
    if (payload.type === 'ephemeral') {
      const session = await this.authService.validateEphemeralSession(payload.sessionId);
      if (!session) {
        throw new UnauthorizedException('Session expired or invalid');
      }
    }

    return {
      sessionId: payload.sessionId,
      username: payload.username,
      type: payload.type,
    };
  }
}
