# Charlando En La Discoteca

**A temporary, privacy-first messaging platform for nightlife, festivals, and conventions.**

Built with React Native, NestJS, Socket.IO, and PostgreSQL. Featuring ephemeral identities, location-based venue chatrooms, and real-time messaging.

**📦 Monorepo Structure:** This project is fully consolidated with all code in the `packages/` directory.

---

## 📦 Packages

```
Charlando-En-La-Discoteca/
├── packages/
│   ├── nestjs-api/    # NestJS backend REST API (Prisma + PostgreSQL)
│   ├── api/           # Express backend (legacy/migration support)
│   ├── socket/        # WebSocket server (Socket.IO)
│   ├── mobile/        # React Native mobile app (iOS + Android)
│   ├── web/           # Web interface (Next.js 14 + React 18 + TypeScript)
│   └── shared/        # Shared types, schemas, and utilities
├── docs/              # Documentation
└── package.json       # Workspace configuration
```

### Package Details

- **[@charlando/nestjs-api](packages/nestjs-api/)** - NestJS backend with REST API, WebSocket gateway, and Prisma ORM
- **[@charlando/mobile](packages/mobile/)** - React Native mobile application for iOS and Android
- **[@charlando/socket](packages/socket/)** - Standalone WebSocket server (Socket.IO)
- **[@charlando/web](packages/web/)** - Web frontend application (Next.js, React)
- **[@charlando/shared](packages/shared/)** - Shared types, schemas, and utilities

---

## Features

### ✅ Core Platform Features

- **Ephemeral Identities**
  - ✅ Temporary session-based usernames
  - ✅ No permanent account required
  - ✅ Auto-expiring guest sessions
  - ✅ Privacy-first by design

- **Location-Based Venue Chatrooms**
  - ✅ Venue-specific chat spaces
  - ✅ Proximity-based room discovery
  - ✅ Support for nightlife, festivals, and conventions
  - ✅ Real-time presence indicators

- **Real-Time Messaging**
  - ✅ WebSocket-based instant messaging
  - ✅ Socket.IO implementation
  - ✅ Message delivery status
  - ✅ Typing indicators

- **Mobile-First Design**
  - ✅ React Native cross-platform app
  - ✅ Native iOS and Android support
  - ✅ Responsive web interface
  - ✅ Touch-optimized UI

### 🚧 Planned / In Progress

- **Enhanced Privacy Features**
  - 🚧 Automatic message deletion after venue closes
  - 🚧 No message history storage
  - 🚧 Anonymous user profiles
  - 🚧 End-to-end encryption (optional)

- **Venue Management**
  - 🚧 Venue owner dashboard
  - 🚧 Custom venue branding
  - 🚧 Event-based temporary venues
  - 🚧 Venue analytics

- **Advanced Features**
  - 🚧 Multi-language support
  - 🚧 Media sharing (images, videos)
  - 🚧 Push notifications
  - 🚧 User blocking/reporting

---

# The Chatroom

- **Backend:** NestJS, Node.js, Express (legacy), Socket.IO
- **Mobile:** React Native, Expo
- **Frontend:** Next.js 14, React 18, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with ephemeral sessions
- **Real-time Messaging:** Socket.IO with WebSocket
- **Location Services:** Geolocation API
- **UI:** Tailwind CSS, React Native Paper, Lucide icons

This repository contains the source code for The Chatroom, which powers the chatrooms for Charlando En La Discotec.

## Project Structure

Charlando-En-La-Discoteca/
├── packages/
│   ├── nestjs-api/      # NestJS backend API
│   │   ├── src/
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── venues/         # Venue management
│   │   │   ├── chat/           # Chat module
│   │   │   ├── sessions/       # Ephemeral sessions
│   │   │   └── websocket/      # WebSocket gateway
│   │   └── prisma/             # Database schema
│   │
│   ├── mobile/          # React Native mobile app
│   │   ├── src/
│   │   │   ├── screens/        # App screens
│   │   │   ├── components/     # Reusable components
│   │   │   ├── navigation/     # Navigation config
│   │   │   ├── services/       # API & WebSocket clients
│   │   │   └── hooks/          # Custom React hooks
│   │   └── app.json            # Expo configuration
│   │
│   ├── web/             # Next.js web interface
│   ├── socket/          # Standalone Socket.IO server
│   └── shared/          # Shared types and utilities
│
└── docs/                # Documentation

⸻

## Getting Started

### Prerequisites

- Node.js 18+

Note on Node versions:

- This project targets Node 18.x. Newer major versions (e.g., Node 24) can crash due to dependency incompatibilities.
- A `.nvmrc` is provided. If you use `nvm`, run:

```bash
nvm install
nvm use
```

Alternatively, install Node 18 via your preferred manager (asdf/Volta) before running dev scripts.

- PostgreSQL database
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Each package has its own environment configuration:

