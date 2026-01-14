# Charlando En La Discoteca - Project Summary

## Overview

**Charlando En La Discoteca** is a privacy-first, temporary messaging platform designed for nightlife venues, music festivals, and conventions. The platform emphasizes ephemeral communication with auto-expiring sessions and messages.

## What Makes This Different?

Unlike traditional social platforms that store everything forever:
- ✅ **No accounts required** - Users connect anonymously
- ✅ **Messages disappear** - Auto-delete after 24 hours
- ✅ **Sessions expire** - No permanent digital footprint
- ✅ **Location-based** - Find chatrooms near you
- ✅ **Real-time** - Instant messaging with WebSocket

## Perfect For

- 🎵 **Nightclubs & Bars** - Connect with people at the venue
- 🎪 **Music Festivals** - Chat by stage or area
- 🎯 **Conventions** - Network without sharing contacts
- 🎉 **Pop-Up Events** - Temporary communities for temporary events

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Backend | NestJS | REST API + WebSocket server |
| Mobile | React Native + Expo | iOS & Android apps |
| Web | Next.js 14 | Browser-based interface |
| Database | PostgreSQL + Prisma | Data storage with auto-delete |
| Real-time | Socket.IO | WebSocket communication |
| Auth | JWT | Ephemeral session tokens |

## Project Structure

```
Charlando-En-La-Discoteca/
│
├── packages/
│   ├── nestjs-api/          # 🎯 PRIMARY BACKEND
│   │   ├── src/
│   │   │   ├── auth/        # Ephemeral authentication
│   │   │   ├── venues/      # Location-based venues
│   │   │   ├── chat/        # Message handling
│   │   │   ├── sessions/    # Session lifecycle
│   │   │   ├── websocket/   # Real-time gateway
│   │   │   └── common/      # Shared utilities
│   │   └── prisma/          # Database schema
│   │
│   ├── mobile/              # 📱 REACT NATIVE APP
│   │   ├── src/
│   │   │   ├── screens/     # App screens
│   │   │   ├── contexts/    # State management
│   │   │   └── services/    # API clients
│   │   └── app.json         # Expo config
│   │
│   ├── web/                 # 🌐 NEXT.JS WEB APP
│   │   ├── app/             # App router
│   │   └── components/      # React components
│   │
│   ├── shared/              # 🔧 SHARED UTILITIES
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Common functions
│   │
│   ├── api/                 # (Legacy Express API)
│   └── socket/              # (Standalone Socket.IO)
│
├── docs/                    # Documentation
│
└── [Root Config Files]
    ├── package.json         # Workspace config
    ├── README.md            # Main documentation
    ├── SETUP_GUIDE.md       # Development setup
    ├── QUICK_START.md       # Quick reference
    ├── FEATURES.md          # Feature details
    └── PRODUCTION_DEPLOY.md # Deployment guide
```

## Quick Start (3 Steps)

### 1. Install Dependencies
```bash
git clone https://github.com/telleriacarolina/Charlando-En-La-Discoteca.git
cd Charlando-En-La-Discoteca
npm install
```

### 2. Setup Database
```bash
# Configure environment
cp packages/nestjs-api/.env.example packages/nestjs-api/.env
# Edit .env with your PostgreSQL credentials

# Run migrations
npm run prisma:generate
npm run prisma:migrate
```

### 3. Start Development
```bash
# Terminal 1: Backend
npm run dev:nestjs

# Terminal 2: Mobile App
npm run dev:mobile

# Terminal 3: Web App (optional)
npm run dev:web
```

That's it! 🚀

## Key Features Implemented

### 1. Ephemeral Authentication
```typescript
// Create anonymous session
POST /auth/ephemeral
→ { sessionId, username: "guest_abc123", token, expiresAt }

// Sessions auto-expire after 24 hours
// No password, no email, no tracking
```

### 2. Location-Based Venues
```typescript
// Find nearby venues
GET /venues/nearby?lat=40.7128&lng=-74.0060&radius=5
→ [{ id, name, type, distance, activeUsers }]

// Join venue chatroom
socket.emit('join_venue', { venueId })
```

### 3. Real-Time Messaging
```typescript
// Send message
socket.emit('send_message', {
  venueId: 'venue-123',
  content: 'Hello!'
})

// Receive messages
socket.on('new_message', message => {
  // Display in chat
})
```

### 4. Privacy Features
- Messages visible for 2 hours only
- Auto-delete after 24 hours
- Hourly session cleanup
- No message archives
- No user profiles

## Development Workflow

### Working on Backend
```bash
cd packages/nestjs-api
npm run start:dev        # Hot reload
npm run prisma:studio    # Database GUI
npm run test             # Run tests
```

### Working on Mobile
```bash
cd packages/mobile
npm start               # Expo dev server
npm run ios            # iOS simulator
npm run android        # Android emulator
```

### Working on Web
```bash
cd packages/web
npm run dev            # Next.js dev server
```

