import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Trophy, AlertCircle } from 'lucide-react';

const WheelSpinner = ({ onSpin, isSpinning, spinResult, disabled }) => {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 轮盘扇区配置
  const sectors = [
    { id: 1, name: '一等奖', color: 'from-yellow-400 to-yellow-600', probability: 12, angle: 0 },
    { id: 2, name: '二等奖', color: 'from-blue-400 to-blue-600', probability: 20, angle: 45 },
    { id: 3, name: '三等奖', color: 'from-green-400 to-green-600', probability: 30, angle: 90 },
    { id: 0, name: '未中奖', color: 'from-gray-400 to-gray-600', probability: 38, angle: 135 },
    { id: 2, name: '二等奖', color: 'from-blue-400 to-blue-600', probability: 20, angle: 180 },
    { id: 3, name: '三等奖', color: 'from-green-400 to-green-600', probability: 30, angle: 225 },
    { id: 3, name: '三等奖', color: 'from-green-400 to-green-600', probability: 30, angle: 270 },
    { id: 3, name: '三等奖', color: 'from-green-400 to-green-600', probability: 30, angle: 315 }
  ];

  // 处理抽奖
  const handleSpin = () => {
    if (disabled || isSpinning) return;
    
    setIsAnimating(true);
    onSpin();
  };

  // 动画效果
  useEffect(() => {
    if (isSpinning) {
      // 随机旋转角度
      const randomRotation = Math.random() * 360 + 1440; // 至少转4圈
      setRotation(prev => prev + randomRotation);
      
      // 3秒后停止动画
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isSpinning]);

  return (
    <div className="relative w-80 h-80 mx-auto mb-8">
      {/* 轮盘容器 */}
      <motion.div
        className="w-full h-full rounded-full border-8 border-white/20 relative overflow-hidden"
        animate={{ rotate: isAnimating ? rotation : 0 }}
        transition={{ 
          duration: 3, 
          ease: "easeOut",
          type: "spring",
          stiffness: 50
        }}
      >
        {/* 轮盘扇区 */}
        {sectors.map((sector, index) => (
          <div
            key={index}
            className={`absolute w-full h-full bg-gradient-to-r ${sector.color}`}
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${50 + 45 * Math.cos(sector.angle * Math.PI / 180)}% ${50 + 45 * Math.sin(sector.angle * Math.PI / 180)}%)`,
              transform: `rotate(${sector.angle}deg)`,
            }}
          />
        ))}
        
        {/* 扇区标签 */}
        {sectors.map((sector, index) => (
          <div
            key={`label-${index}`}
            className="absolute text-xs font-bold text-white"
            style={{
              top: '15%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${sector.angle + 22.5}deg)`,
            }}
          >
            {sector.name}
          </div>
        ))}
        
        {/* 中心点 */}
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg z-10" />
      </motion.div>
      
      {/* 指针 */}
      <div className="absolute top-0 left-1/2 w-4 h-16 bg-red-500 transform -translate-x-1/2 -translate-y-2 z-20">
        <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-500" />
      </div>

      {/* 抽奖按钮 */}
      <div className="mt-8 text-center">
        <button
          onClick={handleSpin}
          disabled={disabled || isSpinning}
          className={`px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 transform ${
            disabled || isSpinning 
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
      </div>

      {/* 抽奖结果 */}
      {spinResult && (
        <motion.div
          className="mt-8 p-6 bg-white/20 backdrop-blur-md rounded-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            {spinResult.tier > 0 ? (
              <Trophy className="w-8 h-8 text-yellow-400 mr-2" />
            ) : (
              <AlertCircle className="w-8 h-8 text-gray-400 mr-2" />
            )}
            <h3 className="text-2xl font-bold text-white">
              {spinResult.tier > 0 ? '🎉 恭喜中奖！' : '😔 很遗憾'}
            </h3>
          </div>
          <p className={`text-xl font-semibold bg-gradient-to-r ${spinResult.color} bg-clip-text text-transparent text-center`}>
            {spinResult.name}
          </p>
          {spinResult.tier > 0 && (
            <p className="text-center text-green-300 mt-2">
              奖金: {spinResult.prizeAmount} ETH
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default WheelSpinner;
