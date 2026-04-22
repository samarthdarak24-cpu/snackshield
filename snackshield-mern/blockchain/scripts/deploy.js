const hre = require("hardhat");
const fs  = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("\n🚀 Deploying SnackShield contracts...");
  console.log("   Deployer:", deployer.address);
  console.log("   Balance: ", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH\n");

  // ── 1. Deploy SnackShieldAccess ──────────────────────────────────────────
  const Access = await hre.ethers.getContractFactory("SnackShieldAccess");
  const access = await Access.deploy();
  await access.waitForDeployment();
  const accessAddr = await access.getAddress();
  console.log("✅ SnackShieldAccess deployed:", accessAddr);

  // ── 2. Deploy SnackShieldToken ───────────────────────────────────────────
  const Token = await hre.ethers.getContractFactory("SnackShieldToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("✅ SnackShieldToken  deployed:", tokenAddr);

  // ── 3. Deploy SnackShield (core) ─────────────────────────────────────────
  const Core = await hre.ethers.getContractFactory("SnackShield");
  const core = await Core.deploy();
  await core.waitForDeployment();
  const coreAddr = await core.getAddress();
  console.log("✅ SnackShield       deployed:", coreAddr);

  // ── 4. Grant SnackShield contract minter role on Token ───────────────────
  await token.setMinter(coreAddr, true);
  console.log("✅ SnackShield set as SST minter");

  // ── 5. Authorize SnackShield contract as partner in Access ───────────────
  await access.registerPartner(coreAddr, "SnackShield Core", "SnackShield Inc.", 0);
  console.log("✅ SnackShield registered as Admin partner in Access");

  // ── 6. Export ABIs to server/abi ─────────────────────────────────────────
  const abiDir = path.join(__dirname, "../../server/abi");
  if (!fs.existsSync(abiDir)) fs.mkdirSync(abiDir, { recursive: true });

  const contracts = [
    { name: "SnackShield",       artifact: "SnackShield"       },
    { name: "SnackShieldToken",  artifact: "SnackShieldToken"  },
    { name: "SnackShieldAccess", artifact: "SnackShieldAccess" },
  ];

  for (const c of contracts) {
    const artifact = await hre.artifacts.readArtifact(c.artifact);
    const out = { abi: artifact.abi, contractName: c.name };
    fs.writeFileSync(
      path.join(abiDir, `${c.name}.json`),
      JSON.stringify(out, null, 2)
    );
    console.log(`📄 ABI exported: server/abi/${c.name}.json`);
  }

  // ── 7. Update server/.env with deployed addresses ────────────────────────
  const envPath = path.join(__dirname, "../../server/.env");
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

  const updates = {
    BLOCKCHAIN_URL:          "http://127.0.0.1:8545",
    PRIVATE_KEY:             deployer.privateKey || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    ACCESS_CONTROL_ADDRESS:  accessAddr,
    TOKEN_ADDRESS:           tokenAddr,
    SNACKSHIELD_ADDRESS:     coreAddr,
  };

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }

  fs.writeFileSync(envPath, envContent);
  console.log("\n📝 server/.env updated with contract addresses");

  // ── 8. Summary ───────────────────────────────────────────────────────────
  console.log("\n" + "═".repeat(55));
  console.log("  DEPLOYMENT COMPLETE");
  console.log("═".repeat(55));
  console.log("  SnackShieldAccess :", accessAddr);
  console.log("  SnackShieldToken  :", tokenAddr);
  console.log("  SnackShield       :", coreAddr);
  console.log("═".repeat(55));
  console.log("\n  Next steps:");
  console.log("  1. Keep 'npx hardhat node' running");
  console.log("  2. Restart the backend: cd server && npm start");
  console.log("  3. Blockchain is now live at http://127.0.0.1:8545\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
