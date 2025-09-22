# CalcInvest Deployment Guide

## Overview

This guide covers the deployment of CalcInvest, a full-stack investment calculation platform. The application consists of a React frontend, Node.js/Express backend, PostgreSQL database, Redis cache, and supporting services.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │────│      Nginx      │────│   Frontend      │
│   (Cloudflare)  │    │   (Reverse      │    │   (React)       │
└─────────────────┘    │    Proxy)       │    └─────────────────┘
                       └─────────────────┘              │
                                 │                       │
                       ┌─────────────────┐              │
                       │    Backend      │──────────────┘
                       │  (Node.js/      │
                       │   Express)      │
                       └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
          ┌─────────────────┐    │   ┌─────────────────┐
          │   PostgreSQL    │────┘   │     Redis       │
          │   (Database)    │        │    (Cache)      │
          └─────────────────┘        └─────────────────┘
```

## Prerequisites

### System Requirements

**Minimum Requirements:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD
- OS: Ubuntu 20.04+ / CentOS 8+ / Amazon Linux 2

**Recommended for Production:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 50GB+ SSD
- OS: Ubuntu 22.04 LTS

### Software Dependencies

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for local development)
- Git
- SSL certificates (Let's Encrypt recommended)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/calcinvest.git
cd calcinvest
```

### 2. Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```bash
# Application
NODE_ENV=production
APP_NAME=CalcInvest
APP_URL=https://calcinvest.com
API_URL=https://api.calcinvest.com
PORT=3000

# Database
DATABASE_URL=postgresql://username:password@postgres:5432/calcinvest
POSTGRES_DB=calcinvest
POSTGRES_USER=calcinvest_user
POSTGRES_PASSWORD=secure_password_here

# Redis
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=redis_password_here

# JWT
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=7d

# External APIs
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
FINNHUB_API_KEY=your_finnhub_key
YAHOO_FINANCE_API_KEY=your_yahoo_finance_key

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@calcinvest.com

# File Upload
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=calcinvest-uploads

# Monitoring
SENTRY_DSN=your_sentry_dsn
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# SSL
SSL_CERT_PATH=/etc/nginx/ssl/calcinvest.com.crt
SSL_KEY_PATH=/etc/nginx/ssl/calcinvest.com.key
```

## Deployment Methods

### Method 1: Docker Compose (Recommended)

#### Production Deployment

1. **Build and start services:**

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

2. **Initialize database:**

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

# Seed initial data (optional)
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

3. **Verify deployment:**

```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Development Deployment

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f
```

### Method 2: Manual Deployment

#### 1. Database Setup

**Install PostgreSQL:**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

**Create database and user:**

```sql
sudo -u postgres psql

CREATE DATABASE calcinvest;
CREATE USER calcinvest_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE calcinvest TO calcinvest_user;
\q
```

#### 2. Redis Setup

```bash
# Ubuntu/Debian
sudo apt install redis-server

# CentOS/RHEL
sudo yum install redis

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: requirepass your_redis_password

sudo systemctl enable redis
sudo systemctl start redis
```

#### 3. Backend Deployment

```bash
cd backend

# Install dependencies
npm ci --production

# Build application
npm run build

# Run migrations
npm run migrate

# Start with PM2
npm install -g pm2
pm2 start ecosystem.config.js --env production
```

#### 4. Frontend Deployment

```bash
cd frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Serve with nginx (see nginx configuration below)
```

#### 5. Nginx Configuration

Copy the production nginx configuration:

```bash
sudo cp nginx/nginx.prod.conf /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate Setup

### Using Let's Encrypt (Recommended)

1. **Install Certbot:**

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

2. **Obtain certificates:**

```bash
sudo certbot --nginx -d calcinvest.com -d www.calcinvest.com -d api.calcinvest.com
```

3. **Auto-renewal:**

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### Using Custom Certificates

1. **Copy certificates:**

