# 🚀 Deployment Guide - RoadScan Project

This guide covers deploying the RoadScan system to production environments.

---

## 📋 Deployment Overview

### Architecture Options

**Option 1: Local Network Deployment**
- Backend & MongoDB on local server/PC
- Frontend served from same server
- ESP32 connects via local WiFi
- **Use Case:** Lab testing, demos, local ITS projects

**Option 2: Cloud Deployment**
- Backend on cloud provider (Heroku, DigitalOcean, AWS)
- MongoDB Atlas (cloud database)
- Frontend on Netlify/Vercel
- ESP32 connects via internet
- **Use Case:** Production, remote monitoring

**Option 3: Hybrid Deployment**
- Backend & database in cloud
- Frontend in cloud
- Multiple ESP32 vehicles in field
- **Use Case:** City-wide deployment, fleet management

---

## 🌐 Option 1: Local Network Deployment

### Prerequisites
- A dedicated PC/Raspberry Pi as server
- Local WiFi network
- Static IP configuration (recommended)

### Step 1: Setup Local Server

```powershell
# On your server PC

# 1. Install Node.js and MongoDB
# Download from nodejs.org and mongodb.com

# 2. Clone/Copy project to server
cd C:\RoadScanServer
# Copy all project files

# 3. Setup Backend
cd backend
npm install
```

### Step 2: Configure for Local Network

**backend/.env:**
```env
MONGODB_URI=mongodb://localhost:27017/roadscan
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://192.168.1.100:3000
```

**frontend/.env:**
```env
REACT_APP_BACKEND_URL=http://192.168.1.100:5000
```

### Step 3: Build Frontend

```powershell
cd frontend
npm install
npm run build
```

### Step 4: Serve Frontend from Backend

Install serve package:
```powershell
cd backend
npm install serve
```

Modify `backend/src/server.js`:
```javascript
const path = require('path');

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Catch-all route for React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});
```

### Step 5: Setup Windows Service (Optional)

Using **node-windows** to run as background service:

```powershell
npm install -g node-windows
```

Create `install-service.js`:
```javascript
const Service = require('node-windows').Service;

const svc = new Service({
  name: 'RoadScan Backend',
  description: 'RoadScan ITS Backend Server',
  script: 'C:\\RoadScanServer\\backend\\src\\server.js'
});

svc.on('install', () => {
  svc.start();
});

svc.install();
```

### Step 6: Configure ESP32

Update ESP32 code with server's local IP:
```cpp
const char* serverUrl = "http://192.168.1.100:5000/api/sensor-data";
```

### Step 7: Access Dashboard

From any device on the network:
```
http://192.168.1.100:5000
```

---

## ☁️ Option 2: Cloud Deployment

### Part A: MongoDB Atlas Setup

1. **Create Account**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Name: `roadscan-cluster`

3. **Configure Access**
   - Database Access → Add User
   - Username: `roadscan_admin`
   - Password: (generate strong password)
   - Network Access → Add IP → Allow from Anywhere (0.0.0.0/0)

4. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string:
   ```
   mongodb+srv://roadscan_admin:<password>@roadscan-cluster.xxxxx.mongodb.net/roadscan?retryWrites=true&w=majority
   ```

### Part B: Backend Deployment (Heroku)

1. **Install Heroku CLI**
   ```powershell
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   heroku --version
   ```

2. **Prepare Backend**
   ```powershell
   cd backend
   
   # Login to Heroku
   heroku login
   
   # Create app
   heroku create roadscan-backend
   
   # Set environment variables
   heroku config:set MONGODB_URI="mongodb+srv://..."
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL="https://roadscan-dashboard.netlify.app"
   ```

3. **Create Procfile**
   ```
   web: node src/server.js
   ```

4. **Deploy**
   ```powershell
   git init
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

5. **Verify**
   ```powershell
   heroku open
   # Should show API info page
   heroku logs --tail
   ```

### Part C: Frontend Deployment (Netlify)

1. **Build Production**
   ```powershell
   cd frontend
   
   # Update environment
   echo "REACT_APP_BACKEND_URL=https://roadscan-backend.herokuapp.com" > .env.production
   
   # Build
   npm run build
   ```

2. **Deploy to Netlify**
   
   **Method 1: Drag & Drop**
   - Visit https://app.netlify.com
   - Drag `frontend/build` folder to Netlify
   - Done! Get URL: `https://roadscan-dashboard.netlify.app`

   **Method 2: CLI**
   ```powershell
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=build
   ```

3. **Configure Environment Variables in Netlify**
   - Site settings → Environment variables
   - Add: `REACT_APP_BACKEND_URL = https://roadscan-backend.herokuapp.com`

### Part D: Alternative Backend Hosts

#### DigitalOcean App Platform
```powershell
# Install doctl
# Link: https://docs.digitalocean.com/reference/doctl/

doctl apps create --spec .do/app.yaml
```

**Create `.do/app.yaml`:**
```yaml
name: roadscan-backend
services:
  - name: api
    github:
      repo: your-username/roadscan
      branch: main
    source_dir: /backend
    run_command: node src/server.js
    envs:
      - key: MONGODB_URI
        value: ${MONGODB_URI}
      - key: NODE_ENV
        value: production
```

#### AWS Elastic Beanstalk
```powershell
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p node.js roadscan-backend

# Create environment
eb create roadscan-env

# Deploy
eb deploy
```

### Part E: Configure ESP32 for Cloud

Update ESP32 code:
```cpp
const char* serverUrl = "https://roadscan-backend.herokuapp.com/api/sensor-data";
```

