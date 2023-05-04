import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Wallet, RotateCcw, Trophy, Clock, Users } from 'lucide-react';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [prizePool, setPrizePool] = useState('0.00');
  const [totalSpins, setTotalSpins] = useState(0);
  const [userSpins, setUserSpins] = useState(0);
  const [userWinnings, setUserWinnings] = useState('0.00');

  // 模拟连接钱包
  const connectWallet = () => {
    setIsConnected(true);
    // 这里应该集成真实的钱包连接逻辑
  };

  // 模拟抽奖
  const spinWheel = () => {
    if (!isConnected) return;
    
    setIsSpinning(true);
    setSpinResult(null);
    
    // 模拟抽奖过程
    setTimeout(() => {
      const results = [
        { tier: 1, name: '一等奖', probability: 12, color: 'from-yellow-400 to-yellow-600' },
        { tier: 2, name: '二等奖', probability: 20, color: 'from-blue-400 to-blue-600' },
        { tier: 3, name: '三等奖', probability: 30, color: 'from-green-400 to-green-600' },
        { tier: 0, name: '未中奖', probability: 38, color: 'from-gray-400 to-gray-600' }
      ];
      
      const random = Math.random() * 100;
      let cumulative = 0;
      let selectedResult = results[0];
      
      for (const result of results) {
        cumulative += result.probability;
        if (random <= cumulative) {
          selectedResult = result;
          break;
        }
      }
      
      setSpinResult(selectedResult);
      setIsSpinning(false);
      
      // 更新统计数据
      setUserSpins(prev => prev + 1);
      setTotalSpins(prev => prev + 1);
      
      if (selectedResult.tier > 0) {
        const winnings = Math.random() * 0.1 + 0.01; // 随机奖金
        setUserWinnings(prev => (parseFloat(prev) + winnings).toFixed(4));
      }
    }, 3000);
  };

  // 轮盘扇区数据
  const wheelSectors = [
    { tier: 1, name: '一等奖', color: 'from-yellow-400 to-yellow-600', angle: 0 },
    { tier: 2, name: '二等奖', color: 'from-blue-400 to-blue-600', angle: 45 },
    { tier: 3, name: '三等奖', color: 'from-green-400 to-green-600', angle: 90 },
    { tier: 0, name: '未中奖', color: 'from-gray-400 to-gray-600', angle: 135 },
    { tier: 2, name: '二等奖', color: 'from-blue-400 to-blue-600', angle: 180 },
    { tier: 3, name: '三等奖', color: 'from-green-400 to-green-600', angle: 225 },
    { tier: 3, name: '三等奖', color: 'from-green-400 to-green-600', angle: 270 },
    { tier: 3, name: '三等奖', color: 'from-green-400 to-green-600', angle: 315 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Head>
        <title>LuckyWheel - 区块链轮盘抽奖</title>
        <meta name="description" content="基于区块链的公平透明轮盘抽奖DApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <header className="text-center mb-12">
          <motion.h1 
            className="text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            🎰 LuckyWheel
          </motion.h1>
          <p className="text-xl text-blue-200">
            基于区块链的公平透明轮盘抽奖
          </p>
        </header>

        {/* 主要内容区域 */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* 左侧：轮盘 */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-8">幸运轮盘</h2>
              
              {/* 轮盘容器 */}
              <div className="relative w-80 h-80 mx-auto mb-8">
                <motion.div
                  className="w-full h-full rounded-full border-8 border-white/20 relative overflow-hidden"
                  animate={isSpinning ? { rotate: 360 * 5 } : { rotate: 0 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  {/* 轮盘扇区 */}
                  {wheelSectors.map((sector, index) => (
                    <div
                      key={index}
                      className={`absolute w-full h-full bg-gradient-to-r ${sector.color}`}
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 45 * Math.cos(sector.angle * Math.PI / 180)}% ${50 + 45 * Math.sin(sector.angle * Math.PI / 180)}%)`,
                        transform: `rotate(${sector.angle}deg)`,
                      }}
                    />
                  ))}
                  
                  {/* 中心点 */}
                  <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg" />
                </motion.div>
                
                {/* 指针 */}
                <div className="absolute top-0 left-1/2 w-4 h-16 bg-red-500 transform -translate-x-1/2 -translate-y-2 z-10">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-500" />
                </div>
              </div>

              {/* 抽奖按钮 */}
              {!isConnected ? (
                <button
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
                >
                  <Wallet className="mr-2" />
                  连接钱包
                </button>
              ) : (
                <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className={`px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 transform ${
                    isSpinning 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105'
                  } text-white flex items-center justify-center mx-auto`}
                >
                  {isSpinning ? (
                    <>
                      <RotateCcw className="mr-2 animate-spin" />
                      抽奖中...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="mr-2" />
                      开始抽奖 (0.01 ETH)
                    </>
                  )}
                </button>
              )}

              {/* 抽奖结果 */}
              {spinResult && (
                <motion.div
                  className="mt-8 p-6 bg-white/20 backdrop-blur-md rounded-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {spinResult.tier > 0 ? '🎉 恭喜中奖！' : '😔 很遗憾'}
                  </h3>
                  <p className={`text-xl font-semibold bg-gradient-to-r ${spinResult.color} bg-clip-text text-transparent`}>
                    {spinResult.name}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* 右侧：统计信息 */}
          <div className="space-y-6">
            {/* 奖池信息 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Trophy className="mr-2 text-yellow-400" />
                奖池信息
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">当前奖池</span>
                  <span className="text-white font-bold">{prizePool} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">总抽奖次数</span>
                  <span className="text-white font-bold">{totalSpins}</span>
                </div>
              </div>
            </div>

            {/* 用户统计 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users className="mr-2 text-blue-400" />
                我的统计
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">抽奖次数</span>
                  <span className="text-white font-bold">{userSpins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">总中奖</span>
                  <span className="text-white font-bold">{userWinnings} ETH</span>
                </div>
              </div>
            </div>

            {/* 游戏规则 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Clock className="mr-2 text-green-400" />
                游戏规则
              </h3>
              <div className="text-sm text-blue-200 space-y-2">
                <p>• 每次抽奖费用：0.01 ETH</p>
                <p>• 一等奖：奖池的50%</p>
                <p>• 二等奖：奖池的20%</p>
                <p>• 三等奖：奖池的10%</p>
                <p>• 服务费：奖池的20%</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
