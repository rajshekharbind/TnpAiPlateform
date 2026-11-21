# 🎓 TnP AI Platform – Complete Placement Management System

A **full‑stack placement & training platform** designed for colleges and universities to manage students, companies, recruiters, jobs, and analytics in one place.

This repository contains **both backend and frontend** code with clear setup instructions, APIs, and troubleshooting steps.

---


<img width="8643" height="7214" alt="diagram (1)" src="https://github.com/user-attachments/assets/e65386b8-7832-4eaf-b662-b2949d17d1bd" />


## 🚀 Overview

The **TnP AI Platform** simplifies placement operations by providing:

* Centralized job & recruiter management
* Student profiles similar to Haveloc-style portals
* Real‑time analytics and dashboards
* Secure authentication using Clerk
* Scalable backend APIs with Express.js

---

## 🧱 Tech Stack

### Frontend

* **React 18** + **TypeScript**
* **Vite** – Fast build tool
* **Material UI (MUI)** + **Radix UI**
* **Tailwind CSS** for styling
* **Clerk** – Authentication
* **Recharts** – Charts & analytics

### Backend

* **Node.js**
* **Express.js** – REST API
* **CORS** enabled
* **In‑memory JSON data** (easy to replace with DB later)

---

## 📁 Project Structure

```
hackto/
├── backend/                 # Express.js API server
│   ├── server.js            # Main backend server (Port 5000)
│   ├── package.json
│   └── README.md
├── frontend/                # React + TypeScript + Vite app
│   ├── src/
│   │   └── app/
│   │       ├── App.tsx
│   │       └── components/
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── vite.config.ts
├── STARTUP_GUIDE.md
├── FEATURES.md
└── README.md
```

---

## ⚡ Quick Start (Fix 500 Error)

> **IMPORTANT:** You must run **both backend and frontend servers**.

### 1️⃣ Start Backend Server

```bash
cd backend
npm install
npm start
```

**Expected output:**

```
🚀 Backend server running on http://localhost:5000
📊 Jobs API available at http://localhost:5000/api/jobs/enriched
🏢 Companies API available at http://localhost:5000/api/companies
👥 Recruiters API available at http://localhost:5000/api/recruiters
✅ Health check at http://localhost:5000/api/health
```

---

### 2️⃣ Start Frontend Server

```bash
cd frontend
npm install
npm run dev
```

**Expected output:**

```
VITE ready in xxxx ms
➜ Local: http://localhost:5173/
```

---

## ✅ Verify Setup

1. **Backend Health Check**
   Open: `http://localhost:5000/api/health`

   Expected response:

   ```json
   {"status":"ok","message":"Backend server is running"}
   ```

2. **Frontend App**
   Open: `http://localhost:5173`

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`) – REQUIRED

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxx
VITE_API_BASE_URL=http://localhost:5000
VITE_MOCK_INTERVIEW_URL=https://cpduel.dev
```

⚠️ Notes:

* File name must be exactly `.env`
* Must be inside `frontend/`
* Restart frontend after changes

---

## 📡 API Endpoints

**Base URL:** `http://localhost:5000`

### Health

* `GET /api/health`

### Jobs

* `GET /api/jobs/enriched`
* `GET /api/jobs/:id`

### Companies

* `GET /api/companies`
* `GET /api/companies/:id`

### Recruiters

* `GET /api/recruiters`
* `GET /api/recruiters?companyId=:id`
* `GET /api/recruiters/:id`

---

## 🎯 Key Features

### 👨‍🎓 Students

* Complete profile (26+ sections)
* Job discovery with filters
* Application tracking
* Document uploads
* Company insights
* Blogs & experiences
* Points & ranking system

### 🧑‍💼 Admins / Coordinators

* Student management
* Company directory
* Recruiter database
* Analytics dashboard
* Mock interview system
* Document verification

### 💬 Communication

* In‑app messaging
* Audio calling
* Video calling
* Dark / Light mode

---

## 🛠️ Troubleshooting

### ❌ 500 Internal Server Error

**Most common reason:** Backend not running

```bash
cd backend
npm start
```

---

### ❌ Wrong API URL

Ensure in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

⚠️ Use `localhost`, not `127.0.0.1`

---

### ❌ Port Already in Use

```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or change backend port and update frontend `.env`.

---

## 📦 Backend Details

**package.json highlights:**

* Express.js server
* CORS enabled
* Nodemon for development

Scripts:

```bash
npm start   # Production
npm run dev # Development
```

---

## 🚀 Production Deployment

### Backend

```bash
npm install --production
node server.js
```

### Frontend

```bash
npm run build
```

Serve the `dist/` folder using any static hosting.

---

## 📊 Sample Data

Backend includes demo data for:

* 15+ Jobs
* 8 Companies
* 12 Recruiters

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

---

## 📄 License

MIT License

---

## 🔗 Quick Links

* **STARTUP_GUIDE.md** – Detailed setup
* **FEATURES.md** – Full feature list
* **backend/README.md** – Backend API docs

---

