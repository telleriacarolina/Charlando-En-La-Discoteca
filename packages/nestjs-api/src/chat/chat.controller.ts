import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  /**
   * Get recent messages for a venue
   * GET /chat/venue/:venueId/messages
   */
  @Get('venue/:venueId/messages')
  async getVenueMessages(
    @Param('venueId') venueId: string,
    @Query('limit') limit?: string,
  ) {
    const messageLimit = limit ? parseInt(limit, 10) : 50;
    return this.chatService.getVenueMessages(venueId, messageLimit);
  }
}
