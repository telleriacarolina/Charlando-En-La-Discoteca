# Charlando En La Discoteca - Platform Features

**Version:** 0.1.0 (Early Stage)  
**Last Updated:** January 2026

## Overview

Charlando En La Discoteca is a privacy-first, temporary messaging platform designed for nightlife venues, music festivals, and conventions. The platform emphasizes ephemeral communication with auto-expiring sessions and messages.

## Core Principles

1. **Privacy-First**: No permanent user accounts, minimal data collection
2. **Ephemeral**: Sessions and messages auto-expire
3. **Location-Based**: Discover venues based on proximity
4. **Real-Time**: Instant messaging with WebSocket technology
5. **Cross-Platform**: Mobile-first with web support

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
├──────────────────────┬──────────────────────────────────────┤
│  Mobile (iOS/Android)│         Web (Next.js)                │
│  React Native + Expo │      React 18 + Tailwind CSS         │
└──────────┬───────────┴──────────────┬───────────────────────┘
           │                          │
           └────────┬─────────────────┘
                    │ REST + WebSocket
           ┌────────▼─────────────────┐
           │      NestJS API Server   │
           │   (TypeScript Backend)   │
           ├──────────────────────────┤
           │ • Auth Module (JWT)      │
           │ • Venues Module          │
           │ • Chat Module            │
           │ • WebSocket Gateway      │
           │ • Sessions Cron Jobs     │
           └────────┬─────────────────┘
                    │ Prisma ORM
           ┌────────▼─────────────────┐
           │   PostgreSQL Database    │
           │    (Primary Storage)     │
           └──────────────────────────┘

Optional/Planned Dependencies:
  • Redis - Session caching & Socket.IO adapter (multi-server)
  • Bull Queue - Background job processing
  • Sentry - Error tracking & monitoring
  • CDN - Static asset delivery
```

### Key Dependencies
- **PostgreSQL 14+**: Primary data store with auto-delete triggers
- **Prisma ORM**: Type-safe database access and migrations
- **Socket.IO**: WebSocket communication for real-time features
- **Redis** (planned): Caching layer and Socket.IO clustering
- **Bull/RabbitMQ** (planned): Message queue for background jobs

## Data Retention Policy

### Explicit Retention Timelines

| Data Type | Visibility Window | Hard Delete After | Cleanup Method |
|-----------|------------------|-------------------|----------------|
| **Sessions** | 24 hours | 24 hours | Hourly cron job |
| **Messages** | 2 hours (API) | 24 hours | Daily cron job |
| **Venue Data** | Always visible | Never (core data) | Manual admin |
| **IP Addresses** | Session creation only | With session (24h) | Cascade delete |
| **WebSocket Connections** | Real-time only | On disconnect | In-memory cleanup |

### Automated Deletion Process

```typescript
// Hourly Session Cleanup (via @nestjs/schedule)
@Cron(CronExpression.EVERY_HOUR)
async cleanupExpiredSessions() {
  // Delete sessions where expiresAt < now OR inactive > 24h
  await prisma.tempSession.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { isActive: false, lastActivityAt: { lt: yesterday } }
      ]
    }
  });
}

// Daily Message Cleanup
@Cron(CronExpression.EVERY_DAY_AT_3AM)
async cleanupOldMessages() {
  // Delete messages older than 24 hours
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await prisma.chatMessage.deleteMany({
    where: { createdAt: { lt: cutoff } }
  });
}
```

## Feature Breakdown

### 1. Ephemeral Identity System

**Current Implementation:**
- ✅ Anonymous sessions with auto-generated usernames (`guest_abc123`)
- ✅ 24-hour session lifetime with JWT authentication
- ✅ Automated hourly cleanup of expired sessions
- ✅ No email, password, or personal data required

**API Example:**
```typescript
POST /auth/ephemeral
→ { sessionId: "uuid", username: "guest_abc123", token: "jwt", expiresAt: "2024-01-15T12:00:00Z" }
```

**Planned:** End-to-end encryption, self-destructing messages

---

### 2. Location-Based Venue Discovery

**Current Implementation:**
- ✅ Geolocation API with customizable radius (default 5km)
- ✅ Venue types: nightclub, festival, convention, bar, other
- ✅ Real-time active user counts per venue

**API Example:**
```typescript
GET /venues/nearby?lat=40.7128&lng=-74.0060&radius=5
→ [{ id, name, type, latitude, longitude, distance: 0.3, activeUsers: 42, isActive: true }]
```

**Planned:** PostGIS integration, venue hours/schedule, event-based temporary venues

---

### 3. Real-Time Chat System

**Current Implementation:**
- ✅ Socket.IO WebSocket gateway with venue-based rooms
- ✅ Message broadcasting, typing indicators, user presence
- ✅ Message constraints: 500 char max, text-only (no attachments)

**WebSocket Events:**
```typescript
// Client → Server
socket.emit('join_venue', { venueId });
socket.emit('send_message', { venueId, content });
socket.emit('typing', { venueId, isTyping });

