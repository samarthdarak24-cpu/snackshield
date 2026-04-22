# AuthenticCheck - AI & Blockchain Based Fake Product Detection System

This system uses a combination of **Ethereum Blockchain** for immutable record keeping and **AI (Isolation Forest)** for detecting cloning and suspicious scanning patterns.

## 🚀 Features
- **Blockchain Storage**: Product identities are hashed and stored on-chain.
- **AI Anomaly Detection**: Detects if a QR code is being cloned (e.g., 500 scans/hour).
- **QR Verification**: Instant verification via mobile/web scanner.
- **Manufacturer Portal**: Secure batch registration and QR generation.
- **Admin Dashboard**: Real-time fraud analytics.

## 🛠️ Setup Instructions

### 1. Backend Setup
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Initialize the AI model:
   ```bash
   python backend/ai_engine.py
   ```
3. Run the Flask server:
   ```bash
   python backend/app.py
   ```

### 2. Frontend Setup
- Just open `frontend/index.html` in any modern browser.
- Ensure the backend is running at `http://127.0.0.1:5000`.

### 3. Blockchain Demo
- For a local blockchain experience, install **Ganache**.
- Update the `BLOCKCHAIN_URL` in `backend/app.py` to your Ganache RPC URL.
- The system currently mocks the hash for demo purposes, but the `ProductAuth.sol` contract is ready for deployment.

## 📂 Project Structure
- `backend/`: Flask API, SQLAlchemy models, and AI engine.
- `blockchain/`: Solidity smart contract.
- `frontend/`: HTML/CSS/JS interface.
- `data/`: AI training dataset and saved model.
