# 🛡️ SnackShield - AI-Powered Product Authentication & Anti-Counterfeit Platform

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)

**Enterprise-grade MERN application with blockchain integration to combat counterfeit products**

[Features](#-features) • [Tech Stack](#-technology-stack) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-endpoints)

</div>

---

## 📋 Overview

SnackShield is a full-stack, production-ready MERN application that leverages blockchain technology and AI to combat the growing problem of counterfeit products. The platform provides end-to-end supply chain tracking, ensuring product authenticity from manufacturer to consumer through immutable blockchain records and intelligent verification systems.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributors](#contributors)

## 🎯 Overview

SnackShield is an innovative solution that leverages blockchain technology to combat counterfeit products. The system provides end-to-end tracking of products from manufacturer to consumer, ensuring authenticity and transparency in the supply chain.

## ✨ Features

- **Blockchain Integration**: Immutable product records on Ethereum blockchain
- **QR Code System**: Generate and scan QR codes for product verification
- **Role-Based Access**: Separate dashboards for Manufacturers, Distributors, Retailers, and Customers
- **Real-Time Alerts**: Socket.IO powered notifications for suspicious activities
- **Batch Management**: Track product batches throughout the supply chain
- **AI Detection**: Intelligent fake product detection algorithms
- **Supply Chain Tracking**: Complete visibility of product journey
- **Secure Authentication**: JWT-based authentication system

## 🛠️ Technology Stack

### Frontend
- React 19.2.0
- Vite 7.3.1
- TailwindCSS 3.4.17
- Framer Motion 12.35.2
- Axios 1.13.6
- React Router DOM 7.13.1
- Socket.IO Client 4.8.3

### Backend
- Node.js
- Express.js 4.18.2
- MongoDB with Mongoose 7.0.3
- Socket.IO 4.6.1
- JWT Authentication
- BCrypt.js 2.4.3
- QRCode 1.5.4
- PDFKit 0.18.0

### Blockchain
- Solidity
- Hardhat
- Ethers.js 6.16.0
- OpenZeppelin Contracts

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- Git
- MetaMask or similar Web3 wallet

### Step 1: Clone the Repository
```bash
git clone https://github.com/samarthdarak24-cpu/snackshield.git
cd snackshield
```

### Step 2: Install Dependencies

**Server:**
```bash
cd snackshield-mern/server
npm install
```

**Client:**
```bash
cd ../client
npm install
```

**Blockchain:**
```bash
cd ../blockchain
npm install
```

### Step 3: Environment Configuration

**Server Environment (.env in snackshield-mern/server/):**
```env
MONGODB_URI=mongodb://localhost:27017/snackshield
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
```

**Blockchain Environment (.env in snackshield-mern/blockchain/):**
```env
PRIVATE_KEY=your_ethereum_private_key_here
```

### Step 4: Start MongoDB
```bash
mongod
```

### Step 5: Deploy Smart Contracts
```bash
cd snackshield-mern/blockchain
npx hardhat node
```

In a new terminal:
```bash
cd snackshield-mern/blockchain
npx hardhat run scripts/deploy.js --network localhost
```

### Step 6: Start the Application

**Terminal 1 - Backend Server:**
```bash
cd snackshield-mern/server
npm run dev
```

**Terminal 2 - Frontend Client:**
```bash
cd snackshield-mern/client
npm run dev
```

### Step 7: Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Blockchain Node:** http://localhost:8545

## 🎮 Usage

### Default Test Credentials

**Manufacturer:**
- Email: manufacturer@test.com
- Password: password123

**Distributor:**
- Email: distributor@test.com
- Password: password123

**Retailer:**
- Email: retailer@test.com
- Password: password123

### User Workflows

#### Manufacturer
1. Login to manufacturer dashboard
2. Create new product batches
3. Generate QR codes for products
4. Register products on blockchain
5. Transfer batches to distributors

#### Distributor
1. Login to distributor dashboard
2. Receive batches from manufacturers
3. Verify product authenticity
4. Transfer batches to retailers
5. Monitor supply chain

#### Retailer
1. Login to retailer dashboard
2. Receive batches from distributors
3. Verify product authenticity
4. Sell products to customers
5. Report suspicious products

#### Customer
1. Scan product QR code
2. Verify product authenticity
3. View product journey
4. Report fake products

## 📁 Project Structure

```
snackshield/
├── snackshield-mern/
│   ├── client/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/    # Reusable components
│   │   │   ├── pages/         # Page components
│   │   │   ├── services/      # API services
│   │   │   ├── context/       # React context
│   │   │   └── App.jsx        # Main app component
│   │   └── package.json
│   │
│   ├── server/                # Node.js backend
│   │   ├── controllers/       # Route controllers
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Custom middleware
│   │   └── index.js          # Server entry point
│   │
│   └── blockchain/           # Smart contracts
│       ├── contracts/        # Solidity contracts
│       ├── scripts/          # Deployment scripts
│       ├── test/            # Contract tests
│       └── hardhat.config.js
│
├── EXECUTION_STEPS.md        # Execution guide
├── EXECUTION_STEPS.html      # HTML version for PDF
└── README.md                 # This file
```

## 🔐 Smart Contracts

### SnackShield.sol
Main contract for product registration and verification.

### SnackShieldAccess.sol
Role-based access control contract.

### SnackShieldToken.sol
Token contract for rewards and incentives.

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `POST /api/products` - Create new product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Batches
- `POST /api/batches` - Create new batch
- `GET /api/batches` - Get all batches
- `GET /api/batches/:id` - Get batch by ID
- `PUT /api/batches/:id/transfer` - Transfer batch

### Verification
- `POST /api/verify` - Verify product authenticity
- `GET /api/verify/:qrCode` - Verify by QR code

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id` - Mark alert as read

## 🧪 Testing

### Run Smart Contract Tests
```bash
cd snackshield-mern/blockchain
npx hardhat test
```

### Run Server Tests
```bash
cd snackshield-mern/server
npm test
```

## 📊 Database Schema

### User Model
- name, email, password, role, walletAddress, createdAt

### Product Model
- name, description, manufacturer, batchId, qrCode, blockchainHash, status

### Batch Model
- batchNumber, products, manufacturer, currentOwner, status, transfers

### Alert Model
- type, message, severity, userId, productId, isRead, createdAt

## 🤝 Contributors

- **Group Leader:** Samarth Darak
- **GitHub:** [@samarthdarak24-cpu](https://github.com/samarthdarak24-cpu)
- **Collaborator:** [@Disha3112](https://github.com/Disha3112)

## 📄 License

This project is created for educational purposes.

## 📞 Support

For any queries or issues, please open an issue on GitHub or contact the project maintainers.

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Hardhat for Ethereum development environment
- MongoDB for database solutions
- React and Vite teams for frontend tools

---

## 👨‍💻 Developer

**Samarth Darak**  
Computer Engineering Student @ VIT Pune  
GitHub: [@samarthdarak24-cpu](https://github.com/samarthdarak24-cpu)  
LinkedIn: [Samarth Darak](https://linkedin.com/in/samarth-darak-27ba93378)

---

<div align="center">

### ⭐ Star this repo if you're fighting against counterfeit products!

**Made with ❤️ for a safer marketplace**

</div>

---

**Submission Date:** 16th May 2026  
**Repository:** https://github.com/samarthdarak24-cpu/snackshield
