# SnackShield - Execution Steps

## Project Overview
SnackShield is a blockchain-based fake product detection system built with MERN stack (MongoDB, Express.js, React, Node.js) and Ethereum smart contracts.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- Git
- Hardhat (for blockchain)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/samarthdarak24-cpu/snackshield.git
cd snackshield
```

### 2. Install Dependencies

**Server Setup:**
```bash
cd snackshield-mern/server
npm install
```

**Client Setup:**
```bash
cd ../client
npm install
```

**Blockchain Setup:**
```bash
cd ../blockchain
npm install
```

### 3. Environment Configuration

**Server (.env):**
Create `.env` file in `snackshield-mern/server/`:
```
MONGODB_URI=mongodb://localhost:27017/snackshield
JWT_SECRET=your_jwt_secret_key
PORT=5000
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
```

**Blockchain (.env):**
Create `.env` file in `snackshield-mern/blockchain/`:
```
PRIVATE_KEY=your_private_key
```

### 4. Start MongoDB
```bash
mongod
```

### 5. Deploy Smart Contracts
```bash
cd snackshield-mern/blockchain
npx hardhat node
# In a new terminal:
npx hardhat run scripts/deploy.js --network localhost
```

### 6. Start the Application

**Terminal 1 - Server:**
```bash
cd snackshield-mern/server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd snackshield-mern/client
npm run dev
```

### 7. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Blockchain:** http://localhost:8545

## Default User Credentials
- **Manufacturer:** manufacturer@test.com / password123
- **Distributor:** distributor@test.com / password123
- **Retailer:** retailer@test.com / password123

## Key Features
- Product registration with blockchain verification
- QR code generation and scanning
- Real-time alerts via Socket.IO
- Role-based access control (Manufacturer, Distributor, Retailer, Customer)
- Batch management and tracking
- Fake product detection

## Technology Stack
- **Frontend:** React, Vite, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express.js, MongoDB, Socket.IO
- **Blockchain:** Solidity, Hardhat, Ethers.js
- **Authentication:** JWT

## Repository
https://github.com/samarthdarak24-cpu/snackshield

## Submission Date
16th May 2026
