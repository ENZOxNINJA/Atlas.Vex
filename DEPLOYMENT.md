# ATLAS VEX Deployment Guide

## Domain Configuration

The portfolio is configured for the domain `themarvel.space`. Below is the DNS zone file for reference:

```
;; Domain:     themarvel.space.
;; Exported:   2026-05-10 17:33:43
;;
;; SOA Record
themarvel.space	3600	IN	SOA	olof.ns.cloudflare.com. dns.cloudflare.com. 2053010102 10000 2400 604800 3600

;; NS Records
themarvel.space.	86400	IN	NS	olof.ns.cloudflare.com.
themarvel.space.	86400	IN	NS	vera.ns.cloudflare.com.

;; A Records
themarvel.space.	1	IN	A	208.91.197.27

;; CNAME Records
www.themarvel.space.	1	IN	CNAME	themarvel.space.

;; TXT Records
_dmarc.themarvel.space.	1	IN	TXT	"v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; rua=mailto:cf7a64b05b9f415f827116b5fffbb1bb@dmarc-reports.cloudflare.net;"
*._domainkey.themarvel.space.	1	IN	TXT	"v=DKIM1; p="
themarvel.space.	1	IN	TXT	"v=spf1 -all"
```

### DNS Records Explanation

- **SOA**: Start of Authority - defines the primary nameserver and domain parameters
- **NS**: Nameserver records pointing to Cloudflare's DNS
- **A**: Root domain points to Cloudflare's proxy IP
- **CNAME**: www subdomain redirects to root domain
- **TXT**: Security records for email authentication (DMARC, DKIM, SPF)

## Deployment Options

### 1. Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/ENZOxNINJA/Atlas.Vex.git
cd Atlas.Vex

# Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your actual values

# Start all services
docker-compose up --build -d

# Check logs
docker-compose logs -f
```

### 2. Manual Deployment

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run build
npm install -g serve
serve -s build -l 3000
```

### 3. Production Server Setup (Ubuntu/Debian)

#### Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx certbot python3-certbot-nginx mongodb-server python3 python3-pip python3-venv git

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Database Setup
```bash
# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database user
mongosh
use atlasvex
db.createUser({
  user: "atlasvex",
  pwd: "secure-password-here",
  roles: ["readWrite"]
})
exit
```

#### Deploy Application
```bash
# Create application directory
sudo mkdir -p /var/www/themarvel.space
sudo chown -R $USER:www-data /var/www/themarvel.space

# Clone and setup
cd /var/www/themarvel.space
git clone https://github.com/ENZOxNINJA/Atlas.Vex.git .
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with production values

# Setup Python virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate

# Build frontend
cd ../frontend
npm install --legacy-peer-deps
npm run build
```

#### Nginx Configuration
```bash
# Copy nginx config
sudo cp /var/www/themarvel.space/nginx.conf /etc/nginx/sites-available/themarvel.space
sudo ln -s /etc/nginx/sites-available/themarvel.space /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t
sudo systemctl reload nginx
```

#### SSL Certificate
```bash
# Get Let's Encrypt certificate
sudo certbot --nginx -d themarvel.space -d www.themarvel.space

# Setup auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Systemd Service
```bash
# Copy service file
sudo cp backend/atlas-vex-backend.service /etc/systemd/system/

# Start services
sudo systemctl daemon-reload
sudo systemctl start atlas-vex-backend
sudo systemctl enable atlas-vex-backend
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Firewall Configuration
```bash
# UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
### 4. Cloudflare Worker AI Deployment

#### Prerequisites
- Cloudflare account with Workers AI enabled
- Wrangler CLI installed (`npm install -g wrangler`)

#### Deploy AI Worker
```bash
# Run deployment script
./deploy-worker.sh

# Or manually:
cd cloudflare-worker
npm install
wrangler auth login
wrangler deploy
```

#### Update Backend Configuration
After deployment, update `backend/.env`:
```env
CLOUDFLARE_AI_URL=https://atlas-vex-ai.your-worker-domain.workers.dev
CLOUDFLARE_AI_TOKEN=your-cloudflare-api-token
```

#### Test AI Integration
```bash
# Test health endpoint
curl https://atlas-vex-ai.your-worker-domain.workers.dev/health

# Test chat endpoint
curl -X POST https://atlas-vex-ai.your-worker-domain.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test", "message": "Hello Atlas Vex"}'
```

## Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=atlasvex
EMERGENT_LLM_KEY=your-actual-llm-api-key
ADMIN_TOKEN=secure-admin-token-here
CORS_ORIGINS=https://themarvel.space,https://www.themarvel.space
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://api.themarvel.space
```

## Cloudflare Configuration

1. **SSL/TLS**: Set to "Full (strict)" for HTTPS
2. **Page Rules**:
   - `https://themarvel.space/*` → Always Use HTTPS
   - `https://themarvel.space/api/*` → Cache Level: Bypass
3. **Firewall**: Configure rate limiting for API endpoints
4. **Workers**: Optional - for additional routing or edge functions

## Backup Strategy

### Database Backup
```bash
# Run manual backup
./backup.sh

# Set up daily backups (2 AM)
crontab -e
# Add: 0 2 * * * /var/www/themarvel.space/backup.sh >> /var/log/atlas-vex/backup.log 2>&1
```

### Backup Checklist
- [ ] Configure automated daily database backups
- [ ] Set up offsite backup storage (AWS S3, Google Cloud, etc.)
- [ ] Test backup restoration procedure
- [ ] Monitor backup success/failure
- [ ] Implement backup retention policy (7-30 days)

## Security Considerations

- Use strong, unique passwords for all services
- Enable 2FA on all accounts
- Regularly update dependencies
- Monitor for security vulnerabilities
- Use HTTPS everywhere
- Implement proper rate limiting
- Secure admin endpoints with strong tokens
- Regular security audits

## Monitoring

A health check script is provided to monitor service status:

```bash
# Run manual health check
./health-check.sh

# Set up cron monitoring (every 5 minutes)
crontab -e
# Add: */5 * * * * /var/www/themarvel.space/health-check.sh >> /var/log/atlas-vex/health.log 2>&1
```

### Monitoring Checklist

- [ ] Set up log rotation for application logs
- [ ] Configure monitoring alerts for service failures
- [ ] Set up database backup monitoring
- [ ] Monitor SSL certificate expiration
- [ ] Track API response times and error rates
- [ ] Set up user analytics (Google Analytics, etc.)

### AI System Monitoring
```bash
# Run AI performance test
./test-ai.sh

# Set up AI monitoring (every 5 minutes)
crontab -e
# Add: */5 * * * * /var/www/themarvel.space/monitor-ai.sh
```

### AI Monitoring Checklist
- [ ] Monitor AI response times (< 5 seconds)
- [ ] Track API error rates
- [ ] Monitor token usage and costs
- [ ] Set up alerts for AI service failures
- [ ] Track conversation quality metrics