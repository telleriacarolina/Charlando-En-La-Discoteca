# Charlando En La Discoteca - Quick Reference

## What is it?

A temporary, privacy-first messaging platform for nightlife venues, festivals, and conventions. Users connect anonymously, join location-based chatrooms, and messages automatically disappear. No accounts required.

## Key Features

- ✅ **Ephemeral Sessions** - Anonymous, auto-expiring user sessions (24 hours)
- ✅ **Location-Based Venues** - Discover nearby nightclubs, festivals, conventions
- ✅ **Real-Time Chat** - Instant WebSocket messaging
- ✅ **Privacy-First** - Auto-deleting messages, no history storage
- ✅ **Cross-Platform** - React Native mobile (iOS/Android) + Next.js web

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | NestJS + Express |
| Mobile | React Native + Expo |
| Web | Next.js 14 + React 18 |
| Database | PostgreSQL + Prisma ORM |
| Real-time | Socket.IO |
| Auth | JWT (ephemeral tokens) |

## Quick Commands

### Start Everything
```bash
npm install                 # Install all dependencies
npm run dev:nestjs         # Start NestJS backend (port 3001)
npm run dev:mobile         # Start React Native app
npm run dev:web            # Start Next.js web (port 3000)
```

### Database
```bash
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open database GUI
```

### Development
```bash
cd packages/nestjs-api && npm run start:dev    # NestJS hot reload
cd packages/mobile && npm start                # Expo dev server
cd packages/web && npm run dev                 # Next.js dev server
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Client Apps                          │
├──────────────────────┬──────────────────────────────────┤
│  React Native Mobile │         Next.js Web              │
│  (iOS + Android)     │      (Browser Desktop/Mobile)    │
└──────────┬───────────┴──────────────┬───────────────────┘
           │                          │
           └────────┬─────────────────┘
                    │
           ┌────────▼─────────┐
           │   NestJS API     │
           │   (port 3001)    │
           ├──────────────────┤
           │ REST Endpoints   │
           │ WebSocket Gateway│
           └────────┬─────────┘
                    │
           ┌────────▼─────────┐
           │    PostgreSQL    │
           │   + Prisma ORM   │
           └──────────────────┘
```

## API Endpoints

### Authentication
- `POST /auth/ephemeral` - Create anonymous session
- `GET /auth/validate` - Validate current session
- `POST /auth/logout` - End session

### Venues
- `GET /venues/nearby?lat={}&lng={}&radius={}` - Find nearby venues
- `GET /venues/:id` - Get venue details

### Chat
- `GET /chat/venue/:venueId/messages` - Get recent messages

## WebSocket Events

### Client → Server
- `join_venue` - Join a venue chatroom
- `leave_venue` - Leave a venue chatroom
- `send_message` - Send a message
- `typing` - Typing indicator

### Server → Client
- `user_joined` - User joined venue
- `user_left` - User left venue
- `new_message` - New message received
- `user_typing` - User is typing

## Environment Setup

### Required Files

1. **packages/nestjs-api/.env**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/charlando"
JWT_SECRET="your-secret-key"
PORT=3001
```

2. **packages/mobile/.env**
```env
API_URL=http://localhost:3001
SOCKET_URL=http://localhost:3001
```

3. **packages/web/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Project Structure

```
packages/
├── nestjs-api/       # PRIMARY backend (NestJS)
│   ├── src/
│   │   ├── auth/           # Authentication & sessions
│   │   ├── venues/         # Location-based venues
│   │   ├── chat/           # Chat messages
│   │   ├── sessions/       # Session management
│   │   ├── websocket/      # WebSocket gateway
│   │   └── common/         # Shared utilities
│   └── prisma/             # Database schema
│
├── mobile/           # React Native app
│   └── src/
│       ├── screens/        # App screens
│       ├── contexts/       # React contexts
│       └── services/       # API clients
│
├── web/              # Next.js web app
│   ├── app/                # App router
│   └── components/         # React components
│
└── shared/           # Shared types & utilities
```

## Development Workflow

1. **Start PostgreSQL database**
2. **Run migrations**: `npm run prisma:migrate`
3. **Start NestJS backend**: `npm run dev:nestjs`
4. **Start mobile app**: `npm run dev:mobile`
5. **Start web app** (optional): `npm run dev:web`

## Testing Locally

### Create Session
```bash
curl -X POST http://localhost:3001/auth/ephemeral
# Returns: { sessionId, username, token, expiresAt }
```

### Join Venue
```javascript
const socket = io('http://localhost:3001', {
  auth: { token: 'YOUR_TOKEN' }
});

socket.emit('join_venue', { venueId: 'venue-123' });
```

### Send Message
```javascript
socket.emit('send_message', {
  venueId: 'venue-123',
  content: 'Hello!'
});
```

## Privacy Features

1. **Ephemeral Sessions** - Auto-expire after 24 hours
2. **Message Deletion** - Auto-delete after 24 hours
3. **No History** - Only last 2 hours visible
4. **Anonymous** - No personal info required
5. **Location Privacy** - Proximity-based, not exact location

## Common Issues

### Port Already in Use
```bash
lsof -ti:3001 | xargs kill -9
```

### Prisma Client Not Found
```bash
cd packages/nestjs-api
npm run prisma:generate
```

### Mobile Can't Connect
- Android emulator: use `10.0.2.2` instead of `localhost`
- iOS simulator: use `localhost` or your machine's IP
- Physical device: use your machine's local network IP

## Next Steps

1. ✅ Basic setup complete
2. 📱 Test mobile app on simulator/device
3. 🌐 Test web interface
4. 🔌 Test WebSocket connections
5. 📍 Add real geolocation data
6. 🎨 Customize UI/branding
7. 🚀 Deploy to production

## Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Comprehensive setup instructions
- [README](./README.md) - Project overview
- [NestJS API](./packages/nestjs-api/README.md) - Backend documentation
- [Mobile App](./packages/mobile/README.md) - Mobile app guide

## Resources

- **NestJS**: https://docs.nestjs.com/
- **React Native**: https://reactnative.dev/
- **Expo**: https://docs.expo.dev/
- **Prisma**: https://www.prisma.io/docs/
- **Socket.IO**: https://socket.io/docs/

---

**Ready to start? Run `npm install` then `npm run dev:nestjs`** 🚀
