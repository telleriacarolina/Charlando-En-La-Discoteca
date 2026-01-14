import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export interface Venue {
  id: string;
  name: string;
  type: 'nightclub' | 'festival' | 'convention' | 'bar' | 'other';
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  isActive: boolean;
  activeUntil?: Date;
}

@Injectable()
export class VenuesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get venues near a location
   * Uses geolocation to find nearby venues
   */
  async getNearbyVenues(latitude: number, longitude: number, radiusKm: number = 5) {
    // This is a simplified implementation
    // In production, use PostGIS or a similar solution for efficient geo queries
    
    const venues = await this.prisma.lounge.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
      },
    });

    // For now, return all active venues
    // TODO: Implement proper geospatial filtering
    return venues.map(lounge => ({
      id: lounge.id,
      name: lounge.name,
      type: 'nightclub' as const,
      description: lounge.description,
      isActive: lounge.isActive,
      // Mock location data - replace with real data
      latitude: latitude + (Math.random() - 0.5) * 0.1,
      longitude: longitude + (Math.random() - 0.5) * 0.1,
    }));
  }

  /**
   * Get venue by ID
   */
  async getVenueById(venueId: string) {
    const lounge = await this.prisma.lounge.findUnique({
      where: { id: venueId },
      include: {
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    if (!lounge) {
      return null;
    }

    return {
      id: lounge.id,
      name: lounge.name,
      description: lounge.description,
      isActive: lounge.isActive,
      messageCount: lounge._count.messages,
    };
  }

  /**
   * Get active users count in a venue
   */
  async getVenueActiveUsers(venueId: string): Promise<number> {
    // Count active sessions in this venue
    // This would be tracked via WebSocket connections
    // For now, return a mock count
    return Math.floor(Math.random() * 50) + 1;
  }
}