// Server → Client
socket.on('new_message', { id, content, username, createdAt });
socket.on('user_joined', { username, activeUsers });
socket.on('user_typing', { username, isTyping });
```

**Planned:** Message reactions, reply threads, media sharing (with auto-delete)

---

### 4. Privacy & Data Management

**Implementation:**
- ✅ Messages visible for 2 hours via API, deleted after 24 hours
- ✅ No message archives, search, or indexing
- ✅ No IP retention beyond session creation
- ✅ No device fingerprinting or cross-session tracking

**See "Data Retention Policy" section above for detailed timelines.**

**Planned:** End-to-end encryption, venue-close message deletion, GDPR tools

---

### 5. Mobile & Web Applications

**Mobile (React Native + Expo):**
- ✅ Cross-platform iOS/Android with native navigation
- ✅ Socket.IO client for real-time features
- ✅ Key screens: Home, Venue Discovery, Chat, Profile
- 🚧 Planned: Push notifications, offline mode, geofencing

**Web (Next.js 14):**
- ✅ Server components, Tailwind CSS, responsive design
- ✅ Use cases: Desktop browsing, mobile fallback, admin dashboards
- 🚧 Planned: PWA support, venue management dashboard

---

### 6. Backend Architecture (NestJS)

**Current Implementation:**
- ✅ Modular design with dependency injection
- ✅ Prisma ORM for type-safe database access
- ✅ Unified REST + WebSocket server (single port)
- ✅ JWT authentication with session validation

**Module Structure:**
```
src/
├── auth/          # Authentication & sessions
├── venues/        # Location-based venues
├── chat/          # Message handling
├── sessions/      # Session lifecycle & cleanup
├── websocket/     # Real-time gateway
└── common/        # Shared utilities, guards, decorators
```

**Planned:** Rate limiting, Redis caching, message queue (Bull), microservices

---

## Security & Compliance

### Security Features
- **Authentication**: JWT with 15-minute token expiry, session validation
- **Input Validation**: Class-validator decorators, XSS prevention, content sanitization
- **Data Protection**: HTTPS, encrypted DB connections, secure cookies, CORS
- **Rate Limiting**: Planned for per-IP and per-session limits

### GDPR Compliance
- **Minimal Data Collection**: No personal identifiable information required
- **Right to Deletion**: Automatic (24-hour retention)
- **Data Portability**: N/A (ephemeral data)
- **No Cross-Border Transfer**: Regional deployment recommended

### Content Moderation (Planned)
- User reporting system
- Keyword filtering
- Automated moderation
- Human review process for edge cases

---

## Scalability & Production

### Current Architecture
- Single NestJS server
- PostgreSQL database
- Socket.IO with in-memory adapter

### Scaling Path
1. **Phase 1 (0-1K users):** Single server deployment
2. **Phase 2 (1K-10K users):** Add Redis for Socket.IO clustering
3. **Phase 3 (10K+ users):** Horizontal scaling with load balancer, database read replicas

**Planned Improvements:**
- Redis for Socket.IO adapter (multi-server WebSocket)
- Database read replicas for query distribution
- CDN for static assets
- Message queue (Bull/RabbitMQ) for background jobs

---

## Use Cases

| Scenario | Implementation | Privacy Benefit |
|----------|---------------|-----------------|
| **Nightclub** | Venue-specific chatroom during operating hours | Messages deleted after venue closes |
| **Festival** | Multi-stage chatrooms for 2-3 day event | All data purged 24h after festival ends |
| **Convention** | Session-specific discussions | Network without sharing personal contacts |
| **Pop-Up Event** | Short-lived temporary community | Zero digital footprint after event |

---

## Roadmap

### Phase 1 - v0.1.0 (Current) ✅
- Basic ephemeral messaging
- Location-based venue discovery
- Mobile and web apps
- Auto-delete sessions and messages

### Phase 2 - v0.2.0 (Next 3 months)
- Push notifications
- Enhanced geolocation with PostGIS
- Venue owner dashboards
- Advanced moderation tools

### Phase 3 - v0.3.0 (6-12 months)
- End-to-end encryption
- Multi-language support
- Event calendar integration
- Analytics platform for venue owners

### Phase 4 - v1.0.0 (Future)
- Monetization (premium venue features)
- Public API for third-party integrations
- White-label solutions
- Global scaling infrastructure

---

## Technical Stack Summary

### Core Technologies
- **Backend:** NestJS (TypeScript), Prisma ORM
- **Database:** PostgreSQL 14+
- **Mobile:** React Native, Expo (~50.0)
- **Web:** Next.js 14, React 18
- **Real-time:** Socket.IO
- **Authentication:** JWT

### Dependencies
- **Required:** Node.js 18+, PostgreSQL 14+
- **Optional:** Redis (caching), Bull (queues), Sentry (monitoring)
- **Development:** TypeScript, ESLint, Prettier

---

## Conclusion

Charlando En La Discoteca prioritizes user privacy through ephemeral-by-design architecture. Unlike traditional social platforms, the system actively deletes data rather than archiving it. This approach serves venues, festivals, and events where temporary, anonymous communication enhances the social experience without creating permanent digital records.

---

**Version:** 0.1.0 (Early Stage)  
**Last Updated:** January 2026  
**License:** MIT
