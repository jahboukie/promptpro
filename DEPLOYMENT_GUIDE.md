# Deployment Guide

This guide provides instructions for deploying the AI Prompting Tool to production environments.

## Prerequisites

Before deploying, ensure you have:

- Node.js (v20 or later)
- npm (v9 or later)
- PostgreSQL database instance
- Optional: Domain name for production deployment
- Optional: SSL certificate for HTTPS

## Build Process

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

```bash
npm run build
```

This command:
- Transpiles TypeScript code to JavaScript
- Bundles frontend assets with Vite
- Optimizes assets for production
- Outputs the build to the `dist` directory

## Environment Setup

Create a `.env` file for production settings:

```
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Server
PORT=5000
NODE_ENV=production

# Optional: Add any third-party API keys here
# OPENAI_API_KEY=your_api_key
```

## Database Setup

### 1. Create Production Database

Create a PostgreSQL database for production:

```sql
CREATE DATABASE ai_prompting_tool_prod;
```

### 2. Push Database Schema

Use Drizzle to push the schema to the production database:

```bash
npm run db:push
```

### 3. Database Migration Strategy

For future updates, follow this migration strategy:

1. Update the schema in `shared/schema.ts`
2. Use Drizzle to generate and apply migrations:
   ```bash
   npx drizzle-kit generate:pg
   npx drizzle-kit push:pg
   ```

## Deployment Options

### Option 1: Traditional Server Deployment

#### Setup

1. Set up a server (e.g., AWS EC2, DigitalOcean Droplet)
2. Install Node.js on the server
3. Clone the repository
4. Install dependencies and build the application
5. Set up a process manager like PM2

#### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start the application with PM2
pm2 start dist/server/index.js --name ai-prompting-tool

# Set up PM2 to start on system boot
pm2 startup
pm2 save
```

#### Nginx Configuration

Set up Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable HTTPS with Certbot:

```bash
certbot --nginx -d yourdomain.com
```

### Option 2: Docker Deployment

#### 1. Create a Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "dist/server/index.js"]
```

#### 2. Create docker-compose.yml

```yaml
version: '3'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://username:password@db:5432/ai_prompting_tool
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      - POSTGRES_USER=username
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=ai_prompting_tool
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 3. Build and Run with Docker Compose

```bash
docker-compose up -d
```

### Option 3: Platform as a Service (PaaS)

#### Deploying to Render

1. Create a new Web Service on Render
2. Link your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `node dist/server/index.js`
5. Add environment variables including DATABASE_URL
6. Deploy

#### Deploying to Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add a PostgreSQL database service
4. Configure environment variables
5. Set up build and start commands
6. Deploy

## Monitoring and Logging

### Application Logging

The application uses console logging. In production, consider:

1. Using a structured logging library like Winston or Pino
2. Sending logs to a centralized service (e.g., Datadog, New Relic)

Example Winston setup:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export default logger;
```

### Health Checks

Add a health check endpoint to monitor application status:

```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Monitoring Services

Consider using:

- Datadog
- New Relic
- Prometheus + Grafana
- AWS CloudWatch (if using AWS)

## CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Run tests
        run: npm test
        
      # Deploy step will depend on your hosting platform
      - name: Deploy
        run: |
          # Add deployment commands here
```

## Backup Strategy

### Database Backups

1. Set up automated PostgreSQL backups:

```bash
pg_dump -U username -d ai_prompting_tool > backup_$(date +%Y%m%d_%H%M%S).sql
```

2. Schedule with cron:

```
0 0 * * * pg_dump -U username -d ai_prompting_tool > /path/to/backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

3. Consider cloud storage for backups:
   - AWS S3
   - Google Cloud Storage
   - DigitalOcean Spaces

### Disaster Recovery

Document a disaster recovery plan:

1. Regular database backups
2. Infrastructure as code (Terraform, CloudFormation)
3. Documented recovery procedures
4. Periodic recovery testing

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files to version control
- Use secrets management in CI/CD and deployment platforms
- Rotate sensitive credentials regularly

### 2. API Security

- Implement rate limiting
- Add request validation
- Use HTTPS in production
- Implement proper CORS configuration

Example rate limiting with Express:

```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
```

### 3. Authentication

Add a proper authentication system:

- JWT or session-based authentication
- OAuth integration for social logins
- Password hashing with bcrypt
- MFA (Multi-Factor Authentication) for sensitive operations

### 4. Database Security

- Use connection pooling
- Implement least privilege principle
- Encrypt sensitive data
- Regular security audits

## Performance Optimization

### 1. Enable Compression

```typescript
import compression from 'compression';

app.use(compression());
```

### 2. Cache Static Assets

Configure proper caching headers:

```typescript
app.use(express.static('dist/client', {
  maxAge: '1y',
  etag: false
}));
```

### 3. Database Query Optimization

- Add indexes for frequently queried columns
- Use query analysis tools to identify slow queries
- Implement query caching where appropriate

## Scaling Considerations

### Horizontal Scaling

For high-traffic scenarios:

- Deploy multiple application instances behind a load balancer
- Use a centralized session store (Redis)
- Scale database with read replicas

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database configuration for larger servers
- Monitor resource usage and scale as needed

## Post-Deployment Checklist

After deploying:

1. Verify the application loads correctly
2. Check database connectivity
3. Test all critical user flows
4. Monitor error rates and performance
5. Set up alerts for critical issues
6. Document deployment in a changelog