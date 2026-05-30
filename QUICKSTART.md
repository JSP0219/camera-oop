# Quick Start Guide

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

Output will be in the `dist/` directory.

## What You'll See

### 1. **Header Section**
- Title: "Camera OOP Web Application"
- Subtitle: Python OOP Camera System - React Implementation

### 2. **Control Panel**
- 🔄 **Reset All**: Reinitialize all cameras to their default state
- 🗑️ **Clear Log**: Clear the activity log

### 3. **UML Diagram**
Visual representation of the class hierarchy:
- **CameraADT** (Red) - Abstract interface
- **Camera** (Blue) - Base class
- **DigitalCamera** (Green) - Digital camera with burst mode and zoom
- **FilmCamera** (Purple) - Film camera with film management
- **InstantCamera** (Pink) - Instant camera with auto-printing

Shows all properties and methods for each class.

### 4. **Three Camera Cards**

#### Camera 1: Canon EOS R5 (DigitalCamera)
- Resolution: 61MP
- Zoom: 10x
- Special Features:
  - 🎬 Burst Mode toggle (ON/OFF)
  - 🔍 Zoom selector (1x-10x)
- Battery: 100% → decreases with shooting
- Burst Shooting: 5 shots per trigger, 5% battery per burst
- Single Shooting: 1 shot, 1% battery per shot

#### Camera 2: Nikon FM2n (FilmCamera)
- Format: 35mm
- Film: 36 exposures
- Special Features:
  - 📽️ Reload Film button (restocks to 36)
- No Battery (mechanical camera)
- Shooting: Decreases film count, no battery cost
- Shooting stops when film runs out

#### Camera 3: Fujifilm Instax Mini 11 (InstantCamera)
- Film Pack: 10 sheets
- Special Features:
  - 📦 Reload Film Pack button
  - 🔄 Developing status indicator
- Battery: 100% → 2% per shot
- Auto-printing: Prints immediately after shooting
- Minimum battery requirement: 2%

### 5. **Activity Log**
- Shows all operations with timestamps
- Displays up to 50 recent events
- Shows success/failure messages
- Clear button to reset log

## Expandable Card Details

Click the ▶ arrow on any camera card to expand and see:

**For DigitalCamera:**
- Resolution (MP)
- Max Zoom (x)
- Burst Mode toggle
- Zoom level selector

**For FilmCamera:**
- Film Format
- Remaining film shots
- Reload button

**For InstantCamera:**
- Film Pack quantity
- Developing status (Ready/Developing...)
- Reload button

## Key Features to Try

### 1. **Basic Shooting**
- Click "📸 Shoot" on any camera
- Watch battery decrease (if applicable)
- See shutter count increase
- Check activity log for confirmation

### 2. **Battery Management**
- Click "🔋 Charge" (DigitalCamera and InstantCamera)
- Watch battery bar refill
- See charging confirmation in log

### 3. **Digital Camera Features**
- Toggle burst mode ON/OFF
- Select zoom level 1x-10x
- Shoot in burst mode (5 shots, 5% battery)
- Notice battery drains faster in burst mode

### 4. **Film Camera**
- Shoot until film runs out (36 shots)
- Click "Reload Film" to get new roll
- No battery charging available

### 5. **Instant Camera**
- Shoot with auto-printing
- Watch film pack decrease
- Requires 2% minimum battery
- Reload film pack when empty

### 6. **Reset**
- Click "🔄 Reset All" to restore all cameras to initial state
- All counters reset
- Battery returns to 100%
- Film counts reset

## Console Messages

All operations log detailed messages in the Activity Log:

**Successful shoot:**
```
[13:45:23] [Canon EOS R5] 디지털 촬영! ISO 400, f/2.8 (셔터: 1회, 배터리: 99%)
```

**Charge:**
```
[13:45:45] [Canon EOS R5] 충전 완료 → 배터리: 99% → 100%
```

**Film finished:**
```
[13:46:00] [Nikon FM2n] 필름이 소진되었습니다! 필름을 교체하세요.
```

## Troubleshooting

### Application won't start?
1. Make sure Node.js 16+ is installed: `node --version`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Clear npm cache: `npm cache clean --force`

### Changes not showing?
1. Hard refresh the page: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache and cookies
3. Restart dev server: Stop with `Ctrl+C` and run `npm run dev` again

### Camera doesn't respond?
1. Try resetting: Click "🔄 Reset All"
2. Check the Activity Log for error messages
3. Make sure camera has battery (except FilmCamera) or film

## Code Structure

The implementation is organized as follows:

```
src/
├── oop/
│   ├── CameraADT.js      ← Abstract interface defining all camera contracts
│   ├── Camera.js          ← Base implementation with common functionality
│   ├── DigitalCamera.js   ← Extended with burst and zoom
│   ├── FilmCamera.js      ← Extended with film management
│   └── InstantCamera.js   ← Extended with auto-printing
├── components/
│   ├── CameraCard.jsx     ← Individual camera UI and controls
│   ├── UMLDiagram.jsx     ← Class hierarchy visualization
│   ├── BatteryBar.jsx     ← Battery visualization
│   └── CotrolPanel.jsx    ← Global controls
├── data/
│   └── cameras.js         ← Pre-configured camera instances
└── App.jsx                ← Main application component
```

## Key Implementation Details

### Polymorphism
Each camera class overrides `shoot()` and other methods differently:
- **Camera**: Basic shooting, 1% battery
- **DigitalCamera**: Burst or single mode, up to 5 shots
- **FilmCamera**: Uses film instead of battery, can run out of film
- **InstantCamera**: Uses battery and film pack, prints immediately

### Validation
All properties validate inputs before accepting changes:
- ISO: 25-204800
- Aperture: f/0.95 to f/64
- Battery: 0-100% (auto-clamped)
- Film/Zoom: Range checking

### State Management
React's `useState` hook manages:
- Camera array
- Activity log (up to 50 entries)
- Timestamp for each action

## Browser DevTools

You can also see:
- Console logs for all camera operations
- React component tree in React DevTools
- Network requests (minimal - all client-side)

## Performance

- **First Load**: ~2-3 seconds (with npm installed)
- **Re-renders**: <100ms (optimized with proper dependencies)
- **Memory**: <50MB (small bundle size)
- **Network**: Fully offline capable after load

## Next Steps

Try these exercises:
1. Shoot with all three cameras
2. Use burst mode on the digital camera
3. Run out of film on the film camera
4. Keep instant camera developing status
5. Battery-deplete scenarios

## Need Help?

Check:
1. **IMPLEMENTATION.md** - Detailed technical documentation
2. **Console** - All operations log messages
3. **Activity Log** - Real-time feedback of all actions
4. **Browser DevTools** - Inspect component state

Enjoy the Camera OOP Web Application! 📷
