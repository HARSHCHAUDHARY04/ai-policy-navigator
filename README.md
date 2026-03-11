# AI Policy Navigator

The **AI Policy Navigator** is a comprehensive, personalized insurance policy recommendation and comparison platform. It features a modern web interface for desktop users and a feature-rich mobile application for users on the go. The system uses AI to analyze user needs and provide tailored insurance suggestions.

## 🏗 Project Structure

The repository is divided into two main components:

- **`website/`**: A React-based web application with a Node.js/Express backend.
- **`application/`**: A React Native (Expo) mobile application.

---

## 🌐 Web Application (`website/ai-policy-navigator`)

A premium, dark-themed fintech dashboard for browsing, searching, and comparing insurance policies.

### Key Features
- **AI Recommendations**: Quiz-based recommendations using Google Gemini AI.
- **Smart Search**: Natural language search for insurance policies.
- **Side-by-Side Comparison**: Compare up to 4 policies.
- **Custom Policy Support**: Add your own external insurance quotes to the comparison table for a true side-by-side view.
- **Auth System**: JWT-based authentication for secure user sessions.

### Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **AI**: Google Generative AI (Gemini Flash).

### Security Enhancements
- **Helmet**: Integrated for standard HTTP security headers.
- **Rate Limiting**: Protection against brute-force attacks on API routes.
- **Password Hashing**: Secure storage using `bcryptjs`.

### Getting Started (Web)
1. **Server**:
   ```bash
   cd website/ai-policy-navigator/server
   npm install
   # Update .env with your MONGODB_URI and GEMINI_API_KEY
   npm run dev
   ```
   *Note: Server runs on port 5001 to avoid macOS system conflicts.*

2. **Frontend**:
   ```bash
   cd website/ai-policy-navigator
   npm install
   npm run dev
   ```

---

## 📱 Mobile Application (`application/Policy-app`)

A cross-platform mobile app designed to mirror the website's premium aesthetic and functionality.

### Key Features
- **Redesigned UI**: Premium dark fintech aesthetic with glassmorphism and smooth animations.
- **Feature Parity**: Access to AI recommendations, policy comparison, and claims guidance.
- **Premium Calculator**: Quickly estimate insurance premiums.
- **Claims Guide**: Detailed walkthrough for filing insurance claims.

### Tech Stack
- **Framework**: React Native with Expo.
- **Navigation**: Expo Router (file-based routing).
- **Styling**: Native styling with glassmorphic effects.
- **Animations**: React Native Reanimated.

### Getting Started (Mobile)
1. **Installation**:
   ```bash
   cd application/Policy-app
   npm install
   ```
2. **Run**:
   ```bash
   npx expo start
   ```

---

## 🛠 Recent Updates
- ✅ **Custom Policy Forms**: Users can now input their own insurance data into the comparison tool.
- ✅ **Backend Security Hardening**: Implemented Rate Limiting and Security Headers.
- ✅ **Mobile UI Refresh**: Full overhaul of the mobile app to match the website's dark theme.
- ✅ **Server Stability**: Resolved port conflicts and improved startup reliability.

---

## 📄 License
Internal Project - All Rights Reserved.