```bash
sudo mkdir -p /etc/nginx/ssl
sudo cp your-certificate.crt /etc/nginx/ssl/calcinvest.com.crt
sudo cp your-private-key.key /etc/nginx/ssl/calcinvest.com.key
sudo chmod 600 /etc/nginx/ssl/*
```

## Database Management

### Migrations

```bash
# Run pending migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Reset database (DANGER: destroys all data)
npm run migrate:reset
```

### Backups

**Automated backup script:**

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgresql"
DB_NAME="calcinvest"
DB_USER="calcinvest_user"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/calcinvest_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/calcinvest_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: calcinvest_$DATE.sql.gz"
```

**Schedule with cron:**

```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-db.sh
```

**Restore from backup:**

```bash
# Restore database
gunzip -c /backups/postgresql/calcinvest_20240115_020000.sql.gz | psql -h localhost -U calcinvest_user -d calcinvest
```

## Monitoring and Logging

### Application Monitoring

**PM2 Monitoring:**

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart all
```

**Docker Monitoring:**

```bash
# View container stats
docker stats

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Log Management

**Logrotate configuration:**

```bash
# /etc/logrotate.d/calcinvest
/var/log/calcinvest/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
```

### Health Checks

**System health check script:**

```bash
#!/bin/bash
# health-check.sh

# Check application health
curl -f http://localhost/health || exit 1

# Check database connection
psql -h localhost -U calcinvest_user -d calcinvest -c "SELECT 1;" || exit 1

# Check Redis connection
redis-cli ping || exit 1

echo "All services healthy"
```

## Performance Optimization

### Database Optimization

1. **PostgreSQL tuning:**

```sql
-- /etc/postgresql/14/main/postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

2. **Database indexes:**

```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX CONCURRENTLY idx_calculations_created_at ON calculations(created_at);
```

### Redis Configuration

```bash
# /etc/redis/redis.conf
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### Nginx Optimization

```nginx
# Already included in nginx.prod.conf
worker_processes auto;
worker_connections 2048;
keepalive_timeout 65;
keepalive_requests 1000;
gzip on;
gzip_comp_level 6;
```

## Security Hardening

### Server Security

1. **Firewall configuration:**

```bash
# UFW (Ubuntu)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Firewalld (CentOS)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

2. **SSH hardening:**

```bash
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222  # Change default port
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
```

3. **Fail2ban setup:**

```bash
sudo apt install fail2ban

# /etc/fail2ban/jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
```

### Application Security

1. **Environment variables:**

```bash
# Secure .env file
sudo chown root:root .env
sudo chmod 600 .env
```

2. **Database security:**

```sql
-- Revoke unnecessary permissions
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO calcinvest_user;

-- Enable row-level security where applicable
ALTER TABLE sensitive_table ENABLE ROW LEVEL SECURITY;
```

## Scaling and Load Balancing

### Horizontal Scaling

1. **Multiple backend instances:**

```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  backend:
    deploy:
      replicas: 3
    ports:
      - "3000-3002:3000"
```

2. **Load balancer configuration:**

```nginx
upstream backend {
    least_conn;
    server backend1:3000 max_fails=3 fail_timeout=30s;
    server backend2:3000 max_fails=3 fail_timeout=30s;
    server backend3:3000 max_fails=3 fail_timeout=30s;
}
```

### Database Scaling

1. **Read replicas:**

```bash
# PostgreSQL streaming replication
# Master configuration in postgresql.conf:
wal_level = replica
max_wal_senders = 3
wal_keep_segments = 64
```

2. **Connection pooling:**

```bash
# Install PgBouncer
sudo apt install pgbouncer

# /etc/pgbouncer/pgbouncer.ini
[databases]
calcinvest = host=localhost port=5432 dbname=calcinvest

[pgbouncer]
pool_mode = transaction
max_client_conn = 100
default_pool_size = 20
```

## Troubleshooting

### Common Issues

1. **Application won't start:**

```bash
# Check logs
docker-compose logs backend

# Check environment variables
docker-compose exec backend env | grep -E "(DATABASE|REDIS|JWT)"

# Test database connection
docker-compose exec backend npm run db:test
```

