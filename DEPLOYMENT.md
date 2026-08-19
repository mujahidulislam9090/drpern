# DropEarn — Production Deployment Guide

This guide covers complete step-by-step instructions for deploying **DropEarn** on **Ubuntu 24.04 LTS VPS** (DigitalOcean, Hetzner, AWS EC2, Linode, or Vultr).

---

## Architecture Overview

```
[ Visitor / Creator Browser ]
             │ (HTTPS Port 443)
             ▼
      [ Nginx Reverse Proxy ]
             │ (HTTP Port 3000)
             ▼
   [ Next.js Web App / API ] ───▶ [ Firebase Admin Auth ]
        │          │
        ▼          ▼
  [ PostgreSQL ]  [ Redis ]
  (Prisma ORM)   (Rate Limiter / Cache)
        │
        ▼
[ AWS S3 / Cloudflare R2 / MinIO Storage ]
```

---

## Method 1: Docker Compose Deployment (Recommended)

### 1. Provision Ubuntu 24.04 Server

Connect to your server:
```bash
ssh root@your-server-ip
```

Update packages and install Docker & Docker Compose:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release git

# Install Docker Engine
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 2. Clone Repository & Configure Environment

```bash
git clone https://github.com/your-username/DropEarn.git /opt/dropearn
cd /opt/dropearn

cp .env.example .env
nano .env
```

Set your production secrets in `.env`:
* `DATABASE_URL`: PostgreSQL connection string.
* `REDIS_URL`: Redis connection string.
* `S3_*`: AWS S3 or Cloudflare R2 credentials.
* `FIREBASE_*`: Firebase project credentials.

### 3. Build & Launch Containers

```bash
docker compose up -d --build
```

### 4. Run Database Migrations & Initial Seed

```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

Your platform is now running at `http://your-server-ip`.

---

## Method 2: Direct Ubuntu 24.04 VPS Setup (Systemd + Nginx)

### 1. Install Node.js 20, PostgreSQL, Redis, Nginx

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx redis-server postgresql postgresql-contrib certbot python3-certbot-nginx

# Verify versions
node -v # v20.x.x
npm -v  # v10.x.x
```

### 2. Configure PostgreSQL Database

```bash
sudo -u postgres psql
```
In the PostgreSQL prompt:
```sql
CREATE DATABASE dropearn_db;
CREATE USER dropearn_user WITH ENCRYPTED PASSWORD 'your_strong_db_password_here';
GRANT ALL PRIVILEGES ON DATABASE dropearn_db TO dropearn_user;
ALTER DATABASE dropearn_db OWNER TO dropearn_user;
\q
```

### 3. Setup DropEarn Application

```bash
sudo mkdir -p /var/www/dropearn
sudo chown -R $USER:$USER /var/www/dropearn
git clone https://github.com/your-username/DropEarn.git /var/www/dropearn
cd /var/www/dropearn

npm ci
cp .env.example .env
nano .env # configure production secrets

# Generate Prisma Client & Migrate
npx prisma generate
npx prisma migrate deploy
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# Build Next.js Application
npm run build
```

### 4. Setup Systemd Service

Create `/etc/systemd/system/dropearn.service`:
```ini
[Unit]
Description=DropEarn Next.js Web Application
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/dropearn
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable dropearn
sudo systemctl start dropearn
sudo systemctl status dropearn
```

### 5. Configure Nginx with SSL

Create `/etc/nginx/sites-available/dropearn`:
```nginx
server {
    server_name dropearn.yourdomain.com;

    client_max_body_size 500M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

Enable site and acquire free SSL certificate from Let's Encrypt:
```bash
sudo ln -s /etc/nginx/sites-available/dropearn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

sudo certbot --nginx -d dropearn.yourdomain.com
```

---

## Cloud Storage Setup (Cloudflare R2 / AWS S3)

### Cloudflare R2:
1. In Cloudflare Dashboard, go to **R2 Object Storage** -> **Create Bucket** (`dropearn-files`).
2. Go to **Manage R2 API Tokens** -> **Create API Token** (Permissions: Object Read & Write).
3. Copy:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
4. Set CORS Policy on the bucket:
```json
[
  {
    "AllowedOrigins": ["https://dropearn.yourdomain.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## Zero-Downtime Maintenance & Updates

When updating code in production:
```bash
cd /var/www/dropearn
git pull origin main
npm ci
npx prisma migrate deploy
npm run build
sudo systemctl restart dropearn
```

---

## Production Security Best Practices

1. **Firewall (UFW):**
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow ssh
   sudo ufw allow http
   sudo ufw allow https
   sudo ufw enable
   ```
2. **Never expose PostgreSQL (5432) or Redis (6379) publicly.** Bind them strictly to `localhost` or Docker internal networks.
3. **Database Automated Backups:**
   ```bash
   crontab -e
   # Daily DB backup at 2 AM
   0 2 * * * pg_dump -U dropearn_user dropearn_db | gzip > /backups/db_$(date +\%F).sql.gz
   ```
