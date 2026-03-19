# Redeployment Guide for PolicyNavigator

Since many new features (Machine Learning, Dashboard persistence, and UI updates) have been added, follow these steps to ensure everything is running correctly.

## 1. Refresh Modern Frontend
The frontend uses Vite for fast development. To create a clean production build:
```bash
# From the root directory
npm install
npm run build
```
The application is currently configured to run in development mode via `npm run dev` to pick up changes instantly.

## 2. Restart Backend Server
The backend handles authentication, database connections, and API calls.
```bash
# From the root directory
cd server
npm install
npm start # Use 'npm run dev' if you want it to auto-restart on changes
```

## 3. Launch ML Microservice (Crucial)
The ML recommendations now run on a separate Python service.
```bash
# From the root directory
cd server/ml_service
pip install -r requirements.txt
python3 app.py
```
*The ML service runs on `http://localhost:5002` and must be active for Search/Comparison to work.*

---

### 🚀 Quick Restart (Local Development Mode)
If you're making changes and want to pick them up:
1.  **Stop all old processes** (Crtl + C in all terminals).
2.  **Start Server**: `cd server && npm run dev`
3.  **Start Frontend**: `npm run dev` (in the root)
4.  **Start ML Service**: `cd server/ml_service && python3 app.py`

Your application is now fully updated with all the latest features!
