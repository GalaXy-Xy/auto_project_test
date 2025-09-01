# 🎰 LuckyWheel - 区块链轮盘抽奖DApp

一个基于区块链技术的公平透明轮盘抽奖去中心化应用。

## ✨ 项目特色

- 🎯 **公平透明**: 使用Chainlink VRF保证随机性
- 💰 **智能奖池**: 自动分配奖金，无需人工干预
- 🔒 **安全可靠**: 基于以太坊智能合约，资金安全有保障
- 🎨 **精美界面**: 现代化UI设计，流畅的抽奖动画
- 📱 **多端适配**: 支持桌面端和移动端

## 🏗️ 技术架构

### 智能合约
- **语言**: Solidity
- **框架**: Hardhat
- **随机数**: Chainlink VRF
- **测试网**: Sepolia

### 前端应用
- **框架**: Next.js
- **区块链交互**: wagmi + ethers.js
- **样式**: Tailwind CSS
- **状态管理**: React Hooks

## 🎲 游戏规则

- **参与费用**: 每次抽奖0.01 ETH
- **奖池分配**:
  - 🥇 一等奖 (1名): 奖池的50%
  - 🥈 二等奖 (2名): 奖池的20%
  - 🥉 三等奖 (5名): 奖池的10%
  - 💼 服务费 (20%): 项目运营费用

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn
- MetaMask钱包

### 安装依赖
```bash
# 安装合约依赖
cd contracts
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 部署合约
```bash
cd contracts
npx hardhat compile
npx hardhat deploy --network sepolia
```

### 启动前端
```bash
cd frontend
npm run dev
```

## 📁 项目结构

```
lucky-wheel-dapp/
├── contracts/          # 智能合约
├── frontend/           # 前端应用
├── scripts/            # 部署脚本
├── test/              # 测试文件
└── README.md          # 项目说明
```

## 🔧 开发指南

详细的开发文档请参考各目录下的README文件。

## 📄 许可证

MIT License

---

**🎉 祝你好运！愿幸运女神眷顾每一位玩家！**
