# AI Policy Navigator — Website Report

## 1. Overview
The **AI Policy Navigator** website is a polished, dark‑themed insurance policy discovery and comparison platform built with modern web technologies. It provides users with AI‑driven recommendations, transactional search, side‑by‑side policy comparisons, and user account management. The backend exposes REST endpoints backed by MongoDB.

This report outlines the architecture, key components, features, setup instructions, and security considerations specific to the web application located in `website/ai-policy-navigator`.

---

## 2. Project Structure
```
ai-policy-navigator/
├── public/                 # Static assets (favicon, index.html, robots.txt)
├── src/                    # Frontend source code (React + TypeScript)
│   ├── components/         # UI components organized by feature
│   │   ├── landing/         # Landing page sections
│   │   ├── layout/          # Navbar, footer
│   │   └── ui/              # Reusable UI primitives (buttons, tooltip, etc.)
│   ├── context/            # React contexts (AuthContext)
│   ├── hooks/              # Custom hooks (use-toast)
│   ├── lib/                # Utility helpers (utils.ts)
│   └── pages/              # Route pages (AIInsuranceSearch, CompareInsurance, etc.)
├── server/                 # Node/Express backend with API and models
│   ├── models/             # Mongoose schemas (Policy, Provider, User)
│   └── index.js            # Main server file with routes and AI logic
├── package.json
├── tsconfig.json & friends # TypeScript configuration
└── vitest.config.ts        # Testing configuration
```

---

## 3. Frontend Features
- **AI Recommendations** through quiz answers processed by Google Gemini AI.
- **Search**: Natural language policy search powered by backend endpoints.
- **Comparison Engine**: Select up to four policies for side‑by‑side evaluation, including the ability to add custom/external quotes.
- **Authentication**: JWT‑based login/register flows, protected routes via `AuthContext`.
- **Premium Calculator** and **Risk Dashboard** pages.
- **Responsive UI** with Tailwind CSS and Framer Motion animations.
- **User feedback** via toast notifications and modals.

Pages include:
- `Index.tsx` (landing)  
- `AIInsuranceSearch.tsx`  
- `CompareInsurance.tsx`  
- `InsuranceQuiz.tsx`  
- `PremiumCalculator.tsx`  
- `RiskDashboard.tsx`  
- Auth pages: `LoginPage.tsx`, `SignupPage.tsx`, `CustomerProfile.tsx`
- Utility pages: `NotFound.tsx`, `PrivacyPage.tsx`.

---

## 4. Backend API
Implemented with Express and Mongoose. Key routes:

### Authentication
- `POST /api/auth/register` — Create user, return JWT
- `POST /api/auth/login` — Authenticate, return JWT
- `GET /api/auth/me` — Retrieve authenticated user (protected)

### Data Endpoints
- `GET /api/policies?type=<type>` — List policies (filter by type)
- `GET /api/providers` — List insurance providers
- `POST /api/users` — Create user record (used internally)

### AI Recommendation
- `POST /api/ai/recommend` — Accepts quiz answers array; constructs Gemini prompt to generate 4 tailored policy recommendations

### Middlewares
- `helmet` for security headers
- `cors` for cross‑origin requests
- `express-rate-limit` to throttle API usage
- JWT verification via custom `authenticateToken`

### Database Models
- `Policy`: stores insurance policy metadata
- `Provider`: insurer information
- `User`: account details with hashed password


---

## 5. Security and Operations
- Passwords hashed using `bcryptjs` (12 salt rounds).
- JWT tokens signed with `JWT_SECRET` (configurable via `.env`).
- Rate limiting configured at 100 requests per 15 minutes.
- Helmet applied globally; routes scoped under `/api/`.
- MongoDB connection is disabled by default in `index.js` (logged as skipped).
- Environment variables required: `MONGODB_URI`, `GEMINI_API_KEY`, `JWT_SECRET`.


---

## 6. Development & Deployment

### Quickstart (local)
1. **Backend**
    ```bash
    cd website/ai-policy-navigator/server
    npm install
    # copy .env.example to .env and set MONGODB_URI, GEMINI_API_KEY, JWT_SECRET
    npm run dev          # starts on port 5001
    ```
2. **Frontend**
    ```bash
    cd website/ai-policy-navigator
    npm install
    npm run dev          # starts Vite dev server on default port 5173
    ```

### Testing
- Unit tests live under `src/test`. Run `npm run test` (configured via Vitest).

### Build
- Frontend: `npm run build` generates production assets in `dist/`.
- Backend: typically deployed with Node 18+ on a server behind a reverse proxy.

---

## 7. Known Limitations & Future Work
- **Database connection disabled** by default for local development; needs re‑enabling.
- **Rate limiter** may need tuning for production traffic.
- AI parsing logic is simplistic and may fail if Gemini returns malformed JSON.
- Mobile app (in sibling `application/Policy-app`) is maintained separately; keep API contracts stable across both clients.


---

## 8. Appendix
- **Dependencies**: See `package.json` for full list of packages used on both client and server.
- **Configuration files**: `tsconfig.*`, `vite.config.ts`, `tailwind.config.ts` for build tooling.


---

*Prepared on 11 March 2026 by GitHub Copilot*  
<small>Use this report as the starting point for project documentation, presentations, or evaluation.</small>
