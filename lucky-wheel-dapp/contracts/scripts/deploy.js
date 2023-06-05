const hre = require("hardhat");

async function main() {
  console.log("🚀 开始部署LuckyWheel智能合约...");

  // 获取部署账户
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 使用账户: ${deployer.address}`);
  console.log(`💰 账户余额: ${hre.ethers.utils.formatEther(await deployer.getBalance())} ETH`);

  // 部署配置
  const networkName = hre.network.name;
  console.log(`🌐 部署网络: ${networkName}`);

  // 根据网络配置Chainlink VRF参数
  let vrfCoordinator, gasLane, subscriptionId, callbackGasLimit;

  if (networkName === "sepolia") {
    // Sepolia测试网配置
    vrfCoordinator = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
    gasLane = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
    subscriptionId = process.env.VRF_SUBSCRIPTION_ID || "1234"; // 需要从环境变量获取
    callbackGasLimit = 500000;
  } else if (networkName === "localhost" || networkName === "hardhat") {
    // 本地测试网配置
    vrfCoordinator = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    gasLane = "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";
    subscriptionId = "1";
    callbackGasLimit = 500000;
  } else {
    throw new Error(`不支持的网络: ${networkName}`);
  }

  console.log("🔧 VRF配置:");
  console.log(`  - 协调器: ${vrfCoordinator}`);
  console.log(`  - Gas Lane: ${gasLane}`);
  console.log(`  - 订阅ID: ${subscriptionId}`);
  console.log(`  - 回调Gas限制: ${callbackGasLimit}`);

  // 部署LuckyWheel合约
  console.log("\n📦 部署LuckyWheel合约...");
  const LuckyWheel = await hre.ethers.getContractFactory("LuckyWheel");
  const luckyWheel = await LuckyWheel.deploy(
    vrfCoordinator,
    gasLane,
    subscriptionId,
    callbackGasLimit
  );

  await luckyWheel.deployed();
  console.log(`✅ LuckyWheel合约已部署到: ${luckyWheel.address}`);

  // 等待几个区块确认
  console.log("⏳ 等待区块确认...");
  await luckyWheel.deployTransaction.wait(5);

  // 验证合约
  if (networkName !== "localhost" && networkName !== "hardhat") {
    console.log("🔍 验证合约...");
    try {
      await hre.run("verify:verify", {
        address: luckyWheel.address,
        constructorArguments: [
          vrfCoordinator,
          gasLane,
          subscriptionId,
          callbackGasLimit
        ],
      });
      console.log("✅ 合约验证成功");
    } catch (error) {
      console.log("⚠️ 合约验证失败:", error.message);
    }
  }

  // 输出部署信息
  console.log("\n🎉 部署完成！");
  console.log("=" * 50);
  console.log(`📋 合约名称: LuckyWheel`);
  console.log(`📍 合约地址: ${luckyWheel.address}`);
  console.log(`🌐 部署网络: ${networkName}`);
  console.log(`👤 部署者: ${deployer.address}`);
  console.log(`⏰ 部署时间: ${new Date().toLocaleString()}`);
  console.log("=" * 50);

  // 保存部署信息到文件
  const deploymentInfo = {
    contractName: "LuckyWheel",
    contractAddress: luckyWheel.address,
    network: networkName,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    vrfConfig: {
      coordinator: vrfCoordinator,
      gasLane: gasLane,
      subscriptionId: subscriptionId,
      callbackGasLimit: callbackGasLimit
    }
  };

  const fs = require("fs");
  const deploymentPath = `deployments/${networkName}.json`;
  
  // 确保目录存在
  if (!fs.existsSync("deployments")) {
    fs.mkdirSync("deployments");
  }
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 部署信息已保存到: ${deploymentPath}`);

  return luckyWheel;
}

// 错误处理
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  });
