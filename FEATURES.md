# Charlando En La Discoteca - Platform Features

## Overview

Charlando En La Discoteca is a privacy-first, temporary messaging platform designed for nightlife venues, music festivals, and conventions. The platform emphasizes ephemeral communication with auto-expiring sessions and messages.

## Core Principles

1. **Privacy-First**: No permanent user accounts, minimal data collection
2. **Ephemeral**: Sessions and messages auto-expire
3. **Location-Based**: Discover venues based on proximity
4. **Real-Time**: Instant messaging with WebSocket technology
5. **Cross-Platform**: Mobile-first with web support

## Feature Breakdown

### 1. Ephemeral Identity System

#### Current Implementation
- ✅ **Anonymous Sessions**: Users connect without creating accounts
- ✅ **Temporary Usernames**: Auto-generated usernames (e.g., `guest_abc123`)
- ✅ **Auto-Expiring Sessions**: 24-hour session lifetime
- ✅ **JWT Authentication**: Secure, stateless authentication
- ✅ **Session Cleanup**: Automated removal of expired sessions

#### Technical Details
```typescript
// Session Creation
POST /auth/ephemeral
Response: {
  sessionId: "uuid",
  username: "guest_abc123",
  token: "jwt-token",
  expiresAt: "2024-01-15T12:00:00Z"
}
```

#### Privacy Benefits
- No email or phone required
- No password storage
- No tracking across sessions
- Automatic identity reset

### 2. Location-Based Venue Discovery

#### Current Implementation
- ✅ **Geolocation API**: Find venues near user's location
- ✅ **Radius Search**: Customizable search radius (default 5km)
- ✅ **Venue Types**: Nightclub, festival, convention, bar, other
- ✅ **Real-Time Active Users**: See current venue population

#### Technical Details
```typescript
// Find Nearby Venues
GET /venues/nearby?lat=40.7128&lng=-74.0060&radius=5
Response: [
  {
    id: "venue-id",
    name: "The Electric Lounge",
    type: "nightclub",
    latitude: 40.7130,
    longitude: -74.0055,
    distance: 0.3, // km
    activeUsers: 42,
    isActive: true
  }
]
```

#### Planned Enhancements
- 🚧 PostGIS integration for efficient geo-queries
- 🚧 Venue hours/schedule
- 🚧 Event-based temporary venues
- 🚧 Venue capacity limits

### 3. Real-Time Chat System

#### Current Implementation
- ✅ **WebSocket Gateway**: Socket.IO for instant messaging
- ✅ **Venue-Based Rooms**: Separate chat per venue
- ✅ **Message Broadcasting**: Instant delivery to all users in venue
- ✅ **Typing Indicators**: Real-time typing status
- ✅ **User Presence**: Join/leave notifications

#### Technical Details
```typescript
// WebSocket Events
socket.emit('join_venue', { venueId: 'venue-123' });
socket.emit('send_message', { venueId: 'venue-123', content: 'Hello!' });
socket.emit('typing', { venueId: 'venue-123', isTyping: true });

// Server Broadcasts
socket.on('new_message', { id, content, username, createdAt });
socket.on('user_joined', { username, activeUsers });
socket.on('user_typing', { username, isTyping });
```

#### Message Constraints
- Max length: 500 characters
- No file attachments (for privacy)
- Text-only messages
- Real-time moderation ready

#### Planned Enhancements
- 🚧 Message reactions/emoji
- 🚧 Reply threads
- 🚧 User mentions
- 🚧 Media sharing (images, with auto-delete)

### 4. Privacy & Data Management

#### Current Implementation
- ✅ **Limited Message History**: Only last 2 hours visible
- ✅ **Auto-Delete Messages**: 24-hour message retention
- ✅ **Session Cleanup**: Hourly cron job removes expired sessions
- ✅ **No Message Archives**: No long-term storage
- ✅ **Minimal Metadata**: Only essential data stored

#### Data Retention Policy
```typescript
// Message Lifecycle
1. Message created → stored in database
2. Visible for 2 hours → accessible via API
3. After 24 hours → automatically deleted
4. No backups → no recovery possible
```

#### Privacy Features
- No IP address retention (beyond session creation)
- No device fingerprinting
- No cross-session tracking
- No user profiles or history
- No message search or indexing

#### Planned Enhancements
- 🚧 End-to-end encryption (optional)
- 🚧 Self-destructing messages
- 🚧 Venue-close message deletion
- 🚧 GDPR compliance tools

### 5. Mobile Application (React Native)

#### Current Implementation
- ✅ **Cross-Platform**: iOS and Android support
- ✅ **Expo Framework**: Easy development and deployment
- ✅ **Native Navigation**: React Navigation
- ✅ **Socket.IO Client**: Real-time messaging
- ✅ **Shared Types**: Type safety with @charlando/shared

#### Key Screens
1. **Home Screen**: Welcome and session creation
2. **Venue List**: Nearby venues with filters
3. **Chat Screen**: Real-time venue chat
4. **Profile**: Minimal session info

#### Planned Enhancements
- 🚧 Push notifications
- 🚧 Background location updates
- 🚧 Offline mode
- 🚧 Camera integration for QR codes
- 🚧 Native geofencing

### 6. Web Application (Next.js)

