# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup (After Clone)
```bash
npm install
npm run python:build
```

### Development
- `npm start` - Build renderer and start Electron app
- `npm run start:renderer` - Start webpack dev server (port 3000)
- `npm run build:renderer` - Build React renderer bundle
- `npm run build:renderer_force` - Force build after killing server.exe

### Python Backend
- `npm run python:build` - Build Python server to executable using PyInstaller

### Production Build
- `npx electron-builder` - Create installer executable

## Architecture

### Hybrid Desktop Application
This is an Electron-based desktop application that combines:
- **Frontend**: React with TypeScript, using React Router with HashRouter
- **Backend**: Python FastAPI server compiled to standalone executable
- **Packaging**: Electron for cross-platform desktop distribution

### Key Components

#### Main Process (`main.js`)
- Manages Electron application lifecycle
- Spawns Python server executable (`server.exe`) 
- Handles window creation and Python process cleanup
- Uses `dist/server.exe` in development, `process.resourcesPath/server.exe` in production

#### React Renderer (`src/renderer/`)
- Entry point: `index.tsx` - renders `<GalaxyOnChat />` with HashRouter
- Main component: `galaxy.tsx` - navigation and routing for chat features
- Routes: Summary (`galaxy_summary.tsx`), Translate (`galaxy_translate.tsx`), Helper
- Uses Lucide React icons and custom CSS styling

#### Python Backend (`src/python/`)
- FastAPI server (`server.py`) running on port 8000
- Endpoints: `/`, `/status/`, `/long-job/{name}`, `/chat-msg/`
- Uses OpenVINO optimized Mistral-7B model for AI processing
- Dependencies include transformers, openvino, optimum for ML inference

### Build System
- **Webpack**: Bundles React app with TypeScript, CSS support
- **PyInstaller**: Compiles Python server to standalone executable
- **Electron Builder**: Creates Windows installer with NSIS

### Data Flow
1. Electron main process starts Python server executable
2. React renderer communicates with Python FastAPI backend
3. Python backend uses local Mistral-7B model for AI operations
4. Results returned through FastAPI endpoints to React frontend

## Important Notes
- Python server must be built before running the application
- Uses HashRouter for Electron compatibility
- AI model files are stored in `src/python/Mistral-7B-Instruct-v0.3-int4-ov/`
- Window has no menu bar and uses custom styling