import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Trophy, Coins } from 'lucide-react';

const GameStats = ({ stats }) => {
  const {
    prizePool = '0.00',
    totalSpins = 0,
    totalPrizesPaid = '0.00',
    userSpins = 0,
    userWinnings = '0.00'
  } = stats || {};

  // 统计数据卡片
  const statCards = [
    {
      title: '奖池总额',
      value: `${prizePool} ETH`,
      icon: Coins,
      color: 'from-yellow-400 to-yellow-600',
      description: '当前可领取的奖金总额'
    },
    {
      title: '总抽奖次数',
      value: totalSpins.toLocaleString(),
      icon: TrendingUp,
      color: 'from-blue-400 to-blue-600',
      description: '所有玩家的抽奖总次数'
    },
    {
      title: '已发放奖金',
      value: `${totalPrizesPaid} ETH`,
      icon: Trophy,
      color: 'from-green-400 to-green-600',
      description: '累计发放的奖金总额'
    },
    {
      title: '我的抽奖次数',
      value: userSpins.toLocaleString(),
      icon: Users,
      color: 'from-purple-400 to-purple-600',
      description: '您当前的抽奖次数'
    }
  ];

  // 中奖概率信息
  const prizeProbabilities = [
    { tier: '一等奖', probability: '12%', color: 'text-yellow-400' },
    { tier: '二等奖', probability: '20%', color: 'text-blue-400' },
    { tier: '三等奖', probability: '30%', color: 'text-green-400' },
    { tier: '未中奖', probability: '38%', color: 'text-gray-400' }
  ];

  return (
    <div className="space-y-6">
      {/* 统计数据网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color} bg-opacity-20`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-300">{card.title}</p>
                <p className="text-lg font-bold text-white">{card.value}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">{card.description}</p>
          </motion.div>
        ))}
      </div>

      {/* 个人统计 */}
      <motion.div
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Trophy className="mr-2 text-purple-400" />
          我的游戏统计
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">抽奖次数</span>
              <span className="text-white font-semibold">{userSpins}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((userSpins / 100) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">累计中奖</span>
              <span className="text-white font-semibold">{userWinnings} ETH</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((parseFloat(userWinnings) / 1) * 100, 100)}%` }}

                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>
        </div>

        {/* 中奖率计算 */}
        {userSpins > 0 && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm text-gray-300">
              中奖率: <span className="text-green-400 font-semibold">
                {((parseFloat(userWinnings) > 0 ? 1 : 0) / userSpins * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        )}
      </motion.div>

      {/* 中奖概率说明 */}
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">中奖概率说明</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {prizeProbabilities.map((prize, index) => (
            <motion.div
              key={prize.tier}
              className="text-center p-3 bg-white/5 rounded-lg border border-white/10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <p className={`text-lg font-bold ${prize.color}`}>{prize.tier}</p>
              <p className="text-2xl font-bold text-white">{prize.probability}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
          <p className="text-sm text-blue-300 text-center">
            💡 每次抽奖费用为 0.01 ETH，中奖概率基于智能合约随机数生成，确保公平公正
          </p>
        </div>
      </motion.div>

      {/* 游戏规则提示 */}
      <motion.div
        className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-400/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">🎯 游戏规则</h3>
        <div className="space-y-2 text-sm text-gray-200">
          <p>• 每次抽奖需要支付 0.01 ETH 作为游戏费用</p>
          <p>• 中奖奖金将直接发送到您的钱包地址</p>
          <p>• 一等奖：奖池的 12%，二等奖：奖池的 20%，三等奖：奖池的 30%</p>
          <p>• 未中奖时，费用将进入奖池，为后续玩家提供奖金</p>
          <p>• 所有交易都在区块链上公开透明，确保公平性</p>
        </div>
      </motion.div>
    </div>
  );
};

export default GameStats;
