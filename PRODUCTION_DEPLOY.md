# Production Deployment Guide - Charlando En La Discoteca

Complete guide for deploying all components of Charlando En La Discoteca to production.

## Quick Deployment (DigitalOcean App Platform)

**Fastest way to deploy:**

1. Fork this repository
2. Create DigitalOcean account
3. Create Managed PostgreSQL database
4. Deploy via App Platform (auto-detects monorepo)
5. Configure environment variables
6. Done! ✅

**Estimated Time**: 15 minutes  
**Cost**: ~$20/month (database + 2 apps)

## Deployment Architecture

```
               ┌──────────────────┐
               │   Users/Clients  │
               └────────┬─────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
   │ iOS App │    │Android  │    │   Web   │
   │  (Expo) │    │  (Expo) │    │(Next.js)│
   └────┬────┘    └────┬────┘    └────┬────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
                   ┌────▼────┐
                   │ NestJS  │
                   │   API   │
                   │ + WebSocket│
                   └────┬────┘
                        │
                   ┌────▼────┐
                   │PostgreSQL│
                   └─────────┘
```

## Platform Options

| Platform | Difficulty | Cost/Month | Notes |
|----------|------------|------------|-------|
| DigitalOcean | Easy | $20+ | Best for beginners |
| AWS | Medium | $25+ | Most scalable |
| Heroku | Easy | $25+ | Simplest setup |
| VPS (Self-hosted) | Hard | $5+ | Most control |
| Docker | Medium | Varies | Good for any cloud |

## Option 1: DigitalOcean (Recommended)

### Step 1: Create Database

1. Go to DigitalOcean → Databases
2. Create PostgreSQL 14 database
3. Choose smallest plan ($15/month)
4. Copy connection string

### Step 2: Deploy API

Create `.do/app.yaml`:
```yaml
name: charlando
databases:
  - name: charlando-db
    engine: PG
    version: "14"

services:
  - name: nestjs-api
    source_dir: packages/nestjs-api
    github:
      repo: your-username/Charlando-En-La-Discoteca
      branch: main
    build_command: npm install && npm run build
    run_command: npm run start:prod
    envs:
      - key: DATABASE_URL
        value: ${charlando-db.DATABASE_URL}
      - key: JWT_SECRET
        value: YOUR_RANDOM_SECRET_KEY
      - key: NODE_ENV
        value: production
    http_port: 3001
```

### Step 3: Deploy Mobile Apps

```bash
cd packages/mobile

# Configure production API URL
# Edit .env
API_URL=https://api.charlando.app

# Build and submit
eas build --platform all --profile production
eas submit --platform ios
eas submit --platform android
```

## Option 2: AWS Elastic Beanstalk

### Deploy NestJS API

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd packages/nestjs-api
eb init -p node.js-18 charlando

# Create environment with database
eb create charlando-prod --database.engine postgres

# Configure environment
eb setenv DATABASE_URL=postgresql://... JWT_SECRET=...

# Deploy
eb deploy
```

## Option 3: Docker Compose

### Complete Docker Setup

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: charlando
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  api:
    build: ./packages/nestjs-api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/charlando
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variables

### NestJS API (Production)

```env
# .env
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL="postgresql://user:password@host:5432/charlando"

# JWT
JWT_SECRET="CHANGE-THIS-TO-RANDOM-64-CHAR-STRING"

# CORS
FRONTEND_URL="https://charlando.app"
MOBILE_URL="https://charlando.app"

# Privacy
SESSION_EXPIRY_HOURS=24
MESSAGE_EXPIRY_HOURS=24
```

### Mobile App (Production)

```env
# .env
API_URL=https://api.charlando.app
SOCKET_URL=https://api.charlando.app
```

### Web App (Production)

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.charlando.app
NEXT_PUBLIC_SOCKET_URL=https://api.charlando.app
```

## SSL Configuration

### Using Let's Encrypt (Free)

