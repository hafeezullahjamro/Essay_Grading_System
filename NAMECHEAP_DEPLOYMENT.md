# CorestoneGrader - Complete Namecheap Deployment Guide

## Step 1: Export Your Project Files

### Download All Project Files
Export these essential files from your Replit project:

```
📁 Project Root
├── client/                     # Complete React frontend
├── server/                     # Complete Express backend
├── shared/                     # Shared schemas and types
├── uploads/                    # File upload directory
├── package.json               # Dependencies
├── package-lock.json          # Dependency versions
├── tsconfig.json              # TypeScript config
├── tsconfig.server.json       # Server TypeScript config
├── vite.config.ts             # Build configuration
├── tailwind.config.ts         # Styling config
├── postcss.config.js          # CSS processing
├── drizzle.config.ts          # Database config
├── Dockerfile                 # Docker deployment
├── docker-compose.yml         # Container orchestration
├── .env.example               # Environment template
├── LOCAL_SETUP.md             # Setup instructions
├── BUILD_GUIDE.md             # Deployment guide
├── NAMECHEAP_DEPLOYMENT.md    # This guide
└── README.md                  # Project overview
```

## Step 2: Choose Your Namecheap Hosting Plan

### Recommended Options:

**Option A: Shared Hosting (Budget-friendly)**
- Namecheap Stellar or Stellar Plus
- Upload static build files
- Limited backend functionality

**Option B: VPS Hosting (Recommended)**
- Namecheap VPS (PulsarVPS or higher)
- Full Node.js and database support
- Complete application functionality

**Option C: Dedicated Server**
- Maximum performance and control
- Best for high-traffic applications

## Step 3: VPS Setup (Recommended Path)