**Note:** ESP32 may need certificate for HTTPS. For testing, you can use HTTP endpoint or add certificate:

```cpp
#include <WiFiClientSecure.h>

WiFiClientSecure client;
client.setInsecure(); // For testing only!
```

---

## 🐳 Option 3: Docker Deployment

### Create Docker Files

**backend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml (Root):**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: roadscan-db
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    container_name: roadscan-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/roadscan
      - PORT=5000
      - NODE_ENV=production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: roadscan-frontend
    restart: always
    ports:
      - "3000:80"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:5000
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Deploy with Docker

```powershell
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## 🔒 Production Security Checklist

### Backend Security
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Implement rate limiting
- [ ] Add authentication (JWT)
- [ ] Sanitize all inputs
- [ ] Enable CORS only for trusted domains
- [ ] Use helmet.js for security headers
- [ ] Keep dependencies updated
- [ ] Implement logging (Winston, Morgan)
- [ ] Set up monitoring (PM2, New Relic)

### Database Security
- [ ] Use strong passwords
- [ ] Enable authentication
- [ ] Restrict IP access
- [ ] Regular backups
- [ ] Encrypt sensitive data
- [ ] Use connection pooling
- [ ] Monitor queries
- [ ] Index frequently queried fields

### Frontend Security
- [ ] Build for production (minified)
- [ ] Enable HTTPS
- [ ] Implement CSP headers
- [ ] Validate all user inputs
- [ ] Secure WebSocket connections
- [ ] Remove console.logs
- [ ] Use environment variables

### Hardware Security
- [ ] Secure WiFi password
- [ ] Use WPA2/WPA3 encryption
- [ ] Regular firmware updates
- [ ] Physical security of device
- [ ] Implement authentication tokens

---

## 📊 Monitoring & Maintenance

### Backend Monitoring

**Install PM2 (Process Manager):**
```powershell
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name roadscan-api

# Monitor
pm2 monit

# Auto-restart on reboot
pm2 startup
pm2 save
```

**Health Checks:**
```javascript
// Add to server.js
app.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    status: 'OK',
    timestamp: Date.now(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  };
  res.json(health);
});
```

### Database Monitoring

**MongoDB Compass:**
- Download: https://www.mongodb.com/products/compass
- Connect and monitor collections
- View indexes and query performance

**Automated Backups:**
```powershell
# Daily backup script
mongodump --uri="mongodb://localhost:27017/roadscan" --out="C:\Backups\roadscan-$(Get-Date -Format 'yyyy-MM-dd')"
```

### Application Logging

**Install Winston:**
```javascript
// backend/src/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

---

## 🌍 Scalability Considerations

### Horizontal Scaling
- Load balancer (NGINX, AWS ELB)
- Multiple backend instances
- Clustered MongoDB (replica sets)
- Redis for session management

### Vertical Scaling
- Increase server resources (RAM, CPU)
- Optimize database queries
- Implement caching (Redis)
- CDN for frontend assets

### Performance Optimization
- Database indexing
- Query optimization
- Gzip compression
- Image optimization
- Code splitting (React)
- Lazy loading

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

**Create `.github/workflows/deploy.yml`:**
```yaml
name: Deploy RoadScan

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "roadscan-backend"
          heroku_email: ${{secrets.HEROKU_EMAIL}}
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './frontend/build'
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 📱 Mobile Optimization

### Responsive Design Already Included
- Viewport meta tag configured
- CSS media queries implemented
- Touch-friendly UI elements

### Progressive Web App (PWA)

Add to `frontend/public/manifest.json`:
```json
{
  "short_name": "RoadScan",
  "name": "RoadScan ITS Dashboard",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#00d4ff",
  "background_color": "#0a0e27"
}
```

---

## 🆘 Troubleshooting Production Issues

### Backend Issues

**Server won't start:**
```powershell
# Check logs
heroku logs --tail

# Check environment variables
heroku config

# Restart dynos
heroku restart
```

**MongoDB connection failed:**
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Test connection locally

### Frontend Issues

**API calls failing:**
- Check CORS configuration
- Verify backend URL in environment
- Check browser console for errors

**Build failed:**
```powershell
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 💰 Cost Estimation (Cloud Deployment)

| Service | Provider | Free Tier | Paid (Monthly) |
|---------|----------|-----------|----------------|
| Database | MongoDB Atlas | 512MB | $9-$57+ |
| Backend | Heroku | 550hrs | $7-$25+ |
| Frontend | Netlify | 100GB | Free-$19+ |
| SSL | Let's Encrypt | Free | Free |
| **Total** | | **~$0** | **$16-$100+** |

**Note:** Free tiers sufficient for testing and small deployments.

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables documented
- [ ] Database backup created
- [ ] Code reviewed
- [ ] Dependencies updated
- [ ] Security audit completed

### Deployment
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database migrated/connected
- [ ] Environment variables set
- [ ] SSL certificates installed
- [ ] DNS configured (if custom domain)

### Post-Deployment
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Logs accessible
- [ ] Backup strategy implemented
- [ ] Documentation updated
- [ ] Team notified

---

## 🎓 Best Practices

1. **Always use environment variables** for sensitive data
2. **Never commit** `.env` files to Git
3. **Test locally** before deploying
4. **Use staging environment** for testing
5. **Monitor application** performance
6. **Regular backups** of database
7. **Keep dependencies** updated
8. **Document all changes**
9. **Use version control** (Git)
10. **Implement error tracking** (Sentry)

---

**Your RoadScan system is now ready for production! 🚀**

For questions or issues, refer to individual README files or create an issue on GitHub.
