import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('venues')
@UseGuards(JwtAuthGuard)
export class VenuesController {
  constructor(private venuesService: VenuesService) {}

  /**
   * Get nearby venues based on location
   * GET /venues/nearby?lat=40.7128&lng=-74.0060&radius=5
   */
  @Get('nearby')
  async getNearbyVenues(
    @Query('lat') latitude: string,
    @Query('lng') longitude: string,
    @Query('radius') radius?: string,
  ) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusKm = radius ? parseFloat(radius) : 5;

    return this.venuesService.getNearbyVenues(lat, lng, radiusKm);
  }

  /**
   * Get venue details by ID
   * GET /venues/:id
   */
  @Get(':id')
  async getVenueById(@Param('id') venueId: string) {
    const venue = await this.venuesService.getVenueById(venueId);
    
    if (!venue) {
      return { error: 'Venue not found' };
    }

    const activeUsers = await this.venuesService.getVenueActiveUsers(venueId);

    return {
      ...venue,
      activeUsers,
    };
  }
}