### 3.1 Purchase Namecheap VPS
1. Go to [Namecheap VPS](https://www.namecheap.com/hosting/vps/)
2. Choose PulsarVPS or higher plan
3. Select Ubuntu 20.04 or 22.04 LTS
4. Complete purchase and note your credentials

### 3.2 Initial Server Setup
```bash
# Connect to your VPS via SSH
ssh root@YOUR_VPS_IP

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PostgreSQL
apt install postgresql postgresql-contrib -y

# Install PM2 for process management
npm install -g pm2

# Install Nginx for reverse proxy
apt install nginx -y

# Install certbot for SSL
apt install certbot python3-certbot-nginx -y
```

### 3.3 Database Setup
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE corestoneGrader;
CREATE USER corestoneuser WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE corestoneGrader TO corestoneuser;
\q

# Configure PostgreSQL for remote connections
nano /etc/postgresql/12/main/postgresql.conf
# Change: listen_addresses = '*'

nano /etc/postgresql/12/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

# Restart PostgreSQL
systemctl restart postgresql
```

## Step 4: Upload and Deploy Your Application

### 4.1 Upload Project Files
```bash
# Create application directory
mkdir -p /var/www/corestoneGrader
cd /var/www/corestoneGrader

# Upload your project files using SCP or SFTP
# From your local machine:
scp -r ./corestoneGrader/* root@YOUR_VPS_IP:/var/www/corestoneGrader/

# Or use FileZilla/WinSCP for GUI upload
```

### 4.2 Environment Configuration
```bash
# Create production environment file
cp .env.example .env
nano .env

# Configure your environment variables:
```

```env
# Database Configuration
DATABASE_URL=postgresql://corestoneuser:your_secure_password@localhost:5432/corestoneGrader
PGHOST=localhost
PGPORT=5432
PGUSER=corestoneuser
PGPASSWORD=your_secure_password
PGDATABASE=corestoneGrader

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_APP_ID=your-firebase-app-id

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
VITE_STRIPE_PUBLIC_KEY=pk_live_your-stripe-public-key

# Session Configuration
SESSION_SECRET=your-very-secure-random-session-secret-here

# Environment
NODE_ENV=production
```

### 4.3 Install Dependencies and Build
```bash
# Install dependencies
npm ci --production

# Build the application
npm run build

# Run database migrations
npm run db:push
```

### 4.4 Start Application with PM2
```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'corestoneGrader',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/corestoneGrader/error.log',
    out_file: '/var/log/corestoneGrader/out.log',
    log_file: '/var/log/corestoneGrader/combined.log'
  }]
};
```

```bash
# Create log directory
mkdir -p /var/log/corestoneGrader

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Step 5: Domain Configuration

### 5.1 Point Domain to VPS
1. Go to Namecheap Domain Dashboard
2. Select your domain
3. Go to "Advanced DNS" tab
4. Add/Edit these records:

```
Type: A Record
Host: @
Value: YOUR_VPS_IP
TTL: 5 min

Type: A Record  
Host: www
Value: YOUR_VPS_IP
TTL: 5 min

Type: CNAME Record
Host: app
Value: yourdomain.com
TTL: 5 min
```

### 5.2 Configure Nginx
```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/corestoneGrader
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files directly
    location /assets/ {
        alias /var/www/corestoneGrader/dist/client/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # File upload size limit
    client_max_body_size 10M;
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/corestoneGrader /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

## Step 6: SSL Certificate Setup

### 6.1 Install SSL Certificate
```bash
# Get SSL certificate from Let's Encrypt
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
certbot renew --dry-run
```

## Step 7: Firebase Configuration

### 7.1 Update Firebase Settings
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Authentication → Settings → Authorized domains
4. Add your domain: `yourdomain.com`
5. Add www subdomain: `www.yourdomain.com`

## Step 8: Stripe Configuration

### 8.1 Update Stripe Settings
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Switch to Live mode (if using production keys)
3. Go to Settings → Account settings
4. Add your domain to allowed domains

## Step 9: Monitoring and Maintenance

### 9.1 Setup Monitoring
```bash
# Monitor application logs
pm2 logs corestoneGrader

# Monitor system resources
pm2 monit

# Check application status
pm2 status
```

### 9.2 Backup Strategy
```bash
# Create backup script
nano /root/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump corestoneGrader > $BACKUP_DIR/db_backup_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/corestoneGrader

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

```bash
# Make executable and schedule
chmod +x /root/backup.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /root/backup.sh
```

## Step 10: Testing and Verification

### 10.1 Test Your Deployment
1. Visit `https://yourdomain.com`
2. Test user registration and login
3. Test essay grading functionality
4. Test payment processing
5. Test admin panel access
6. Verify all features work correctly

### 10.2 Performance Optimization
```bash
# Enable Gzip compression in Nginx
nano /etc/nginx/nginx.conf

# Add in http block:
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

# Restart Nginx
systemctl restart nginx
```

## Troubleshooting Common Issues

### Database Connection Issues
```bash
# Check PostgreSQL status
systemctl status postgresql

# Check database connection
sudo -u postgres psql -c "SELECT version();"
```

### Application Not Starting
```bash
# Check PM2 logs
pm2 logs corestoneGrader

# Check Node.js version
node --version

# Restart application
pm2 restart corestoneGrader
```

### Domain Not Resolving
```bash
# Check DNS propagation
nslookup yourdomain.com

# Check Nginx status
systemctl status nginx
```

## Security Best Practices

### 10.1 Firewall Configuration
```bash
# Configure UFW firewall
ufw allow ssh
ufw allow 'Nginx Full'
ufw enable
```

### 10.2 Regular Updates
```bash
# Update system packages
apt update && apt upgrade -y

# Update Node.js dependencies
npm audit fix
```

## Support Resources

- **Namecheap Support**: Available 24/7 via live chat
- **VPS Documentation**: [Namecheap VPS Guide](https://www.namecheap.com/support/knowledgebase/category/1066/vps-hosting/)
- **Application Logs**: `/var/log/corestoneGrader/`
- **Nginx Logs**: `/var/log/nginx/`

Your CorestoneGrader application is now fully deployed and ready for production use on Namecheap hosting!