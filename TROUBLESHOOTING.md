# AdmitAI Korea - Troubleshooting Guide

## Common Issues and Solutions

### 1. Application Not Loading

#### Symptoms:
- Frontend shows blank page or error
- Backend API calls fail
- Domain shows "This site can't be reached"

#### Solutions:

**Check if services are running:**
```bash
# Check all containers
docker-compose ps

# Check specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs nginx
```

**Check if ports are accessible:**
```bash
# Check if ports are listening
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

**Restart services:**
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart frontend
docker-compose restart backend
```

### 2. Database Connection Issues

#### Symptoms:
- Backend logs show database connection errors
- API calls return 500 errors
- Prisma migrations fail

#### Solutions:

**Check database status:**
```bash
# Check if PostgreSQL is running
docker-compose exec postgres pg_isready -U postgres

# Check database logs
docker-compose logs postgres
```

**Reset database:**
```bash
# Stop services
docker-compose down

# Remove database volume
docker volume rm aieducationsystem_postgres_data

# Restart services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy
```

**Check environment variables:**
```bash
# Verify DATABASE_URL in backend/.env
cat backend/.env | grep DATABASE_URL
```

### 3. SSL Certificate Issues

#### Symptoms:
- Browser shows SSL errors
- HTTPS redirects fail
- Mixed content warnings

#### Solutions:

**Check certificate validity:**
```bash
# Check certificate
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Check certificate dates
openssl x509 -in nginx/ssl/cert.pem -noout -dates
```

**Regenerate self-signed certificate (development):**
```bash
# Remove old certificates
rm nginx/ssl/cert.pem nginx/ssl/key.pem

# Generate new certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=AdmitAI/CN=admitai-korea.com"

# Restart nginx
docker-compose restart nginx
```

**For production (Let's Encrypt):**
```bash
# Renew certificate
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/admitai-korea.com/fullchain.pem ./nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/admitai-korea.com/privkey.pem ./nginx/ssl/key.pem
sudo chown $USER:$USER ./nginx/ssl/cert.pem ./nginx/ssl/key.pem

# Restart nginx
docker-compose restart nginx
```

### 4. API Key Issues

#### Symptoms:
- AI features don't work
- OpenAI API errors
- Authentication failures

#### Solutions:

**Check API keys:**
```bash
# Check backend environment
cat backend/.env | grep -E "(OPENAI|JWT|DATABASE)"

# Check frontend environment
cat frontend/.env
```

**Update API keys:**
```bash
# Edit backend environment
nano backend/.env

# Edit frontend environment
nano frontend/.env

# Restart services after changes
docker-compose restart backend frontend
```

### 5. Memory/Resource Issues

#### Symptoms:
- Services crash frequently
- Slow response times
- Docker containers exit unexpectedly

#### Solutions:

**Check resource usage:**
```bash
# Check Docker resource usage
docker stats

# Check system resources
free -h
df -h
top
```

**Increase Docker resources:**
- Open Docker Desktop
- Go to Settings > Resources
- Increase memory and CPU limits

**Optimize containers:**
```bash
# Remove unused containers and images
docker system prune -a

# Remove unused volumes
docker volume prune
```

### 6. Network Issues

#### Symptoms:
- Services can't communicate
- API calls timeout
- CORS errors

#### Solutions:

**Check network connectivity:**
```bash
# Check if containers can reach each other
docker-compose exec backend ping postgres
docker-compose exec backend ping redis

# Check network configuration
docker network ls
docker network inspect aieducationsystem_admitai-network
```

**Fix CORS issues:**
```bash
# Check CORS configuration in backend/.env
cat backend/.env | grep CORS

# Update CORS origin if needed
echo "CORS_ORIGIN=https://your-domain.com" >> backend/.env
docker-compose restart backend
```

### 7. File Upload Issues

#### Symptoms:
- File uploads fail
- Upload directory not accessible
- File size limits exceeded

#### Solutions:

**Check upload directory:**
```bash
# Check if uploads directory exists
ls -la uploads/

# Create if missing
mkdir -p uploads
chmod 755 uploads
```

**Check file size limits:**
```bash
# Check nginx upload limits
grep -r "client_max_body_size" nginx/

# Check backend upload limits
grep -r "UPLOAD_MAX_SIZE" backend/.env
```

**Fix permissions:**
```bash
# Fix upload directory permissions
sudo chown -R $USER:$USER uploads/
chmod -R 755 uploads/
```

### 8. Performance Issues

#### Symptoms:
- Slow page loads
- API response delays
- High resource usage

#### Solutions:

**Enable caching:**
```bash
# Check Redis status
docker-compose exec redis redis-cli ping

# Check Redis logs
docker-compose logs redis
```

**Optimize database:**
```bash
# Check database performance
docker-compose exec postgres psql -U postgres -d admitai_korea -c "SELECT * FROM pg_stat_activity;"

# Add indexes if needed
docker-compose exec postgres psql -U postgres -d admitai_korea -c "CREATE INDEX IF NOT EXISTS idx_essays_user_id ON essays(user_id);"
```

**Monitor logs:**
```bash
# Monitor all logs
docker-compose logs -f

# Monitor specific service
docker-compose logs -f backend | grep -E "(ERROR|WARN|slow)"
```

### 9. Development vs Production Issues

#### Symptoms:
- Different behavior between environments
- Environment-specific errors
- Configuration mismatches

#### Solutions:

**Check environment variables:**
```bash
# Development
docker-compose exec backend env | grep NODE_ENV
docker-compose exec frontend env | grep REACT_APP

# Production
docker-compose -f docker-compose.prod.yml exec backend env | grep NODE_ENV
```

**Use correct docker-compose file:**
```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### 10. Log Analysis

#### Common Log Patterns:

**Backend Errors:**
```bash
# Database connection errors
docker-compose logs backend | grep -i "database\|connection"

# Authentication errors
docker-compose logs backend | grep -i "auth\|jwt\|token"

# API errors
docker-compose logs backend | grep -i "error\|exception"
```

**Frontend Errors:**
```bash
# Build errors
docker-compose logs frontend | grep -i "error\|failed"

# Runtime errors
docker-compose logs frontend | grep -i "uncaught\|exception"
```

**Nginx Errors:**
```bash
# Access logs
tail -f nginx/logs/access.log

# Error logs
tail -f nginx/logs/error.log
```

## Emergency Recovery

### Complete Reset:
```bash
# Stop all services
docker-compose down

# Remove all containers and volumes
docker-compose down -v
docker system prune -a -f

# Rebuild from scratch
./start-dev.sh
```

### Database Recovery:
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres admitai_korea > backup.sql

# Restore from backup
docker-compose exec -T postgres psql -U postgres admitai_korea < backup.sql
```

### Configuration Reset:
```bash
# Reset environment files
cp env.example backend/.env
rm frontend/.env
./start-dev.sh
```

## Getting Help

1. **Check logs first:** Always start by checking the logs
2. **Verify configuration:** Ensure all environment variables are set correctly
3. **Test connectivity:** Verify services can communicate
4. **Check resources:** Ensure sufficient memory and disk space
5. **Review documentation:** Check README.md and PRODUCTION_DEPLOYMENT.md

## Contact Information

For additional support:
- Check the main README.md
- Review PRODUCTION_DEPLOYMENT.md
- Check Docker and service-specific documentation 