```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d api.charlando.app

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration with SSL

```nginx
server {
    listen 443 ssl http2;
    server_name api.charlando.app;

    ssl_certificate /etc/letsencrypt/live/api.charlando.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.charlando.app/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## Mobile App Store Deployment

### iOS App Store

**Requirements:**
- Apple Developer account ($99/year)
- App Store Connect access

**Steps:**

1. **Configure App Identity**
```json
// app.json
{
  "expo": {
    "name": "Charlando",
    "slug": "charlando",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.charlando",
      "buildNumber": "1"
    }
  }
}
```

2. **Build**
```bash
cd packages/mobile
eas build --platform ios --profile production
```

3. **Submit**
```bash
eas submit --platform ios
```

### Google Play Store

**Requirements:**
- Google Play Developer account ($25 one-time)

**Steps:**

1. **Configure**
```json
// app.json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.charlando",
      "versionCode": 1
    }
  }
}
```

2. **Build & Submit**
```bash
eas build --platform android --profile production
eas submit --platform android
```

## Database Setup

### Run Migrations

```bash
cd packages/nestjs-api

# Production migration
npm run prisma:migrate deploy

# Generate client
npm run prisma:generate
```

### Seed Initial Data (Optional)

```bash
# Create seed script
npm run prisma:seed
```

## Post-Deployment Testing

### API Health Check
```bash
curl https://api.charlando.app/health
# Expected: {"status":"ok"}
```

### WebSocket Test
```javascript
// Browser console
const socket = io('https://api.charlando.app', {
  auth: { token: 'YOUR_TOKEN' }
});
socket.on('connect', () => console.log('Connected!'));
```

### Mobile App Test
- Install from TestFlight (iOS) or Internal Testing (Android)
- Create ephemeral session
- Join a venue
- Send a message
- Verify real-time delivery

## Monitoring Setup

### Basic Health Monitoring

```typescript
// Add to NestJS
@Get('health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
  };
}
```

### Log Monitoring

Use PM2 for production logging:
```bash
pm2 start dist/main.js --name charlando
pm2 logs charlando
pm2 monit
```

### Error Tracking with Sentry

```bash
npm install @sentry/nestjs

# main.ts
import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
});
```

## Scaling Considerations

### Horizontal Scaling

For multiple API instances:

1. **Use Redis for Socket.IO adapter**
```typescript
import { RedisIoAdapter } from './redis-io.adapter';

app.useWebSocketAdapter(new RedisIoAdapter(app));
```

2. **Load Balancer Configuration**
   - Enable sticky sessions for WebSocket
   - Health check endpoint: `/health`
   - WebSocket path: `/socket.io/`

### Database Scaling

- Enable connection pooling
- Add read replicas
- Use database connection limit

### CDN Setup

Use Cloudflare or AWS CloudFront for:
- Static assets
- Web app distribution
- DDoS protection

## Backup & Recovery

### Automated Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump charlando > /backups/charlando-$DATE.sql
find /backups -mtime +7 -delete
```

### Disaster Recovery Plan

1. Keep database backups (daily)
2. Document environment variables
3. Version control all code
4. Test restore procedure monthly

## Security Checklist

- [ ] HTTPS enabled everywhere
- [ ] Strong JWT secret (64+ chars)
- [ ] Database credentials secured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Firewall rules configured
- [ ] Regular security updates
- [ ] Session expiration working
- [ ] Message auto-deletion working

## Cost Estimation

### Small Deployment (0-1000 users)
- **DigitalOcean**: $20/month
- **Domain**: $12/year
- **Apple Developer**: $99/year
- **Google Play**: $25 one-time
- **Total First Year**: ~$380

### Medium Deployment (1000-10000 users)
- **AWS/GCP**: $50-100/month
- **Database**: $30/month
- **CDN**: $10/month
- **Monitoring**: $20/month
- **Total**: ~$110-160/month

## Troubleshooting

### API Won't Start
```bash
# Check logs
pm2 logs charlando

# Verify environment
env | grep DATABASE_URL

# Test database connection
psql $DATABASE_URL
```

### WebSocket Issues
- Check CORS settings
- Verify SSL certificate
- Test with `wscat -c wss://api.charlando.app`

### Mobile Build Fails
```bash
# Clear cache
eas build:configure
rm -rf node_modules
npm install
```

## Support Resources

- **Documentation**: See `/docs`
- **Community**: GitHub Discussions
- **Issues**: GitHub Issues
- **Email**: support@charlando.app

---

**Deployment Checklist:**
- [ ] Database created and migrated
- [ ] API deployed and running
- [ ] Web app deployed
- [ ] Mobile apps submitted to stores
- [ ] SSL certificates installed
- [ ] Environment variables configured
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Security review completed
- [ ] Load testing performed

**Last Updated**: January 2026
