import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { VenuesModule } from './venues/venues.module';
import { ChatModule } from './chat/chat.module';
import { SessionsModule } from './sessions/sessions.module';
import { WebsocketModule } from './websocket/websocket.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    VenuesModule,
    ChatModule,
    SessionsModule,
    WebsocketModule,
  ],
})
export class AppModule {}
