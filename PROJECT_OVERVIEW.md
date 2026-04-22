# 🛡️ SnackShield: AI-Powered Product Authentication System

SnackShield is a premium, production-ready MERN stack application designed to combat product counterfeiting through AI-driven fraud detection and secure QR code verification.

---

## 🚀 Mission
Protecting brands and consumers by providing an immutable, real-time verification system that detects counterfeit patterns using machine learning and secure supply chain tracking.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (Custom Premium Dark Theme)
- **Animations:** Framer Motion
- **Icons:** Lucide React & React Icons
- **Charts:** Recharts
- **QR Scanning:** html5-qrcode

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Real-time:** Socket.IO (for fraud alerts)
- **Security:** JWT (JSON Web Tokens) & BcryptJS

---

## 👥 User Roles & Dashboards

The system supports 4 distinct roles, each with a tailored premium dashboard:

1. **👑 Administrator**
   - **Access:** System-wide management.
   - **Features:** Global analytics, company management, user auditing, and cross-partner fraud monitoring.

2. **🏭 Manufacturer**
   - **Access:** Product production side.
   - **Features:** Batch creation, unique QR code generation, production metrics, and batch lifecycle tracking.

3. **🚚 Distributor**
   - **Access:** Logistics and supply chain.
   - **Features:** Supply chain integrity tracking, distribution analytics, and transit verification.

4. **🏪 Retailer**
   - **Access:** Point of sale.
   - **Features:** Product authenticity verification, customer scan monitoring, and shelf-integrity reporting.

---

## 📂 Project Structure

```text
snackshield-mern/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Dashboard and feature pages
│   │   ├── context/        # State management (Auth, Theme)
│   │   └── App.jsx         # Main routing
├── server/                 # Express Backend
│   ├── models/             # Mongoose schemas (User, Product, Batch, Scan)
│   ├── routes/             # API endpoints
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth and security middleware
│   └── index.js            # Server entry point
└── uploads/                # Generated QR codes and assets
```

---

## ⚡ Quick Start & Running Instructions

### 1. Prerequisite
Ensure **MongoDB** is running locally on `mongodb://127.0.0.1:27017/snackshield`.

### 2. Start Backend
```bash
cd snackshield-mern/server
npm install
npm run dev
```
*Server runs on: http://localhost:5000*

### 3. Start Frontend
```bash
cd snackshield-mern/client
npm install
npm run dev
```
*Client runs on: http://localhost:5173*

---

## 🔑 Test Credentials

Use these pre-seeded accounts to explore the different dashboards:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@snackshield.com` | `admin123` |
| **Manufacturer** | `manufacturer@test.com` | `test123` |
| **Distributor** | `distributor@test.com` | `test123` |
| **Retailer** | `retailer@test.com` | `test123` |

---

## 🔍 Core Features

- **AI Fraud Detection:** Analyzes scan patterns (geographic jumps, rapid scanning) to detect cloned QR codes.
- **Batch Generation:** Automated batch ID generation and crypto-secure QR code creation.
- **Real-time Alerts:** Instant notifications via Socket.IO when suspicious activity is detected.
- **Premium UI:** High-fidelity dark mode with glassmorphism effects and smooth transitions.
- **Verification Portal:** Public-facing page for instant QR/Serial verification.

---

## 🔧 Maintenance
- **Re-seed Data:** Run `npm run seed` in the `server` directory to reset test accounts.
- **Logs:** Monitor `server` terminal for "MongoDB Synchronized" confirmation.
