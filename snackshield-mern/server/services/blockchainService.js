const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');

// ── Graceful no-op fallback when blockchain is not configured ─────────────────
const noopService = {
  registerProductOnChain: async () => null,
  recordScanOnChain: async () => null,
  verifyProductOnChain: async () => null,
  getGlobalStats: async () => null,
  getTokenBalance: async () => '0.0',
};

let service = noopService;

try {
  const BLOCKCHAIN_URL = process.env.BLOCKCHAIN_URL;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const SNACKSHIELD_ADDRESS = process.env.SNACKSHIELD_ADDRESS;
  const ACCESS_CONTROL_ADDRESS = process.env.ACCESS_CONTROL_ADDRESS;
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

  if (!BLOCKCHAIN_URL || !PRIVATE_KEY || !SNACKSHIELD_ADDRESS) {
    console.log('⚠️  Blockchain: env vars not set — running in offline mode (no blockchain)');
  } else {
    const SnackShieldABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../abi/SnackShield.json'))).abi;
    const SnackShieldAccessABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../abi/SnackShieldAccess.json'))).abi;
    const SnackShieldTokenABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../abi/SnackShieldToken.json'))).abi;

    class BlockchainService {
      constructor() {
        // Use polling provider to avoid noisy retry logs
        this.provider = new ethers.JsonRpcProvider(BLOCKCHAIN_URL, undefined, { polling: true, pollingInterval: 10000 });
        this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
        this.snackshield = new ethers.Contract(SNACKSHIELD_ADDRESS, SnackShieldABI, this.wallet);
        this.accessControl = new ethers.Contract(ACCESS_CONTROL_ADDRESS, SnackShieldAccessABI, this.wallet);
        this.token = new ethers.Contract(TOKEN_ADDRESS, SnackShieldTokenABI, this.wallet);
      }

      async registerProductOnChain(productData) {
        try {
          const tx = await this.snackshield.registerProduct(
            productData.productName, productData.company, productData.batchId, productData.qrCode,
            Math.floor(new Date(productData.manufactureDate).getTime() / 1000),
            productData.expiryDate ? Math.floor(new Date(productData.expiryDate).getTime() / 1000) : 0
          );
          await tx.wait();
          return ethers.keccak256(ethers.toUtf8Bytes(productData.qrCode));
        } catch (error) {
          return null;
        }
      }

      async recordScanOnChain(productId, result, location) {
        try {
          const productHash = ethers.keccak256(ethers.toUtf8Bytes(productId));
          const tx = await this.snackshield.scanProduct(productHash, result, location);
          await tx.wait();
        } catch (error) {
          return null;
        }
      }

      async verifyProductOnChain(qrCode) {
        try {
          const verification = await this.snackshield.verifyProduct(qrCode);
          const productHash = ethers.keccak256(ethers.toUtf8Bytes(qrCode));
          const trustIndex = await this.snackshield.getTrustIndex(productHash);
          return {
            isGenuine: verification[0], productName: verification[1],
            company: verification[2], scanCount: Number(verification[3]),
            trustIndex: Number(trustIndex)
          };
        } catch (error) {
          return null;
        }
      }

      async getGlobalStats() {
        try {
          const stats = await this.snackshield.getGlobalStats();
          return { productCount: Number(stats[0]), batchCount: Number(stats[1]), totalScans: Number(stats[2]) };
        } catch (error) {
          return null;
        }
      }

      async getTokenBalance(address) {
        try {
          if (!address) return '0.0';
          const balance = await this.token.balanceOf(address);
          return ethers.formatEther(balance);
        } catch (error) {
          return '0.0';
        }
      }
    }

    service = new BlockchainService();
    console.log('✅ Blockchain: Service initialized');
  }
} catch (err) {
  console.log('⚠️  Blockchain: Failed to initialize — running in offline mode');
}

module.exports = service;

try {
  const BLOCKCHAIN_URL = process.env.BLOCKCHAIN_URL;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const SNACKSHIELD_ADDRESS = process.env.SNACKSHIELD_ADDRESS;
  const ACCESS_CONTROL_ADDRESS = process.env.ACCESS_CONTROL_ADDRESS;
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

  if (!BLOCKCHAIN_URL || !PRIVATE_KEY || !SNACKSHIELD_ADDRESS) {
    console.log('⚠️  Blockchain: env vars not set — running in offline mode (no blockchain)');
  } else {
    // Load ABIs
    const SnackShieldABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../abi/SnackShield.json'))).abi;
    const SnackShieldAccessABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../abi/SnackShieldAccess.json'))).abi;
    const SnackShieldTokenABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../abi/SnackShieldToken.json'))).abi;

    class BlockchainService {
      constructor() {
        this.provider = new ethers.JsonRpcProvider(BLOCKCHAIN_URL);
        this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
        this.snackshield = new ethers.Contract(SNACKSHIELD_ADDRESS, SnackShieldABI, this.wallet);
        this.accessControl = new ethers.Contract(ACCESS_CONTROL_ADDRESS, SnackShieldAccessABI, this.wallet);
        this.token = new ethers.Contract(TOKEN_ADDRESS, SnackShieldTokenABI, this.wallet);
      }

      async registerProductOnChain(productData) {
        try {
          const tx = await this.snackshield.registerProduct(
            productData.productName, productData.company, productData.batchId, productData.qrCode,
            Math.floor(new Date(productData.manufactureDate).getTime() / 1000),
            productData.expiryDate ? Math.floor(new Date(productData.expiryDate).getTime() / 1000) : 0
          );
          const receipt = await tx.wait();
          return ethers.keccak256(ethers.toUtf8Bytes(productData.qrCode));
        } catch (error) {
          console.error('❌ Blockchain: Registration failed:', error.message);
          return null;
        }
      }

      async recordScanOnChain(productId, result, location) {
        try {
          const productHash = ethers.keccak256(ethers.toUtf8Bytes(productId));
          const tx = await this.snackshield.scanProduct(productHash, result, location);
          await tx.wait();
        } catch (error) {
          console.error('❌ Blockchain: Scan recording failed:', error.message);
        }
      }

      async verifyProductOnChain(qrCode) {
        try {
          const verification = await this.snackshield.verifyProduct(qrCode);
          const productHash = ethers.keccak256(ethers.toUtf8Bytes(qrCode));
          const trustIndex = await this.snackshield.getTrustIndex(productHash);
          return {
            isGenuine: verification[0], productName: verification[1],
            company: verification[2], scanCount: Number(verification[3]),
            trustIndex: Number(trustIndex)
          };
        } catch (error) {
          return null;
        }
      }

      async getGlobalStats() {
        try {
          const stats = await this.snackshield.getGlobalStats();
          return { productCount: Number(stats[0]), batchCount: Number(stats[1]), totalScans: Number(stats[2]) };
        } catch (error) {
          return null;
        }
      }

      async getTokenBalance(address) {
        try {
          if (!address) return '0.0';
          const balance = await this.token.balanceOf(address);
          return ethers.formatEther(balance);
        } catch (error) {
          return '0.0';
        }
      }
    }

    service = new BlockchainService();
    console.log('✅ Blockchain: Service initialized');
  }
} catch (err) {
  console.log('⚠️  Blockchain: Failed to initialize —', err.message, '— running in offline mode');
}

module.exports = service;
