const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SnackShield Smart Contracts", function () {
  let snackshield, accessControl, token;
  let owner, manufacturer, distributor, retailer, publicUser;

  beforeEach(async function () {
    [owner, manufacturer, distributor, retailer, publicUser] = await ethers.getSigners();

    const SnackShieldAccess = await ethers.getContractFactory("SnackShieldAccess");
    accessControl = await SnackShieldAccess.deploy();
    await accessControl.waitForDeployment();

    const SnackShieldToken = await ethers.getContractFactory("SnackShieldToken");
    token = await SnackShieldToken.deploy();
    await token.waitForDeployment();

    const SnackShield = await ethers.getContractFactory("SnackShield");
    snackshield = await SnackShield.deploy();
    await snackshield.waitForDeployment();

    await snackshield.authorizePartner(manufacturer.address);
  });

  describe("Product Registration", function () {
    it("should register a new product on-chain", async function () {
      await snackshield.connect(manufacturer).registerProduct(
        "Quinoa Puffs", "PureFoods", "BCH-001", "QR-001", 100, 999999
      );
      expect(await snackshield.productCount()).to.equal(1);
    });

    it("should reject duplicate products", async function () {
      await snackshield.connect(manufacturer).registerProduct(
        "Test", "Co", "B1", "QR-DUP", 100, 200
      );
      await expect(
        snackshield.connect(manufacturer).registerProduct("Test", "Co", "B1", "QR-DUP", 100, 200)
      ).to.be.revertedWith("SnackShield: product already registered");
    });

    it("should reject unauthorized registrations", async function () {
      await expect(
        snackshield.connect(publicUser).registerProduct("Fake", "Scam", "B-X", "QR-X", 100, 200)
      ).to.be.revertedWith("SnackShield: caller is not authorized");
    });
  });

  describe("Product Verification", function () {
    beforeEach(async function () {
      await snackshield.connect(manufacturer).registerProduct(
        "Protein Bar", "HealthCo", "BCH-002", "QR-V-001", 100, 999999
      );
    });

    it("should verify genuine products", async function () {
      const result = await snackshield.verifyProduct("QR-V-001");
      expect(result.isGenuine).to.be.true;
      expect(result.productName).to.equal("Protein Bar");
    });

    it("should return false for unknown products", async function () {
      const result = await snackshield.verifyProduct("FAKE-QR");
      expect(result.isGenuine).to.be.false;
    });
  });

  describe("Supply Chain Journey", function () {
    let productId;
    beforeEach(async function () {
      await snackshield.connect(manufacturer).registerProduct(
        "Trail Mix", "NutriFoods", "BCH-003", "QR-J-001", 100, 999999
      );
      productId = ethers.keccak256(ethers.toUtf8Bytes("QR-J-001"));
      await snackshield.authorizePartner(distributor.address);
    });

    it("should add journey checkpoints", async function () {
      await snackshield.connect(distributor).addJourneyStep(
        productId, "Distributor", "Warehouse A", "Mumbai", "India", "In Transit", "Picked up"
      );
      const journey = await snackshield.getJourneyHistory(productId);
      expect(journey.length).to.equal(2); // 1 auto + 1 manual
    });
  });

  describe("Scan Recording", function () {
    let productId;
    beforeEach(async function () {
      await snackshield.connect(manufacturer).registerProduct(
        "Chips", "SnackCo", "BCH-004", "QR-S-001", 100, 999999
      );
      productId = ethers.keccak256(ethers.toUtf8Bytes("QR-S-001"));
    });

    it("should record scans and calculate trust index", async function () {
      await snackshield.scanProduct(productId, "Genuine", "A");
      await snackshield.scanProduct(productId, "Genuine", "B");
      await snackshield.scanProduct(productId, "Genuine", "C");
      await snackshield.scanProduct(productId, "Fake", "D");
      expect(await snackshield.getTrustIndex(productId)).to.equal(75);
    });

    it("should raise alert on fake scan", async function () {
      await expect(
        snackshield.scanProduct(productId, "Fake", "Market")
      ).to.emit(snackshield, "AlertRaised");
    });
  });

  describe("SST Token", function () {
    it("should have 1M initial supply", async function () {
      expect(await token.totalSupply()).to.equal(ethers.parseEther("1000000"));
    });

    it("should mint scan rewards", async function () {
      await token.setMinter(owner.address, true);
      await token.mintScanReward(publicUser.address);
      expect(await token.balanceOf(publicUser.address)).to.equal(ethers.parseEther("10"));
    });
  });
});
