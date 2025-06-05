# CorestoneGrader - Build and Deployment Guide

## Building the Application

### Production Build
```bash
npm run build
```

This creates optimized production files in the `dist` folder.

### Build Output Structure
```
dist/
├── client/           # Frontend build
├── server/           # Backend transpiled
└── assets/          # Static assets
```

## Deployment Options

### 1. Docker Deployment

**Build Docker Image:**
```bash
docker build -t corestoneGrader .
```

**Run with Docker Compose:**
```bash
docker-compose up -d
```

**Environment Variables:**
Set in `docker-compose.yml` or `.env` file.

### 2. Traditional Server Deployment

**Prerequisites:**
- Node.js v18+
- PostgreSQL database
- PM2 or similar process manager

**Steps:**
1. Upload built files to server
2. Install production dependencies: `npm ci --production`
3. Set environment variables
4. Start with PM2: `pm2 start server/index.js --name corestoneGrader`

### 3. Cloud Platform Deployment

**Heroku:**
```bash
git push heroku main
```

**Vercel/Netlify:**
- Frontend only deployment
- Backend requires separate deployment

**Railway/Render:**
- Full-stack deployment
- Connect GitHub repository

## Environment Configuration

### Production Environment Variables
```bash
# Required for production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
OPENAI_API_KEY=sk-live-key
STRIPE_SECRET_KEY=sk_live_key
VITE_STRIPE_PUBLIC_KEY=pk_live_key
SESSION_SECRET=secure-random-string
```

### Security Considerations
- Use strong session secrets (32+ characters)
- Enable HTTPS in production
- Set secure cookie flags
- Configure CORS properly
- Use production database with backups

## Performance Optimization

### Frontend
- Static asset caching (1 year)
- Gzip compression enabled
- Image optimization
- Bundle splitting

### Backend
- Database connection pooling
- API rate limiting
- Response caching
- Error logging

## Monitoring and Logging

### Application Logs
- Express request logging
- Error tracking
- Performance metrics
- User analytics

### Database Monitoring
- Connection pool status
- Query performance
- Storage usage
- Backup verification

## Backup Strategy

### Database Backups
```bash
# Daily automated backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### File Uploads
- Regular backup of uploads directory
- Cloud storage synchronization
- Version control for code

## Health Checks

### Application Health Endpoint
`GET /health` - Returns application status

### Database Health
- Connection verification
- Query response time
- Storage space monitoring

## SSL/TLS Configuration

### Let's Encrypt (Free SSL)
```bash
certbot --nginx -d yourdomain.com
```

### Custom SSL Certificate
- Upload certificate files
- Configure nginx/apache
- Set up auto-renewal

## Domain Configuration

### DNS Settings
```
A Record: @ → Your server IP
CNAME: www → yourdomain.com
```

### Subdomain Setup
```
CNAME: app → yourdomain.com
```

## Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Multiple server instances
- Session store sharing (Redis)

### Database Scaling
- Read replicas
- Connection pooling
- Query optimization

## Rollback Strategy

### Version Control
- Tag releases: `git tag v1.0.0`
- Maintain stable branches
- Document breaking changes

### Database Migrations
- Backup before migrations
- Test migrations on staging
- Rollback procedures documented

## Production Checklist

**Before Deployment:**
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] SSL certificate configured
- [ ] Domain DNS configured
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Error logging enabled
- [ ] Performance testing completed

**After Deployment:**
- [ ] Health checks passing
- [ ] Authentication working
- [ ] Payment processing functional
- [ ] Email notifications working
- [ ] File uploads working
- [ ] Export functionality tested
- [ ] Mobile responsiveness verified

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor security vulnerabilities
- Review application logs
- Performance optimization
- Database maintenance

### Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit

# Build and deploy
npm run build
```

## Support and Troubleshooting

### Common Production Issues

**High Memory Usage**
- Check for memory leaks
- Monitor Node.js heap
- Optimize database queries

**Slow Response Times**
- Enable response caching
- Optimize database indexes
- Review slow query logs

**Authentication Issues**
- Verify session store
- Check cookie configuration
- Validate OAuth settings

### Emergency Procedures

**Application Down**
1. Check server status
2. Review error logs
3. Verify database connection
4. Restart application
5. Check external services

**Data Recovery**
1. Stop application
2. Restore from backup
3. Verify data integrity
4. Restart application
5. Monitor for issues