#### Current Implementation
- ✅ **Next.js 14**: Modern React framework
- ✅ **Server Components**: Optimal performance
- ✅ **Tailwind CSS**: Responsive design
- ✅ **Socket.IO Client**: Real-time features

#### Use Cases
- Desktop browsing
- Mobile web fallback
- Venue owner dashboards (planned)
- Admin interface (planned)

#### Planned Enhancements
- 🚧 Progressive Web App (PWA)
- 🚧 Venue management dashboard
- 🚧 Analytics interface
- 🚧 Marketing pages

### 7. Backend Architecture (NestJS)

#### Current Implementation
- ✅ **Modular Design**: Separate modules for auth, venues, chat
- ✅ **Dependency Injection**: Clean architecture
- ✅ **Prisma ORM**: Type-safe database access
- ✅ **WebSocket Integration**: Unified REST + WebSocket server
- ✅ **JWT Authentication**: Stateless auth

#### Module Structure
```
src/
├── auth/          # Authentication & sessions
├── venues/        # Location-based venues
├── chat/          # Message handling
├── sessions/      # Session lifecycle
├── websocket/     # Real-time gateway
└── common/        # Shared utilities
```

#### Planned Enhancements
- 🚧 Rate limiting per user
- 🚧 Redis caching
- 🚧 Message queue (Bull)
- 🚧 Microservices architecture

### 8. Database Schema (PostgreSQL + Prisma)

#### Core Models
- **TempSession**: Ephemeral user sessions
- **Lounge**: Venue/location data
- **ChatMessage**: Chat messages (ephemeral)
- **User**: Optional registered users (future)
- **ModerationAction**: Content moderation logs

#### Privacy Considerations
- Minimal foreign keys
- No user profiles
- Automatic cascade deletes
- Time-to-live (TTL) on records

## Security Features

### 1. Authentication & Authorization
- JWT-based authentication
- Short-lived tokens (15 minutes)
- No refresh tokens (by design)
- Session validation on every request

### 2. Input Validation
- Class-validator decorators
- Max message length
- Content sanitization
- XSS prevention

### 3. Rate Limiting
- Per-IP rate limiting (planned)
- Per-session rate limiting (planned)
- WebSocket connection limits

### 4. Data Protection
- Encrypted database connections
- HTTPS in production
- Secure cookie settings
- CORS configuration

## Scalability Considerations

### Current Architecture
- Single NestJS server
- PostgreSQL database
- Socket.IO with memory adapter

### Planned Improvements
- 🚧 Redis for Socket.IO adapter (multi-server)
- 🚧 Database read replicas
- 🚧 CDN for static assets
- 🚧 Load balancing
- 🚧 Horizontal scaling

## Use Cases

### 1. Nightclub/Bar
- Venue creates a temporary chatroom
- Patrons join via location
- Chat active only during operating hours
- Messages deleted at closing time

### 2. Music Festival
- Multiple stage-specific chatrooms
- Temporary festival duration
- High concurrent users
- Auto-delete after festival ends

### 3. Convention/Conference
- Event-specific chatrooms
- Workshop/session discussions
- Networking without contact sharing
- Clean slate after event

### 4. Pop-Up Events
- Short-lived venues
- Flash mob coordination
- Temporary communities
- No digital footprint

## Future Vision

### Phase 1 (Current)
- ✅ Basic ephemeral messaging
- ✅ Location-based venues
- ✅ Mobile and web apps

### Phase 2 (Next 3 months)
- 🚧 Enhanced geolocation
- 🚧 Push notifications
- 🚧 Venue owner dashboards
- 🚧 Advanced moderation

### Phase 3 (6-12 months)
- 🚧 End-to-end encryption
- 🚧 Multi-language support
- 🚧 Event integration
- 🚧 Analytics platform

### Phase 4 (Future)
- 🚧 Monetization (venue features)
- 🚧 API for third parties
- 🚧 White-label solutions
- 🚧 Global expansion

## Technical Requirements

### Development
- Node.js 18+
- PostgreSQL 14+
- iOS Simulator / Android Studio
- Modern web browser

### Production
- Cloud hosting (AWS/GCP/Azure)
- Managed PostgreSQL
- CDN for static assets
- SSL certificates
- Domain name

### Optional Services
- Redis for caching
- Message queue (RabbitMQ/Bull)
- Monitoring (Sentry, Datadog)
- Analytics (Mixpanel, Amplitude)

## Compliance & Legal

### Privacy Compliance
- GDPR-ready architecture
- Minimal data collection
- Right to deletion (automatic)
- No cross-border data transfer

### Content Moderation
- User reporting system (planned)
- Keyword filtering (planned)
- Automated moderation (planned)
- Human review process (planned)

### Terms of Service
- Age verification (18+)
- Content guidelines
- User conduct rules
- Liability disclaimers

## Conclusion

Charlando En La Discoteca is positioned as a privacy-first alternative to permanent social platforms. By focusing on temporary, location-based messaging, it serves the unique needs of nightlife and event-goers while respecting their privacy and digital footprint concerns.

The platform is designed to scale from small venues to large festivals while maintaining its core principle: temporary, anonymous, ephemeral communication.

---

**Last Updated**: January 2026
**Version**: 0.1.0 (Early Stage)