2. **Database connection issues:**

```bash
# Test PostgreSQL connection
psql -h localhost -U calcinvest_user -d calcinvest -c "SELECT version();"

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

3. **Redis connection issues:**

```bash
# Test Redis connection
redis-cli ping

# Check Redis status
sudo systemctl status redis

# View Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

4. **SSL certificate issues:**

```bash
# Test SSL certificate
openssl s_client -connect calcinvest.com:443 -servername calcinvest.com

# Check certificate expiration
openssl x509 -in /etc/nginx/ssl/calcinvest.com.crt -text -noout | grep "Not After"

# Renew Let's Encrypt certificate
sudo certbot renew --force-renewal
```

### Performance Issues

1. **High CPU usage:**

```bash
# Monitor processes
top -p $(pgrep -d',' node)

# Check application metrics
curl http://localhost:3000/metrics

# Analyze slow queries
psql -d calcinvest -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

2. **Memory issues:**

```bash
# Check memory usage
free -h

# Monitor Node.js memory
node --inspect backend/dist/server.js

# Check for memory leaks
valgrind --tool=memcheck --leak-check=full node backend/dist/server.js
```

3. **Database performance:**

```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- Analyze slow queries
SELECT query, mean_time, calls, total_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

## Maintenance

### Regular Maintenance Tasks

1. **Weekly tasks:**
   - Review application logs
   - Check disk space usage
   - Verify backup integrity
   - Update security patches

2. **Monthly tasks:**
   - Database maintenance (VACUUM, ANALYZE)
   - SSL certificate renewal check
   - Performance review
   - Dependency updates

3. **Quarterly tasks:**
   - Security audit
   - Disaster recovery testing
   - Capacity planning review
   - Documentation updates

### Maintenance Scripts

**Database maintenance:**

```bash
#!/bin/bash
# db-maintenance.sh

psql -d calcinvest -c "VACUUM ANALYZE;"
psql -d calcinvest -c "REINDEX DATABASE calcinvest;"
psql -d calcinvest -c "SELECT pg_stat_reset();"

echo "Database maintenance completed"
```

**Log cleanup:**

```bash
#!/bin/bash
# log-cleanup.sh

# Clean old logs (older than 30 days)
find /var/log/calcinvest -name "*.log" -mtime +30 -delete
find /var/log/nginx -name "*.log.*.gz" -mtime +30 -delete

# Clean Docker logs
docker system prune -f

echo "Log cleanup completed"
```

## Disaster Recovery

### Backup Strategy

1. **Database backups:** Daily automated backups with 30-day retention
2. **File backups:** Daily backup of uploaded files to S3
3. **Configuration backups:** Weekly backup of configuration files
4. **Code backups:** Git repository with multiple remotes

### Recovery Procedures

1. **Database recovery:**

```bash
# Stop application
docker-compose down

# Restore database
gunzip -c backup.sql.gz | psql -d calcinvest

# Start application
docker-compose up -d
```

2. **Full system recovery:**

```bash
# Clone repository
git clone https://github.com/your-org/calcinvest.git
cd calcinvest

# Restore configuration
cp /backup/configs/.env .

# Restore database
# (see database recovery above)

# Deploy application
docker-compose -f docker-compose.prod.yml up -d
```

## Support and Resources

- **Documentation:** https://docs.calcinvest.com
- **Support Email:** support@calcinvest.com
- **Status Page:** https://status.calcinvest.com
- **GitHub Repository:** https://github.com/your-org/calcinvest
- **Docker Hub:** https://hub.docker.com/r/calcinvest/

## Changelog

### v1.0.0 (2024-01-01)
- Initial deployment guide
- Docker Compose setup
- SSL configuration
- Monitoring setup

### v1.0.1 (2024-01-15)
- Added scaling instructions
- Enhanced security hardening
- Improved troubleshooting section
- Added maintenance procedures