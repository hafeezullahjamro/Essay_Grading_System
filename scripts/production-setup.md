# CorestoneGrader Production Setup Guide

This guide provides step-by-step instructions for deploying CorestoneGrader in production environments.

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Node.js 18+ installed
- [ ] PostgreSQL database available
- [ ] Domain name configured (optional)
- [ ] SSL certificates obtained (for HTTPS)
- [ ] Firewall configured for ports 80, 443, 5000

### 2. Required API Keys
- [ ] OpenAI API key with sufficient credits
- [ ] Stripe keys (if payment processing enabled)
- [ ] Firebase credentials (if Google authentication enabled)

### 3. System Requirements
- [ ] Minimum 2GB RAM
- [ ] 10GB disk space
- [ ] 2 CPU cores recommended
- [ ] Ubuntu 20.04+ or similar Linux distribution

## Deployment Methods

### Method 1: Docker Deployment (Recommended)

**Advantages:**
- Isolated environment
- Easy scaling
- Consistent deployments
- Built-in health monitoring

**Steps:**
1. Clone repository
2. Configure .env file
3. Run `docker-compose up -d`
4. Access application at http://localhost:5000

**Production Configuration:**
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build: .
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

### Method 2: Manual Deployment

**Steps:**
1. Run deployment script: `./scripts/deploy.sh`
2. Configure systemd service
3. Set up nginx reverse proxy
4. Configure SSL certificates

**System Service Configuration:**
```ini
[Unit]
Description=CorestoneGrader
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/app
EnvironmentFile=/path/to/app/.env
ExecStart=/usr/bin/node dist/server/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

### Method 3: Cloud Platform Deployment

#### Heroku
1. Install Heroku CLI
2. Create new app: `heroku create corestone-grader`
3. Add PostgreSQL addon: `heroku addons:create heroku-postgresql:hobby-dev`
4. Set environment variables: `heroku config:set OPENAI_API_KEY=your-key`
5. Deploy: `git push heroku main`

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure environment variables
3. Add managed PostgreSQL database
4. Deploy automatically

#### AWS/Google Cloud
1. Build Docker image
2. Push to container registry
3. Deploy to ECS/Cloud Run
4. Configure load balancer and database

## Environment Configuration

### Required Variables
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
OPENAI_API_KEY=sk-your-openai-key
SESSION_SECRET=your-secure-session-secret
NODE_ENV=production
PORT=5000
```

### Optional Variables
```env
# Payment Processing
STRIPE_SECRET_KEY=sk_your-stripe-key
VITE_STRIPE_PUBLIC_KEY=pk_your-stripe-key

# Google Authentication
VITE_FIREBASE_API_KEY=your-firebase-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Security Configuration

### SSL/TLS Setup
1. Obtain SSL certificates from Let's Encrypt or certificate authority
2. Configure nginx with SSL
3. Set up automatic certificate renewal

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
}
```

### Firewall Configuration
```bash
# Ubuntu UFW
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Rate Limiting
Configure nginx rate limiting:
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
```

## Database Setup

### PostgreSQL Configuration
1. Create database and user
2. Run initial migration
3. Set up connection pooling
4. Configure backups

```sql
CREATE USER corestone WITH ENCRYPTED PASSWORD 'secure_password';
CREATE DATABASE corestone_grader OWNER corestone;
GRANT ALL PRIVILEGES ON DATABASE corestone_grader TO corestone;
```

### Connection Pooling
```javascript
// Recommended pool settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Monitoring and Logging

### Health Monitoring
- Use `/api/health` endpoint for uptime monitoring
- Configure alerts for downtime
- Monitor response times and error rates

### Application Logging
```javascript
// Production logging configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### System Monitoring
- CPU and memory usage
- Disk space monitoring
- Database performance
- API response times

## Backup Strategy

### Database Backups
```bash
# Daily backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### File Backups
- User uploaded files
- Application logs
- Configuration files

## Performance Optimization

### Application Level
- Enable gzip compression
- Implement Redis caching
- Optimize database queries
- Use CDN for static assets

### Infrastructure Level
- Load balancing
- Auto-scaling
- Database read replicas
- Content delivery network

## Troubleshooting

### Common Issues
1. **Application won't start**
   - Check environment variables
   - Verify database connectivity
   - Review application logs

2. **High memory usage**
   - Monitor for memory leaks
   - Optimize file processing
   - Implement request limiting

3. **Slow response times**
   - Check database performance
   - Monitor OpenAI API latency
   - Review nginx configuration

### Log Analysis
```bash
# View application logs
tail -f /var/log/corestone-grader/app.log

# Monitor nginx access logs
tail -f /var/log/nginx/access.log

# Check system resources
htop
df -h
```

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review security patches
- [ ] Monitor API usage and costs
- [ ] Backup verification
- [ ] Performance analysis

### Security Updates
- Keep Node.js updated
- Update npm packages regularly
- Monitor for security vulnerabilities
- Review access logs for suspicious activity

## Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Session store externalization
- Database connection pooling
- Stateless application design

### Vertical Scaling
- Increase server resources
- Optimize database performance
- Implement caching strategies
- Monitor resource utilization

## Support and Maintenance

### Documentation
- Keep deployment documentation updated
- Document configuration changes
- Maintain runbook for common issues
- Create disaster recovery procedures

### Team Access
- Set up proper user access controls
- Implement SSH key management
- Configure monitoring alerts
- Establish on-call procedures