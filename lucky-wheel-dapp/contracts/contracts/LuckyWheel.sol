// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

/**
 * @title LuckyWheel
 * @dev 基于区块链的公平透明轮盘抽奖合约
 * @author LuckyWheel Team
 */
contract LuckyWheel is VRFConsumerBaseV2, ReentrancyGuard, Ownable {
    // Chainlink VRF 配置
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // 游戏配置
    uint256 public constant SPIN_FEE = 0.01 ether;
    uint256 public constant FIRST_PRIZE_PERCENTAGE = 50;  // 一等奖 50%
    uint256 public constant SECOND_PRIZE_PERCENTAGE = 20; // 二等奖 20%
    uint256 public constant THIRD_PRIZE_PERCENTAGE = 10;  // 三等奖 10%
    uint256 public constant SERVICE_FEE_PERCENTAGE = 20;  // 服务费 20%

    // 奖池状态
    uint256 public prizePool;
    uint256 public totalSpins;
    uint256 public totalPrizesPaid;

    // 玩家状态
    mapping(address => uint256) public playerSpins;
    mapping(address => uint256) public playerTotalWinnings;
    mapping(uint256 => address) public requestIdToPlayer;

    // 事件
    event SpinStarted(address indexed player, uint256 requestId, uint256 timestamp);
    event SpinCompleted(address indexed player, uint256 prizeTier, uint256 prizeAmount, uint256 timestamp);
    event PrizePaid(address indexed winner, uint256 amount, uint256 timestamp);
    event PrizePoolUpdated(uint256 newAmount, uint256 timestamp);

    // 错误定义
    error InsufficientFee();
    error InvalidPrizeTier();
    error RequestNotFound();
    error TransferFailed();

    /**
     * @dev 构造函数
     * @param vrfCoordinatorV2 Chainlink VRF协调器地址
     * @param gasLane 用于VRF请求的gas lane
     * @param subscriptionId VRF订阅ID
     * @param callbackGasLimit 回调函数的gas限制
     */
    constructor(
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    /**
     * @dev 开始抽奖
     * 玩家支付费用并请求随机数
     */
    function spin() external payable nonReentrant {
        if (msg.value != SPIN_FEE) {
            revert InsufficientFee();
        }

        // 更新奖池
        prizePool += msg.value;
        totalSpins++;
        playerSpins[msg.value]++;

        // 请求随机数
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        requestIdToPlayer[requestId] = msg.sender;

        emit SpinStarted(msg.sender, requestId, block.timestamp);
    }

    /**
     * @dev VRF回调函数，处理随机数并确定中奖结果
     * @param requestId 请求ID
     * @param randomWords 随机数数组
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address player = requestIdToPlayer[requestId];
        if (player == address(0)) {
            revert RequestNotFound();
        }

        uint256 randomNumber = randomWords[0];
        (uint256 prizeTier, uint256 prizeAmount) = _calculatePrize(randomNumber);

        // 更新玩家统计
        if (prizeAmount > 0) {
            playerTotalWinnings[player] += prizeAmount;
            totalPrizesPaid += prizeAmount;
            
            // 支付奖金
            (bool success, ) = player.call{value: prizeAmount}("");
            if (!success) {
                revert TransferFailed();
            }

            emit PrizePaid(player, prizeAmount, block.timestamp);
        }

        emit SpinCompleted(player, prizeTier, prizeAmount, block.timestamp);
    }

    /**
     * @dev 根据随机数计算中奖结果
     * @param randomNumber 随机数
     * @return prizeTier 奖项等级 (1=一等奖, 2=二等奖, 3=三等奖, 0=未中奖)
     * @return prizeAmount 奖金金额
     */
    function _calculatePrize(uint256 randomNumber) internal view returns (uint256 prizeTier, uint256 prizeAmount) {
        uint256 normalizedRandom = randomNumber % 100;
        
        if (normalizedRandom < 12) {
            // 一等奖: 12% 概率
            prizeTier = 1;
            prizeAmount = (prizePool * FIRST_PRIZE_PERCENTAGE) / 100;
        } else if (normalizedRandom < 32) {
            // 二等奖: 20% 概率
            prizeTier = 2;
            prizeAmount = (prizePool * SECOND_PRIZE_PERCENTAGE) / 100;
        } else if (normalizedRandom < 62) {
            // 三等奖: 30% 概率
            prizeTier = 3;
            prizeAmount = (prizePool * THIRD_PRIZE_PERCENTAGE) / 100;
        } else {
            // 未中奖: 38% 概率
            prizeTier = 0;
            prizeAmount = 0;
        }
    }

    /**
     * @dev 提取服务费（仅限合约所有者）
     */
    function withdrawServiceFees() external onlyOwner {
        uint256 serviceFees = (prizePool * SERVICE_FEE_PERCENTAGE) / 100;
        if (serviceFees > 0) {
            prizePool -= serviceFees;
            (bool success, ) = owner().call{value: serviceFees}("");
            if (!success) {
                revert TransferFailed();
            }
        }
    }

    /**
     * @dev 获取玩家统计信息
     * @param player 玩家地址
     * @return spins 抽奖次数
     * @return totalWinnings 总中奖金额
     */
    function getPlayerStats(address player) external view returns (uint256 spins, uint256 totalWinnings) {
        return (playerSpins[player], playerTotalWinnings[player]);
    }

    /**
     * @dev 获取合约统计信息
     * @return _prizePool 当前奖池金额
     * @return _totalSpins 总抽奖次数
     * @return _totalPrizesPaid 总支付奖金
     */
    function getContractStats() external view returns (
        uint256 _prizePool,
        uint256 _totalSpins,
        uint256 _totalPrizesPaid
    ) {
        return (prizePool, totalSpins, totalPrizesPaid);
    }

    /**
     * @dev 接收ETH
     */
    receive() external payable {
        // 允许接收ETH
    }
}
