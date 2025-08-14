# AdmitAI Korea - Production Deployment Guide

## Overview

This guide will help you deploy the AdmitAI Korea application to production with proper security, SSL, and domain configuration.

## Prerequisites

- Domain name (e.g., admitai-korea.com)
- VPS or cloud server (AWS, DigitalOcean, Vultr, etc.)
- Docker and Docker Compose installed
- SSL certificate (Let's Encrypt recommended)

## Step 1: Server Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Docker and Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

### 1.3 Install Nginx (for SSL termination)
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

## Step 2: Domain Configuration

### 2.1 DNS Setup
Point your domain to your server's IP address:
```
A    admitai-korea.com     YOUR_SERVER_IP
A    www.admitai-korea.com YOUR_SERVER_IP
```

### 2.2 SSL Certificate
```bash
# Stop nginx temporarily
sudo systemctl stop nginx

# Get SSL certificate
sudo certbot certonly --standalone -d admitai-korea.com -d www.admitai-korea.com

# Copy certificates to project directory
sudo cp /etc/letsencrypt/live/admitai-korea.com/fullchain.pem ./nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/admitai-korea.com/privkey.pem ./nginx/ssl/key.pem
sudo chown $USER:$USER ./nginx/ssl/cert.pem ./nginx/ssl/key.pem
```

## Step 3: Environment Configuration

### 3.1 Backend Environment
Edit `backend/.env`:
```bash
# Production settings
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://admitai-korea.com

# Database (use production database)
DATABASE_URL="postgresql://prod_user:prod_password@postgres:5432/admitai_korea_prod"

# Redis
REDIS_URL=redis://redis:6379

# JWT (use strong secret)
JWT_SECRET=your-super-strong-production-jwt-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@admitai-korea.com

# File Upload
UPLOAD_MAX_SIZE=10485760
UPLOAD_PATH=./uploads

# Security
CORS_ORIGIN=https://admitai-korea.com
DEBUG=false
LOG_REQUESTS=false
ENABLE_SWAGGER=false
```

### 3.2 Frontend Environment
Edit `frontend/.env`:
```bash
REACT_APP_API_URL=https://admitai-korea.com/api
REACT_APP_ENVIRONMENT=production
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
```

## Step 4: Production Docker Compose

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: admitai-postgres-prod
    environment:
      POSTGRES_DB: admitai_korea_prod
      POSTGRES_USER: prod_user
      POSTGRES_PASSWORD: prod_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - admitai-network
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: admitai-redis-prod
    volumes:
      - redis_data:/data
    networks:
      - admitai-network
    restart: unless-stopped

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    container_name: admitai-backend-prod
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://prod_user:prod_password@postgres:5432/admitai_korea_prod
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-super-strong-production-jwt-secret
      PORT: 5000
    volumes:
      - ./uploads:/app/uploads
    depends_on:
      - postgres
      - redis
    networks:
      - admitai-network
    restart: unless-stopped

  # Frontend React App
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
    container_name: admitai-frontend-prod
    environment:
      REACT_APP_API_URL: https://admitai-korea.com/api
      REACT_APP_ENVIRONMENT: production
    networks:
      - admitai-network
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: admitai-nginx-prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - frontend
      - backend
    networks:
      - admitai-network
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  admitai-network:
    driver: bridge
```

## Step 5: Database Setup

### 5.1 Run Migrations
```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Generate Prisma client
docker-compose -f docker-compose.prod.yml exec backend npx prisma generate
```

### 5.2 Seed Database (Optional)
```bash
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

## Step 6: SSL Renewal

Create a script to renew SSL certificates:
```bash
#!/bin/bash
# renew-ssl.sh

# Stop nginx
docker-compose -f docker-compose.prod.yml stop nginx

# Renew certificate
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/admitai-korea.com/fullchain.pem ./nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/admitai-korea.com/privkey.pem ./nginx/ssl/key.pem
sudo chown $USER:$USER ./nginx/ssl/cert.pem ./nginx/ssl/key.pem

# Restart nginx
docker-compose -f docker-compose.prod.yml start nginx
```

Add to crontab for automatic renewal:
```bash
# Edit crontab
crontab -e

# Add this line (runs twice daily)
0 0,12 * * * /path/to/your/project/renew-ssl.sh
```

## Step 7: Monitoring and Logs

### 7.1 View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

### 7.2 Health Checks
```bash
# Backend health
curl https://admitai-korea.com/api/health

# Frontend
curl https://admitai-korea.com
```

### 7.3 Database Access
```bash
# Access PostgreSQL
docker-compose -f docker-compose.prod.yml exec postgres psql -U prod_user -d admitai_korea_prod

# Access Redis
docker-compose -f docker-compose.prod.yml exec redis redis-cli
```

## Step 8: Backup Strategy

### 8.1 Database Backup
Create backup script:
```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

mkdir -p $BACKUP_DIR

docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U prod_user admitai_korea_prod > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
```

### 8.2 Uploads Backup
```bash
#!/bin/bash
# backup-uploads.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

mkdir -p $BACKUP_DIR

tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz uploads/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "uploads_backup_*.tar.gz" -mtime +7 -delete
```

## Step 9: Performance Optimization

### 9.1 Enable Gzip Compression
Already configured in nginx.conf

### 9.2 Set Up CDN
Consider using Cloudflare or AWS CloudFront for static assets

### 9.3 Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_essays_user_id ON essays(user_id);
CREATE INDEX idx_essays_created_at ON essays(created_at);
CREATE INDEX idx_feedback_essay_id ON feedback(essay_id);
```

## Step 10: Security Checklist

- [ ] Strong JWT secret
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Security headers
- [ ] Regular security updates

## Troubleshooting

### Common Issues

1. **SSL Certificate Issues**
   ```bash
   # Check certificate validity
   openssl x509 -in nginx/ssl/cert.pem -text -noout
   
   # Regenerate if needed
   sudo certbot renew --force-renewal
   ```

2. **Database Connection Issues**
   ```bash
   # Check database logs
   docker-compose -f docker-compose.prod.yml logs postgres
   
   # Test connection
   docker-compose -f docker-compose.prod.yml exec backend npx prisma db push
   ```

3. **Frontend Not Loading**
   ```bash
   # Check frontend logs
   docker-compose -f docker-compose.prod.yml logs frontend
   
   # Check nginx logs
   docker-compose -f docker-compose.prod.yml logs nginx
   ```

### Performance Monitoring

```bash
# Monitor resource usage
docker stats

# Check disk space
df -h

# Monitor logs
tail -f nginx/logs/access.log
tail -f nginx/logs/error.log
```

## Support

For issues and questions:
- Check the logs: `docker-compose -f docker-compose.prod.yml logs`
- Review this deployment guide
- Check the main README.md for additional information 