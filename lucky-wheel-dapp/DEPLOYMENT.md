# 🚀 LuckyWheel DApp 部署指南

本指南将帮助你部署LuckyWheel DApp到Sepolia测试网。

## 📋 前置要求

### 1. 环境准备
- Node.js 16+ 
- npm 或 yarn
- Git
- MetaMask钱包

### 2. 账户准备
- Sepolia测试网ETH (从水龙头获取)
- Chainlink VRF订阅账户
- Infura或Alchemy项目ID

## 🔧 智能合约部署

### 步骤1: 安装依赖
```bash
cd lucky-wheel-dapp/contracts
npm install
```

### 步骤2: 配置环境变量
```bash
# 复制环境变量模板
cp env.example .env

# 编辑 .env 文件，填入实际值
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here
VRF_SUBSCRIPTION_ID=your_vrf_subscription_id_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 步骤3: 配置Chainlink VRF
1. 访问 [Chainlink VRF](https://vrf.chain.link/)
2. 创建新订阅
3. 添加资金到订阅账户
4. 记录订阅ID和Gas Lane

### 步骤4: 部署合约
```bash
# 编译合约
npx hardhat compile

# 部署到Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### 步骤5: 验证合约
```bash
# 合约验证
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS \
  VRF_COORDINATOR_ADDRESS \
  GAS_LANE \
  SUBSCRIPTION_ID \
  CALLBACK_GAS_LIMIT
```

## 🌐 前端应用部署

### 步骤1: 安装依赖
```bash
cd lucky-wheel-dapp/frontend
npm install
```

### 步骤2: 配置环境变量
```bash
# 复制环境变量模板
cp env.example .env.local

# 编辑 .env.local 文件
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

### 步骤3: 构建应用
```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm start
```

### 步骤4: 部署到Vercel (推荐)
1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

## 🔗 网络配置

### Sepolia测试网
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- **区块浏览器**: https://sepolia.etherscan.io
- **Chainlink VRF**: 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed

### 本地测试网
- **Chain ID**: 1337
- **RPC URL**: http://127.0.0.1:8545

## 📊 部署后验证

### 1. 合约功能测试
- 连接钱包
- 支付抽奖费用
- 触发VRF请求
- 验证中奖结果

### 2. 前端功能测试
- 页面加载正常
- 钱包连接成功
- 轮盘动画流畅
- 响应式设计

### 3. 网络交互测试
- 交易确认时间
- Gas费用合理
- 事件记录正确

## 🚨 常见问题

### 1. VRF请求失败
- 检查订阅ID是否正确
- 确认订阅账户有足够资金
- 验证Gas限制设置

### 2. 合约部署失败
- 检查私钥格式
- 确认账户有足够ETH
- 验证网络配置

### 3. 前端连接失败
- 检查合约地址
- 确认网络ID匹配
- 验证RPC URL

## 🔒 安全注意事项

1. **私钥安全**: 永远不要将私钥提交到Git仓库
2. **环境变量**: 使用.env文件管理敏感信息
3. **网络选择**: 生产环境使用主网，测试使用测试网
4. **权限控制**: 定期审查合约权限设置

## 📞 技术支持

如果遇到部署问题：
1. 检查本指南的常见问题部分
2. 查看Hardhat和Next.js官方文档
3. 在GitHub Issues中搜索相关问题
4. 提交新的Issue描述问题

---

**🎉 祝你部署顺利！如有问题，欢迎在GitHub上讨论。**
