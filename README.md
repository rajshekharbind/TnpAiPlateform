# 🎓 TnP AI Platform – Complete Placement Management System

A **full‑stack placement & training platform** designed for colleges and universities to manage students, companies, recruiters, jobs, and analytics in one place.

This repository contains **both backend and frontend** code with clear setup instructions, APIs, and troubleshooting steps.

---
<img width="1887" height="977" alt="image" src="https://github.com/user-attachments/assets/8c72a08b-c99b-4285-8e59-7d1309d0efb8" />
<img width="1887" height="977" alt="image" src="https://github.com/user-attachments/assets/78b6f78e-ea14-44f6-89bb-064ffd76596c" />
<img width="1897" height="972" alt="image" src="https://github.com/user-attachments/assets/46677344-61db-41d2-add5-9643a92544d6" />
<img width="1895" height="980" alt="image" src="https://github.com/user-attachments/assets/113a2501-e047-4aa6-a95c-4c5bcbdfc1b6" />
<img width="1875" height="975" alt="image" src="https://github.com/user-attachments/assets/8427fc51-99c1-4b7c-b676-6e40702da6e8" />
<img width="1860" height="982" alt="image" src="https://github.com/user-attachments/assets/31d9b301-56cd-4bce-bded-ff2afc54ecb3" />
<img width="1862" height="975" alt="image" src="https://github.com/user-attachments/assets/61e3f943-010d-4b3e-b1dc-c6d6f016c1e3" />
<img width="1882" height="968" alt="image" src="https://github.com/user-attachments/assets/356e0d2f-b8be-4c30-be1f-98e9707e3c90" />
<img width="1883" height="951" alt="image" src="https://github.com/user-attachments/assets/c431b550-d07d-405c-8afe-83d69dc8ebc6" />
<img width="1902" height="976" alt="image" src="https://github.com/user-attachments/assets/5058ff2a-6998-4df3-aff7-1b38a7ed96a4" />
<img width="1885" height="973" alt="image" src="https://github.com/user-attachments/assets/16d336f6-d0b5-4f3e-8a5f-b51258fb9f62" />
<img width="1885" height="973" alt="image" src="https://github.com/user-attachments/assets/1e6a5b5d-50dc-47fe-934b-aef03429aff7" />
<img width="1905" height="975" alt="image" src="https://github.com/user-attachments/assets/f47d562a-90e1-45b7-a30f-94d6b78655b2" />
<img width="1876" height="953" alt="image" src="https://github.com/user-attachments/assets/c6f1943d-059c-4252-baf1-4164b6f34034" />
<img width="1892" height="976" alt="image" src="https://github.com/user-attachments/assets/deefd031-5aaf-4a70-9e08-df4f32d9c91e" />
<img width="1883" height="977" alt="image" src="https://github.com/user-attachments/assets/278ed064-e636-420c-b3a2-fb995946d374" />
<img width="1903" height="976" alt="image" src="https://github.com/user-attachments/assets/cf73b0f8-7b2f-45a7-905e-1671f1159306" />
<img width="1891" height="972" alt="image" src="https://github.com/user-attachments/assets/dd7401bb-4ac4-4274-8664-b50c37de1db2" />


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

