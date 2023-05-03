const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LuckyWheel", function () {
  let LuckyWheel;
  let luckyWheel;
  let owner;
  let player1;
  let player2;
  let vrfCoordinator;
  let linkToken;

  const SPIN_FEE = ethers.utils.parseEther("0.01");
  const VRF_SUBSCRIPTION_ID = 1;
  const VRF_GAS_LANE = "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";
  const VRF_CALLBACK_GAS_LIMIT = 500000;

  beforeEach(async function () {
    // 获取测试账户
    [owner, player1, player2] = await ethers.getSigners();

    // 部署模拟的VRF协调器
    const MockVRFCoordinator = await ethers.getContractFactory("MockVRFCoordinatorV2");
    vrfCoordinator = await MockVRFCoordinator.deploy();
    await vrfCoordinator.deployed();

    // 部署LuckyWheel合约
    LuckyWheel = await ethers.getContractFactory("LuckyWheel");
    luckyWheel = await LuckyWheel.deploy(
      vrfCoordinator.address,
      VRF_GAS_LANE,
      VRF_SUBSCRIPTION_ID,
      VRF_CALLBACK_GAS_LIMIT
    );
    await luckyWheel.deployed();

    // 给玩家一些ETH用于测试
    await owner.sendTransaction({
      to: player1.address,
      value: ethers.utils.parseEther("1.0")
    });

    await owner.sendTransaction({
      to: player2.address,
      value: ethers.utils.parseEther("1.0")
    });
  });

  describe("部署", function () {
    it("应该正确设置合约参数", async function () {
      expect(await luckyWheel.owner()).to.equal(owner.address);
      expect(await luckyWheel.SPIN_FEE()).to.equal(SPIN_FEE);
      expect(await luckyWheel.FIRST_PRIZE_PERCENTAGE()).to.equal(50);
      expect(await luckyWheel.SECOND_PRIZE_PERCENTAGE()).to.equal(20);
      expect(await luckyWheel.THIRD_PRIZE_PERCENTAGE()).to.equal(10);
      expect(await luckyWheel.SERVICE_FEE_PERCENTAGE()).to.equal(20);
    });

    it("初始状态应该正确", async function () {
      expect(await luckyWheel.prizePool()).to.equal(0);
      expect(await luckyWheel.totalSpins()).to.equal(0);
      expect(await luckyWheel.totalPrizesPaid()).to.equal(0);
    });
  });

  describe("抽奖功能", function () {
    it("玩家应该能够支付正确费用进行抽奖", async function () {
      const initialBalance = await player1.getBalance();
      const initialPrizePool = await luckyWheel.prizePool();

      await luckyWheel.connect(player1).spin({ value: SPIN_FEE });

      expect(await luckyWheel.prizePool()).to.equal(initialPrizePool.add(SPIN_FEE));
      expect(await luckyWheel.totalSpins()).to.equal(1);
      expect(await luckyWheel.playerSpins(player1.address)).to.equal(1);
    });

    it("应该拒绝错误的费用金额", async function () {
      const wrongFee = ethers.utils.parseEther("0.02");
      
      await expect(
        luckyWheel.connect(player1).spin({ value: wrongFee })
      ).to.be.revertedWithCustomError(luckyWheel, "InsufficientFee");
    });

    it("应该拒绝0费用抽奖", async function () {
      await expect(
        luckyWheel.connect(player1).spin({ value: 0 })
      ).to.be.revertedWithCustomError(luckyWheel, "InsufficientFee");
    });
  });

  describe("VRF回调", function () {
    it("应该正确处理VRF回调", async function () {
      // 玩家进行抽奖
      await luckyWheel.connect(player1).spin({ value: SPIN_FEE });
      
      // 获取请求ID
      const filter = luckyWheel.filters.SpinStarted(player1.address);
      const events = await luckyWheel.queryFilter(filter);
      const requestId = events[0].args.requestId;

      // 模拟VRF回调
      const randomWords = [ethers.utils.randomBytes(32)];
      await vrfCoordinator.fulfillRandomWords(requestId, luckyWheel.address, randomWords);

      // 验证事件
      const completedFilter = luckyWheel.filters.SpinCompleted(player1.address);
      const completedEvents = await luckyWheel.queryFilter(completedFilter);
      expect(completedEvents.length).to.equal(1);
    });
  });

  describe("奖池分配", function () {
    it("应该正确计算奖池分配", async function () {
      // 多个玩家进行抽奖
      await luckyWheel.connect(player1).spin({ value: SPIN_FEE });
      await luckyWheel.connect(player2).spin({ value: SPIN_FEE });

      const prizePool = await luckyWheel.prizePool();
      expect(prizePool).to.equal(SPIN_FEE.mul(2));
    });
  });

  describe("权限控制", function () {
    it("只有所有者能够提取服务费", async function () {
      // 玩家进行抽奖
      await luckyWheel.connect(player1).spin({ value: SPIN_FEE });

      // 非所有者不能提取服务费
      await expect(
        luckyWheel.connect(player1).withdrawServiceFees()
      ).to.be.revertedWith("Ownable: caller is not the owner");

      // 所有者可以提取服务费
      await expect(
        luckyWheel.connect(owner).withdrawServiceFees()
      ).to.not.be.reverted;
    });
  });

  describe("统计信息", function () {
    it("应该正确记录玩家统计", async function () {
      await luckyWheel.connect(player1).spin({ value: SPIN_FEE });
      await luckyWheel.connect(player1).spin({ value: SPIN_FEE });

      const [spins, winnings] = await luckyWheel.getPlayerStats(player1.address);
      expect(spins).to.equal(2);
      expect(winnings).to.equal(0); // 还没有VRF回调，所以没有中奖
    });

    it("应该正确返回合约统计", async function () {
      await luckyWheel.connect(player1).spin({ value: SPIN_FEE });
      await luckyWheel.connect(player2).spin({ value: SPIN_FEE });

      const [prizePool, totalSpins, totalPrizesPaid] = await luckyWheel.getContractStats();
      expect(prizePool).to.equal(SPIN_FEE.mul(2));
      expect(totalSpins).to.equal(2);
      expect(totalPrizesPaid).to.equal(0);
    });
  });

  describe("事件", function () {
    it("应该正确发出SpinStarted事件", async function () {
      await expect(luckyWheel.connect(player1).spin({ value: SPIN_FEE }))
        .to.emit(luckyWheel, "SpinStarted")
        .withArgs(player1.address, ethers.constants.AnyValue);
    });
  });
});

// 模拟VRF协调器合约
contract("MockVRFCoordinatorV2", function () {
  function fulfillRandomWords(
    uint256 requestId,
    address consumer,
    uint256[] memory randomWords
  ) external {
    VRFConsumerBaseV2(consumer).rawFulfillRandomWords(requestId, randomWords);
  }
});