**API Package** (`packages/api/.env`):

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/chatroom"
ACCESS_TOKEN_SECRET="your-access-secret"
REFRESH_TOKEN_SECRET="your-refresh-secret"
PHONE_ENC_KEY="32-byte-encryption-key"
PORT=3001
```

**Socket Package** (`packages/socket/.env`):

```bash
SOCKET_PORT=3002
FRONTEND_URL="http://localhost:3000"
```

**Web Package** (`packages/web/.env.local`):

```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3002"
```

### 3. Set Up Database

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Run Development Servers


For all project documentation, guides, technical details, and reference, see the [`Chatroom-Details/`](Chatroom-Details/) folder and its `INDEX.md`.

---

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables (see `.env.example` and `docs/`)
3. Set up the database:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

## NPM Scripts

### Development

```bash
npm run dev              # Run all services
npm run dev:api          # API server only
npm run dev:socket       # Socket.IO server only
npm run dev:web          # Next.js frontend only
```

### Production

```bash
npm run build            # Build all packages
npm run build:web        # Build web only
npm run start            # Start all services
npm run start:api        # Start API only
npm run start:socket     # Start Socket.IO only
npm run start:web        # Start Next.js only
```

### Database Setup

```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
```

### Utilities

```bash
npm run clean            # Clean all build artifacts and node_modules
```

## Dev Tips

- Prefer workspace-specific runs: use npm run dev:web, npm run dev:api, and npm run dev:socket to start services individually.
- Avoid npm run dev when you only need one service; it runs dev scripts across all workspaces.
- Expected ports: Web :3000, API :3001, Socket :3002.
- If TypeScript errors appear from other packages, limit scope during web dev as configured in tsconfig.json.

---

### Last updated: December 28, 2025

⸻

## Documentation

**Getting Started:**
- 📖 [Project Summary](./PROJECT_SUMMARY.md) – Complete project overview
- 🚀 [Quick Start Guide](./QUICK_START.md) – Get up and running in minutes
- 🔧 [Setup Guide](./SETUP_GUIDE.md) – Comprehensive development setup
- 📋 [Features](./FEATURES.md) – Detailed feature documentation

**Deployment:**
- 🌐 [Production Deployment](./PRODUCTION_DEPLOY.md) – Deploy to production
- 🍎 [Apple Platforms](./DEPLOYMENT.md) – iOS/iPadOS/macOS deployment

**Architecture:**
- 🏗️ [Architecture Overview](./ARCHITECTURE.md) – Combined approach structure
- 📦 [Package Documentation](./packages/) – Individual package READMEs

**Contributing:**
- 🤝 [Contributing Guide](./CONTRIBUTING.md) – How to contribute
- 📝 [Commit Guidelines](./docs/Commit.md) – Development history

---

## API Overview

### Authentication Routes

- **POST /api/auth/csrf** – Returns CSRF token and sets cookie
- **POST /api/auth/signup** – Register by phone; returns status and userId
  - Body: `phoneNumber`, `firstName`, `lastName`, `birthYear`
- **POST /api/auth/signin** – Authenticate and set `accessToken` + `refreshToken`
  - Body: `phoneNumber`, `password`, `staySignedIn`
- **POST /api/auth/guest** – Create temporary guest session
  - Body: `ageCategory` (`_18PLUS` or `_18PLUS_RED`)
- **POST /api/auth/change-password** – Change password (requires auth)
  - Body: `phoneNumber`, `currentPassword`, `newPassword`
- **POST /api/auth/refresh** – Rotate access token from refresh token
- **POST /api/auth/logout** – Clear tokens and deactivate session

---

## Database Models (Prisma)

- **User** – Account, profile, verification status
- **Session** – Refresh token sessions with expiry
- **TempSession** – Guest sessions
- **IDVerification** – Age/ID checks
- **Lounge** – Chat rooms
- **LanguageRoom** – Language-specific rooms
- **ChatMessage** – Messages with moderation metadata
- **MarketplaceItem** – User content for sale
- **Transaction** – Payments and statuses
- **ModerationAction** – Moderation event log
- **UserReport** – Reporting system
- **AuditLog** – System audit trail

See the full schema in [prisma/schema.prisma](prisma/schema.prisma) and detailed docs in [docs/COMPLETE_CODEBASE.md](docs/COMPLETE_CODEBASE.md).

---

## Security

- **Encryption:** AES-256-GCM for phone numbers
- **CSRF Protection:** Double-submit pattern (header + cookie)
- **Rate Limiting:** `express-rate-limit` on auth, API, and heartbeat endpoints
- **Security Headers:** Helmet enabled on API server
- **Password Hashing:** bcryptjs with strong salt rounds
- **JWT Tokens:** Access (15m) and refresh (30d) with secure secrets

---

## Troubleshooting

- **Prisma errors:** Ensure `DATABASE_URL` is correct and database is reachable. Run `npm run prisma:generate` then `npm run prisma:migrate`.
- **Database connection errors:** Verify PostgreSQL is running and credentials in `.env` are correct.
- **Missing JWT/crypto secrets:** Set `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, and `PHONE_ENC_KEY`.
- **Ports in use:** Adjust `PORT` and `SOCKET_PORT` environment variables or stop conflicting processes.
- **Next.js build issues:** Clear `.next/` directory and retry `npm run next:build`.

---

   ```bash
   npm run dev
   # or run each service individually
   npm run dev:api
   npm run dev:socket
   npm run dev:web
   ```

5. Access the app at http://localhost:3000

---

## More Information

- See [`Chatroom-Details/INDEX.md`](Chatroom-Details/INDEX.md) for a categorized list of all documentation, guides, onboarding, reference, and integration notes

---

## License

MIT License. See [LICENSE](LICENSE) for details.
