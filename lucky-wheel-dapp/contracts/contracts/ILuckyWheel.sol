// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ILuckyWheel
 * @dev LuckyWheel智能合约的接口定义
 * @author LuckyWheel Team
 */
interface ILuckyWheel {
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

    // 核心功能
    function spin() external payable;
    function withdrawServiceFees() external;
    
    // 查询功能
    function getPlayerStats(address player) external view returns (uint256 spins, uint256 totalWinnings);
    function getContractStats() external view returns (
        uint256 _prizePool,
        uint256 _totalSpins,
        uint256 _totalPrizesPaid
    );
    
    // 常量查询
    function SPIN_FEE() external view returns (uint256);
    function FIRST_PRIZE_PERCENTAGE() external view returns (uint256);
    function SECOND_PRIZE_PERCENTAGE() external view returns (uint256);
    function THIRD_PRIZE_PERCENTAGE() external view returns (uint256);
    function SERVICE_FEE_PERCENTAGE() external view returns (uint256);
    
    // 状态查询
    function prizePool() external view returns (uint256);
    function totalSpins() external view returns (uint256);
    function totalPrizesPaid() external view returns (uint256);
    function playerSpins(address player) external view returns (uint256);
    function playerTotalWinnings(address player) external view returns (uint256);
}
