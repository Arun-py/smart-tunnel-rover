# RoadScan Backend Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/roadscan

# For MongoDB Atlas (recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roadscan?retryWrites=true&w=majority

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Windows: Download from https://www.mongodb.com/try/download/community
# Start MongoDB service
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Update `MONGODB_URI` in `.env`

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Sensor Data
- `POST /api/sensor-data` - Receive data from ESP32
- `GET /api/sensor-data/latest` - Get latest reading
- `GET /api/sensor-data/history` - Get historical data

### Hazards
- `GET /api/hazards` - Get all hazards
- `PATCH /api/hazards/:id/resolve` - Mark hazard as resolved

### Analytics
- `GET /api/analytics` - Get statistics

### Vehicle Status
- `GET /api/vehicle/status` - Get vehicle status

## Testing the API

### Using cURL (PowerShell)

```powershell
# Test sending sensor data
$body = @{
    deviceId = "ESP32_RoadScan_001"
    temperature = 28.5
    humidity = 65
    distance = 45
    potholeDetected = $false
    vehicleStatus = "Patrolling"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/sensor-data" -Method Post -Body $body -ContentType "application/json"

# Get latest data
Invoke-RestMethod -Uri "http://localhost:5000/api/sensor-data/latest" -Method Get
```

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env`
- Check firewall settings

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 5000

### CORS Error
- Ensure `FRONTEND_URL` matches your React app URL
- Check CORS configuration in `server.js`

## Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── models/
│   │   └── index.js         # Mongoose schemas
│   ├── routes/
│   │   └── api.js           # API routes
│   └── server.js            # Express server
├── .env                     # Environment variables
├── .env.example            # Example env file
├── package.json
└── README.md
```
