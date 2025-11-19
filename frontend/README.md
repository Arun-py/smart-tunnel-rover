# RoadScan Frontend Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Backend URL (Optional)

Create a `.env` file in the frontend directory:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

If not specified, it defaults to `http://localhost:5000`

### 3. Start the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Features

### Real-time Dashboard
- Live sensor data (temperature, humidity, distance)
- Vehicle status monitoring
- Hazard detection alerts

### Hazard Map
- Visual representation of detected potholes and obstacles
- Grid-based positioning
- Color-coded markers (red for potholes, orange for obstacles)

### Event Log
- Chronological list of all events
- Color-coded by severity
- Auto-scrolling

### Statistics Panel
- Total potholes detected
- Total obstacles detected
- Data points collected
- Average temperature

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `build/` folder.

### Deploy the Build

You can deploy the build folder to:
- **Netlify**: Drag & drop the build folder
- **Vercel**: Connect your GitHub repo
- **GitHub Pages**: Use `gh-pages` package
- **Traditional hosting**: Upload build folder contents

## Customization

### Change Theme Colors

Edit `src/index.css` and modify CSS variables:

```css
:root {
  --primary-bg: #0a0e27;
  --accent-blue: #00d4ff;
  --accent-green: #00ff88;
  --accent-red: #ff3366;
}
```

### Modify Grid Size

In `src/components/HazardMap.js`, change:

```javascript
const gridSize = 20; // Increase for larger map
```

## Troubleshooting

### Backend Connection Failed
- Ensure backend server is running on port 5000
- Check `REACT_APP_BACKEND_URL` in `.env`
- Verify CORS settings in backend

### WebSocket Not Connecting
- Check if Socket.IO is enabled in backend
- Verify firewall/antivirus isn't blocking connections
- Check browser console for errors

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Component Structure

```
src/
├── components/
│   ├── Header.js           # Top navigation bar
│   ├── SensorCard.js       # Individual sensor display
│   ├── VehicleStatus.js    # Vehicle status card
│   ├── HazardMap.js        # Interactive hazard map
│   ├── EventLog.js         # Event history
│   └── StatsPanel.js       # Statistics overview
├── App.js                  # Main app component
├── App.css                 # App styles
├── index.js                # Entry point
└── index.css               # Global styles
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)
