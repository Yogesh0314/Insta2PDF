# InstaNotes – Deployment & Setup Guide

InstaNotes is a production-ready application to convert Instagram post carousels and study notes into clean, printable A4 PDF documents.

---

## 1. Local Development

### Prerequisites
- Java 21+ (`java -version`)
- Node.js 18+ and npm (`node -v`)

### Start the Spring Boot Backend (Port 8080)
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

### Start the React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 2. Deploying to Production

### Part A: Deploy Backend to Render (Docker Web Service)

1. **Push your code to a GitHub repository**.
2. Log in to [Render.com](https://render.com/) and click **New +** → **Web Service**.
3. Select your repository.
4. Set the following configurations:
   - **Root Directory**: `backend`
   - **Runtime**: **Docker** (Render will automatically detect `backend/Dockerfile`)
   - **Instance Type**: Free
5. In **Environment Variables**, add:
   - `RAPIDAPI_KEY`: `67495c646emshc3c1643d44562bap18bc06jsnb9653fe4f78d`
   - `RAPIDAPI_HOST`: `instagram-scraper-2026-profiles-posts-reels.p.rapidapi.com`
   - `CORS_ALLOWED_ORIGINS`: `*` (or your specific Vercel frontend URL)
6. Click **Deploy Web Service**.
7. Note down your backend URL (e.g. `https://instanotes-backend.onrender.com`).

---

### Part B: Deploy Frontend to Vercel

1. Log in to [Vercel.com](https://vercel.com/) and click **Add New** → **Project**.
2. Import your GitHub repository.
3. Configure the project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: **Vite**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: Your Render backend URL (e.g. `https://instanotes-backend.onrender.com` without trailing slash)
5. Click **Deploy**.

`frontend/vercel.json` is already included to ensure client-side routing rewrites work seamlessly.