## API Endpoints

### Authentication
- `POST /auth/ephemeral` - Create session
- `GET /auth/validate` - Validate token
- `POST /auth/logout` - End session

### Venues
- `GET /venues/nearby` - Find nearby venues
- `GET /venues/:id` - Get venue details

### Chat
- `GET /chat/venue/:venueId/messages` - Recent messages

### WebSocket Events
- `join_venue` - Join chatroom
- `send_message` - Send message
- `typing` - Typing indicator
- `new_message` - Receive message
- `user_joined` - User joined
- `user_left` - User left

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/charlando"
JWT_SECRET="your-secret-key"
PORT=3001
```

### Mobile (.env)
```env
API_URL=http://localhost:3001
SOCKET_URL=http://localhost:3001
```

### Web (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Documentation

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project overview |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Comprehensive setup guide |
| [QUICK_START.md](./QUICK_START.md) | Quick reference |
| [FEATURES.md](./FEATURES.md) | Detailed features |
| [PRODUCTION_DEPLOY.md](./PRODUCTION_DEPLOY.md) | Deployment guide |
| [packages/nestjs-api/README.md](./packages/nestjs-api/README.md) | Backend API docs |
| [packages/mobile/README.md](./packages/mobile/README.md) | Mobile app docs |

## Testing

### Manual Testing
1. Start backend: `npm run dev:nestjs`
2. Create session: `curl -X POST http://localhost:3001/auth/ephemeral`
3. Test WebSocket with token
4. Run mobile app on simulator

### Automated Testing
```bash
cd packages/nestjs-api
npm run test           # Unit tests
npm run test:cov       # Coverage
npm run test:e2e       # E2E tests
```

## Deployment

### Quick Deploy (DigitalOcean)
1. Create managed PostgreSQL
2. Deploy via App Platform
3. Configure environment variables
4. Done! (~15 minutes)

### Production Deploy
See [PRODUCTION_DEPLOY.md](./PRODUCTION_DEPLOY.md) for complete guide covering:
- AWS Elastic Beanstalk
- Docker deployment
- Mobile app stores (iOS & Android)
- SSL setup
- Monitoring

## Privacy & Security

### Built-In Privacy
- ✅ No permanent accounts
- ✅ Anonymous usernames
- ✅ Auto-expiring sessions (24h)
- ✅ Auto-deleting messages (24h)
- ✅ Limited history (2 hours)
- ✅ No cross-session tracking
- ✅ Minimal data collection

### Security Features
- ✅ JWT authentication
- ✅ HTTPS in production
- ✅ Input validation
- ✅ Rate limiting ready
- ✅ CORS configuration
- ✅ Secure cookies

## Roadmap

### Phase 1 (Current) ✅
- Ephemeral messaging
- Location-based venues
- Real-time chat
- Mobile & web apps

### Phase 2 (Next 3 months)
- 🚧 Push notifications
- 🚧 Enhanced geolocation
- 🚧 Venue owner dashboard
- 🚧 Content moderation

### Phase 3 (6-12 months)
- 🚧 End-to-end encryption
- 🚧 Multi-language support
- 🚧 Event integration
- 🚧 Analytics platform

## Use Cases

### Nightclub
- Venue opens at 9 PM
- Chatroom automatically activates
- People connect and chat
- Venue closes at 3 AM
- Messages deleted by 3 AM next day

### Music Festival
- Multi-day event
- Stage-specific chatrooms
- Connect with other attendees
- All messages deleted after festival

### Convention
- Session-specific discussions
- Networking without sharing contacts
- Everything disappears after event

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feat/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feat/amazing-feature`
5. Open Pull Request

## License

MIT License - See [LICENSE](./LICENSE) for details.

## Support

- **Documentation**: Check `/docs` directory
- **Issues**: [GitHub Issues](https://github.com/telleriacarolina/Charlando-En-La-Discoteca/issues)
- **Discussions**: [GitHub Discussions](https://github.com/telleriacarolina/Charlando-En-La-Discoteca/discussions)

## Credits

Built with:
- [NestJS](https://nestjs.com/) - Backend framework
- [React Native](https://reactnative.dev/) - Mobile framework
- [Expo](https://expo.dev/) - Mobile development platform
- [Next.js](https://nextjs.org/) - Web framework
- [Prisma](https://prisma.io/) - Database ORM
- [Socket.IO](https://socket.io/) - WebSocket library
- [PostgreSQL](https://postgresql.org/) - Database

---

## Ready to Start?

```bash
# Clone and install
git clone https://github.com/telleriacarolina/Charlando-En-La-Discoteca.git
cd Charlando-En-La-Discoteca
npm install

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start developing
npm run dev:nestjs
npm run dev:mobile
```

**Welcome to Charlando En La Discoteca!** 🎉

---

**Project Status**: Early Stage (v0.1.0)  
**Last Updated**: January 2026
