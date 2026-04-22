const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  🛡️  SnackShield Blockchain Deployment");
  console.log("═══════════════════════════════════════════════════════════");
  console.log();

  const [deployer] = await hre.ethers.getSigners();
  console.log("  📍 Deployer Address:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("  💰 Deployer Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log();

  // ── Deploy SnackShieldAccess (Role-Based Access Control) ──
  console.log("  [1/3] Deploying SnackShieldAccess...");
  const SnackShieldAccess = await hre.ethers.getContractFactory("SnackShieldAccess");
  const accessControl = await SnackShieldAccess.deploy();
  await accessControl.waitForDeployment();
  const accessAddress = await accessControl.getAddress();
  console.log("  ✅  SnackShieldAccess deployed to:", accessAddress);
  console.log();

  // ── Deploy SnackShieldToken (SST Reward Token) ──
  console.log("  [2/3] Deploying SnackShieldToken (SST)...");
  const SnackShieldToken = await hre.ethers.getContractFactory("SnackShieldToken");
  const token = await SnackShieldToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("  ✅  SnackShieldToken deployed to:", tokenAddress);

  const totalSupply = await token.totalSupply();
  console.log("  📊 Initial Supply:", hre.ethers.formatEther(totalSupply), "SST");
  console.log();

  // ── Deploy SnackShield (Main Contract) ──
  console.log("  [3/3] Deploying SnackShield (Main Contract)...");
  const SnackShield = await hre.ethers.getContractFactory("SnackShield");
  const snackshield = await SnackShield.deploy();
  await snackshield.waitForDeployment();
  const mainAddress = await snackshield.getAddress();
  console.log("  ✅  SnackShield deployed to:", mainAddress);
  console.log();

  // ── Configure Cross-Contract Permissions ──
  console.log("  ⚙️  Configuring permissions...");
  
  // Set main contract as an authorized minter for SST tokens
  const setMinterTx = await token.setMinter(mainAddress, true);
  await setMinterTx.wait();
  console.log("  ✅  SnackShield set as SST token minter");

  console.log();
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  🎉 DEPLOYMENT COMPLETE");
  console.log("═══════════════════════════════════════════════════════════");
  console.log();
  console.log("  Contract Addresses:");
  console.log("  ┌──────────────────────────────────────────────────────┐");
  console.log(`  │  SnackShieldAccess:  ${accessAddress}  │`);
  console.log(`  │  SnackShieldToken:   ${tokenAddress}  │`);
  console.log(`  │  SnackShield:        ${mainAddress}  │`);
  console.log("  └──────────────────────────────────────────────────────┘");
  console.log();

  // ── Save Deployment Addresses ──
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      SnackShieldAccess: accessAddress,
      SnackShieldToken: tokenAddress,
      SnackShield: mainAddress,
    },
  };

  const outputDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${hre.network.name}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`  💾 Deployment info saved to: deployments/${hre.network.name}.json`);
  console.log();

  // ── Also save ABI files for backend integration ──
  const abiDir = path.join(__dirname, "..", "abi");
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  const contracts = ["SnackShield", "SnackShieldAccess", "SnackShieldToken"];
  for (const name of contracts) {
    const artifact = await hre.artifacts.readArtifact(name);
    fs.writeFileSync(
      path.join(abiDir, `${name}.json`),
      JSON.stringify({ abi: artifact.abi, contractName: name }, null, 2)
    );
  }
  console.log("  📄 ABI files saved to: abi/");
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
