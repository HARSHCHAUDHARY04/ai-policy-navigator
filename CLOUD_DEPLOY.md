# Multi-Platform Deployment Guide (Vercel + Render)

Since you are using **Vercel** for the frontend and **Render** for the backend, follow these specific steps to link them correctly.

## 1. Vercel (Frontend)
1. Go to your **Vercel Dashboard** -> **Project Settings** -> **Environment Variables**.
2. Add the following variables:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-name.onrender.com/api`
   - **Key**: `VITE_GOOGLE_CLIENT_ID`
   - **Value**: `your-google-client-id-here.apps.googleusercontent.com`
3. **Redeploy** on Vercel to apply the change.

## 2. Render (Main Backend)
1. Go to **Render Dashboard** -> Your Web Service -> **Environment**.
2. Add/Verify these variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `ML_SERVICE_URL`: The URL of your ML service (see step 3).
   - `GEMINI_API_KEY`: Your Google AI key.
   - `GOOGLE_CLIENT_ID`: `your-google-client-id-here.apps.googleusercontent.com`
   - `JWT_SECRET`: A long random string for security.

## 3. Render (ML Microservice)
Since the ML logic is in a separate folder, you need a second service on Render:
1. Click **New +** -> **Web Service**.
2. Connect your repo.
3. **Settings**:
   - **Name**: `policy-ml-service`
   - **Root Directory**: `server/ml_service`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python3 app.py`
4. Once it's live, copy its URL and paste it into the `ML_SERVICE_URL` variable of your **Main Backend** (Step 2).

## 4. MongoDB Atlas
- Ensure your Atlas **Network Access** (Whitelist) is set to `0.0.0.0/0` (or add Render's IP) so the Render backend can connect.

---
Your website is now fully connected across Vercel, Render, and MongoDB Atlas!

## 4. Finalizing
- Your website will be live at the URL provided by the first Render service!
- All features (Search, Dashboard, Profile) will work exactly like they do locally.
