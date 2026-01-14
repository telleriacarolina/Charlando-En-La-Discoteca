# Charlando En La Discoteca - Developer Setup Guide

A comprehensive guide for setting up and developing the Charlando En La Discoteca project.

## Quick Start

### Prerequisites

- Node.js 18+ (use `nvm use` to switch to the correct version)
- PostgreSQL database
- iOS Simulator (for iOS development) or Android Studio (for Android)
- Expo CLI (installed globally): `npm install -g expo-cli`

### Initial Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp packages/nestjs-api/.env.example packages/nestjs-api/.env
cp packages/mobile/.env.example packages/mobile/.env

# Edit .env files with your configuration

# 3. Set up database
npm run prisma:generate
npm run prisma:migrate

# 4. Start development servers
npm run dev
```

## Project Structure

```
Charlando-En-La-Discoteca/
├── packages/
│   ├── nestjs-api/      # NestJS backend (PRIMARY)
│   ├── mobile/          # React Native app (Expo)
│   ├── web/             # Next.js web app
│   ├── api/             # Express API (legacy)
│   ├── socket/          # Standalone Socket.IO server
│   └── shared/          # Shared types and utilities
└── docs/                # Documentation
```

## Development Workflows

### Working on the NestJS Backend

```bash
# Navigate to NestJS API
cd packages/nestjs-api

# Install dependencies
npm install

# Start development server with hot reload
npm run start:dev

# Run in debug mode
npm run start:debug

# Generate Prisma client after schema changes
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

The NestJS API serves both REST API and WebSocket on port 3001.

### Working on the Mobile App

```bash
# Navigate to mobile package
cd packages/mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web (for testing)
npm run web
```

### Working on the Web Frontend

```bash
# Navigate to web package
cd packages/web

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Access the web app at http://localhost:3000

## Environment Configuration

### NestJS API (.env)

```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/charlando"
JWT_SECRET="your-super-secret-jwt-key"
FRONTEND_URL="http://localhost:3000"
MOBILE_URL="http://localhost:19006"
```

### Mobile App (.env)

```env
API_URL=http://localhost:3001
SOCKET_URL=http://localhost:3001
```

Note: Use `10.0.2.2` instead of `localhost` when testing on Android emulator.

### Web App (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Database Setup

### PostgreSQL Installation

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from https://www.postgresql.org/download/windows/

### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE charlando;
CREATE USER charlando_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE charlando TO charlando_user;
```

### Run Migrations

```bash
cd packages/nestjs-api
npm run prisma:migrate
```

## Testing

### Manual Testing

1. Start all services:
   ```bash
   npm run dev
   ```

2. Test the API:
   ```bash
   # Create ephemeral session
   curl -X POST http://localhost:3001/auth/ephemeral

   # Get nearby venues (with auth token)
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:3001/venues/nearby?lat=40.7128&lng=-74.0060"
   ```

3. Test WebSocket connection:
   - Open browser console at http://localhost:3000
   - Run:
     ```javascript
     const socket = io('http://localhost:3001', {
       auth: { token: 'YOUR_TOKEN' }
     });
     socket.on('connect', () => console.log('Connected!'));
     ```

### Running Automated Tests

```bash
# Run tests for NestJS API
cd packages/nestjs-api
npm run test

# Run tests with coverage
npm run test:cov

# Run tests for mobile app
cd packages/mobile
npm run test
```

## Common Development Tasks

### Adding a New API Endpoint

1. Create the endpoint in the appropriate module:
   ```typescript
   // packages/nestjs-api/src/venues/venues.controller.ts
   @Get('search')
   async searchVenues(@Query('q') query: string) {
     return this.venuesService.search(query);
   }
   ```

2. Implement the service method:
   ```typescript
   // packages/nestjs-api/src/venues/venues.service.ts
   async search(query: string) {
     // Implementation
   }
   ```

3. Test the endpoint
4. Update API documentation

### Adding a New Mobile Screen

1. Create screen component:
   ```bash
   # packages/mobile/src/screens/NewScreen.tsx
   ```

2. Add to navigation:
   ```typescript
   // packages/mobile/src/navigation/AppNavigator.tsx
   ```

3. Test on both iOS and Android

### Database Schema Changes

1. Edit Prisma schema:
   ```prisma
   // packages/nestjs-api/prisma/schema.prisma
   model NewModel {
     id String @id @default(uuid())
     // fields
   }
   ```

2. Create migration:
   ```bash
   cd packages/nestjs-api
   npm run prisma:migrate
   ```

3. Update services to use new model

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)
```

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in .env file
- Test connection: `psql $DATABASE_URL`

### Mobile App Not Connecting to API

- Use correct IP address (not localhost) when testing on physical device
- For Android emulator, use `10.0.2.2` instead of `localhost`
- Ensure backend is running and accessible
- Check firewall settings

### Prisma Client Not Found

```bash
cd packages/nestjs-api
npm run prisma:generate
```

## Development Best Practices

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages (Conventional Commits)
- Add comments for complex logic

### Git Workflow

```bash
# Create feature branch
git checkout -b feat/your-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feat/your-feature

# Create pull request on GitHub
```

### Privacy & Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Test session expiration
- Validate all user inputs
- Review security alerts

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Socket.IO Documentation](https://socket.io/docs/)

## Getting Help

- Check existing documentation in `/docs`
- Review code examples in packages
- Open an issue on GitHub
- Ask in discussions

## Next Steps

After setup:

1. Explore the codebase
2. Run the development servers
3. Test API endpoints
4. Try the mobile app
5. Make your first contribution!
