# @charlando/nestjs-api

NestJS backend API for Charlando En La Discoteca - A privacy-first messaging platform for nightlife, festivals, and conventions.

## Features

- **Ephemeral Sessions**: Temporary, anonymous user sessions that auto-expire
- **Location-Based Venues**: Discover and join nearby venue chatrooms
- **Real-Time Chat**: WebSocket-based instant messaging with Socket.IO
- **Privacy-First**: Automatic message deletion and no history storage
- **TypeScript**: Full type safety with NestJS framework

## Tech Stack

- **NestJS**: Progressive Node.js framework
- **Prisma**: Next-generation ORM for PostgreSQL
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: JSON Web Tokens for authentication
- **PostgreSQL**: Relational database

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your .env file with database credentials
```

### Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### Development

```bash
# Start in development mode with hot reload
npm run start:dev

# Start in debug mode
npm run start:debug
```

The API will be available at `http://localhost:3001`
WebSocket gateway will be available at `ws://localhost:3001`

### Production

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /auth/ephemeral` - Create ephemeral session
- `GET /auth/validate` - Validate current session
- `POST /auth/logout` - End session

### Venues

- `GET /venues/nearby?lat={lat}&lng={lng}&radius={km}` - Get nearby venues
- `GET /venues/:id` - Get venue details

### Chat

- `GET /chat/venue/:venueId/messages` - Get recent messages (last 2 hours)

## WebSocket Events

### Client → Server

- `join_venue` - Join a venue chatroom
  ```json
  { "venueId": "venue-id" }
  ```

- `leave_venue` - Leave a venue chatroom
  ```json
  { "venueId": "venue-id" }
  ```

- `send_message` - Send a message
  ```json
  { "venueId": "venue-id", "content": "Hello!" }
  ```

- `typing` - Broadcast typing indicator
  ```json
  { "venueId": "venue-id", "isTyping": true }
  ```

### Server → Client

- `user_joined` - User joined venue
- `user_left` - User left venue
- `new_message` - New message received
- `user_typing` - User is typing

## Project Structure

```
src/
├── auth/              # Authentication & session management
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── venues/            # Location-based venue management
│   ├── venues.module.ts
│   ├── venues.service.ts
│   └── venues.controller.ts
├── chat/              # Chat message handling
│   ├── chat.module.ts
│   ├── chat.service.ts
│   └── chat.controller.ts
├── sessions/          # Ephemeral session management
│   ├── sessions.module.ts
│   └── sessions.service.ts
├── websocket/         # Real-time WebSocket gateway
│   ├── websocket.module.ts
│   └── chat.gateway.ts
├── common/            # Shared utilities
│   ├── prisma/        # Database service
│   ├── guards/        # Auth guards
│   ├── decorators/    # Custom decorators
│   └── filters/       # Exception filters
├── app.module.ts      # Root application module
└── main.ts            # Application entry point
```

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/charlando"

# Authentication
JWT_SECRET="your-secret-key"

# CORS
FRONTEND_URL="http://localhost:3000"
MOBILE_URL="http://localhost:19006"

# Privacy Settings
SESSION_EXPIRY_HOURS=24
MESSAGE_EXPIRY_HOURS=24
```

## Privacy Features

### Ephemeral Sessions
- Sessions automatically expire after 24 hours
- No permanent user accounts required
- Temporary usernames generated for each session

### Message Privacy
- Messages are automatically deleted after 24 hours
- Only recent messages (last 2 hours) are accessible
- No message history or archives
- Messages deleted when venue closes

### Data Minimization
- No personal information stored
- No IP address retention
- No message metadata beyond essentials

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Linting

```bash
npm run lint
```

## Architecture

This API follows NestJS best practices:

- **Modular Design**: Each feature is a self-contained module
- **Dependency Injection**: Services are injected where needed
- **Guards & Interceptors**: Auth and validation handled declaratively
- **WebSocket Integration**: Real-time features via Socket.IO gateway
- **Database Layer**: Prisma ORM for type-safe database access

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT License - See [LICENSE](../../LICENSE) for details.
