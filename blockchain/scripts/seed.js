const hre = require("hardhat");

/**
 * Seed script - Populates the deployed contracts with sample data
 * Run after deployment: npx hardhat run scripts/seed.js --network localhost
 */
async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  🌱 SnackShield Blockchain - Seeding Data");
  console.log("═══════════════════════════════════════════════════════════");
  console.log();

  const [owner, manufacturer, distributor, retailer] = await hre.ethers.getSigners();

  // ── Load deployed contract addresses ──
  const fs = require("fs");
  const path = require("path");
  const deploymentPath = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ No deployment found. Run deploy.js first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  
  // ── Attach to deployed contracts ──
  const SnackShield = await hre.ethers.getContractFactory("SnackShield");
  const snackshield = SnackShield.attach(deployment.contracts.SnackShield);

  const SnackShieldAccess = await hre.ethers.getContractFactory("SnackShieldAccess");
  const accessControl = SnackShieldAccess.attach(deployment.contracts.SnackShieldAccess);

  // ── 1. Register Supply Chain Partners ──
  console.log("  [1/4] Registering supply chain partners...");

  if (manufacturer) {
    await accessControl.registerPartner(
      manufacturer.address,
      "PureFoods Manufacturing",
      "PureFoods India Pvt Ltd",
      1 // Manufacturer
    );
    console.log("    ✅ Manufacturer registered:", manufacturer.address);
  }

  if (distributor) {
    await accessControl.registerPartner(
      distributor.address,
      "FastTrack Logistics",
      "FastTrack Distribution Co.",
      2 // Distributor
    );
    console.log("    ✅ Distributor registered:", distributor.address);
  }

  if (retailer) {
    await accessControl.registerPartner(
      retailer.address,
      "MegaMart Retail",
      "MegaMart Stores Ltd",
      3 // Retailer
    );
    console.log("    ✅ Retailer registered:", retailer.address);
  }

  // ── 2. Authorize partners on main contract ──
  console.log("  [2/4] Authorizing partners on main contract...");
  
  if (manufacturer) {
    await snackshield.authorizePartner(manufacturer.address);
    console.log("    ✅ Manufacturer authorized");
  }
  if (distributor) {
    await snackshield.authorizePartner(distributor.address);
    console.log("    ✅ Distributor authorized");
  }
  if (retailer) {
    await snackshield.authorizePartner(retailer.address);
    console.log("    ✅ Retailer authorized");
  }

  // ── 3. Register sample batches and products ──
  console.log("  [3/4] Registering sample products on blockchain...");

  const products = [
    {
      name: "Quinoa Puffs - Sea Salt",
      company: "PureFoods India Pvt Ltd",
      batchId: "BCH-GB0-9921",
      qrCode: "SNCK-QP-SS-001-2026",
      mfgDate: Math.floor(Date.now() / 1000) - 86400 * 30,
      expDate: Math.floor(Date.now() / 1000) + 86400 * 180,
    },
    {
      name: "Dark Chocolate Protein Bar",
      company: "PureFoods India Pvt Ltd",
      batchId: "BCH-FBN-7710",
      qrCode: "SNCK-DC-PB-002-2026",
      mfgDate: Math.floor(Date.now() / 1000) - 86400 * 15,
      expDate: Math.floor(Date.now() / 1000) + 86400 * 365,
    },
    {
      name: "Spicy Masala Chips (150g)",
      company: "PureFoods India Pvt Ltd",
      batchId: "BCH-CRK-4490",
      qrCode: "SNCK-SM-CH-003-2026",
      mfgDate: Math.floor(Date.now() / 1000) - 86400 * 7,
      expDate: Math.floor(Date.now() / 1000) + 86400 * 120,
    },
    {
      name: "Premium Organic Trail Mix",
      company: "PureFoods India Pvt Ltd",
      batchId: "BCH-NTR-2026A",
      qrCode: "SNCK-OT-MX-004-2026",
      mfgDate: Math.floor(Date.now() / 1000) - 86400 * 3,
      expDate: Math.floor(Date.now() / 1000) + 86400 * 270,
    },
  ];

  const signerForProducts = manufacturer || owner;

  for (const p of products) {
    // Register batch
    const batchHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes(p.batchId));
    try {
      await snackshield.connect(signerForProducts).registerBatch(
        p.batchId, p.name, p.mfgDate, p.expDate, 200
      );
      console.log(`    📦 Batch ${p.batchId} registered`);
    } catch (e) {
      console.log(`    ⚠️  Batch ${p.batchId} may already exist, skipping...`);
    }

    // Register product
    try {
      const tx = await snackshield.connect(signerForProducts).registerProduct(
        p.name, p.company, p.batchId, p.qrCode, p.mfgDate, p.expDate
      );
      await tx.wait();
      console.log(`    ✅ Product "${p.name}" → QR: ${p.qrCode}`);
    } catch (e) {
      console.log(`    ⚠️  Product "${p.name}" may already exist, skipping...`);
    }
  }

  // ── 4. Simulate supply chain journey ──
  console.log("  [4/4] Simulating supply chain journey...");

  const firstProductId = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes(products[0].qrCode)
  );

  // Distributor picks up
  if (distributor) {
    await snackshield.connect(distributor).addJourneyStep(
      firstProductId,
      "Distributor",
      "FastTrack Central Warehouse",
      "Mumbai",
      "India",
      "In Transit",
      "Product received from manufacturer"
    );
    console.log("    🚚 Distributor checkpoint added");
  }

  // Retailer receives
  if (retailer) {
    await snackshield.connect(retailer).addJourneyStep(
      firstProductId,
      "Retailer",
      "MegaMart Store #42",
      "Pune",
      "India",
      "Delivered",
      "Product delivered to retail shelf"
    );
    console.log("    🏪 Retailer checkpoint added");
  }

  // Simulate genuine scan
  await snackshield.connect(owner).scanProduct(
    firstProductId,
    "Genuine",
    "MegaMart Store #42, Pune"
  );
  console.log("    ✅ Genuine scan recorded");

  // Simulate suspicious scan
  await snackshield.connect(owner).scanProduct(
    firstProductId,
    "Suspicious",
    "Unknown Location"
  );
  console.log("    ⚠️  Suspicious scan recorded (alert raised)");

  // ── Print Stats ──
  console.log();
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  📊 On-Chain Stats:");

  const stats = await snackshield.getGlobalStats();
  console.log(`    Products:  ${stats[0].toString()}`);
  console.log(`    Batches:   ${stats[1].toString()}`);
  console.log(`    Scans:     ${stats[2].toString()}`);

  const journey = await snackshield.getJourneyHistory(firstProductId);
  console.log(`    Journey Steps (Product #1): ${journey.length}`);

  const trustIndex = await snackshield.getTrustIndex(firstProductId);
  console.log(`    Trust Index (Product #1): ${trustIndex.toString()}%`);

  // Verify product
  const verification = await snackshield.verifyProduct(products[0].qrCode);
  console.log(`    Verification: ${verification[0] ? "✅ GENUINE" : "❌ NOT FOUND"} - ${verification[1]}`);

  console.log();
  console.log("  🎉 Seeding complete!");
  console.log("═══════════════════════════════════════════════════════════");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
