import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ExternalLink, Filter, Search, RefreshCw } from 'lucide-react';

const TransactionHistory = ({ transactions = [], isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // 过滤和排序交易
  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tx.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || tx.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === 'amount') return parseFloat(b.amount) - parseFloat(a.amount);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return 0;
    });

  // 获取交易类型颜色
  const getTypeColor = (type) => {
    switch (type) {
      case 'spin': return 'from-blue-500 to-blue-600';
      case 'prize': return 'from-green-500 to-green-600';
      case 'fee': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // 获取交易类型图标
  const getTypeIcon = (type) => {
    switch (type) {
      case 'spin': return '🎯';
      case 'prize': return '🏆';
      case 'fee': return '💰';
      default: return '📝';
    }
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化金额
  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '0.00';
    return num.toFixed(4);
  };

  // 打开区块浏览器
  const openExplorer = (hash) => {
    const explorerUrl = `https://sepolia.etherscan.io/tx/${hash}`;
    window.open(explorerUrl, '_blank');
  };

  // 模拟数据（实际项目中应该从props传入）
  const mockTransactions = [
    {
      hash: '0x1234...5678',
      type: 'spin',
      amount: '0.01',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'confirmed',
      description: '抽奖费用'
    },
    {
      hash: '0x8765...4321',
      type: 'prize',
      amount: '0.05',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      status: 'confirmed',
      description: '中奖奖金'
    },
    {
      hash: '0xabcd...efgh',
      type: 'fee',
      amount: '0.001',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: 'pending',
      description: '网络费用'
    }
  ];

  const displayTransactions = transactions.length > 0 ? filteredTransactions : mockTransactions;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Clock className="mr-2" />
          交易历史
        </h2>
        
        <motion.button
          onClick={() => window.location.reload()}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* 搜索和过滤 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索交易哈希或类型..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 类型过滤 */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">所有类型</option>
            <option value="spin">抽奖</option>
            <option value="prize">中奖</option>
            <option value="fee">费用</option>
          </select>
        </div>

        {/* 排序方式 */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="date">按时间排序</option>
            <option value="amount">按金额排序</option>
            <option value="type">按类型排序</option>
          </select>
        </div>
      </div>

      {/* 交易列表 */}
      <div className="space-y-3">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              key="loading"
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
              <p className="text-gray-300">加载交易记录中...</p>
            </motion.div>
          ) : displayTransactions.length === 0 ? (
            <motion.div
              key="empty"
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-gray-300">暂无交易记录</p>
            </motion.div>
          ) : (
            displayTransactions.map((tx, index) => (
              <motion.div
                key={tx.hash}
                className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* 交易类型图标 */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getTypeColor(tx.type)} flex items-center justify-center text-2xl`}>
                      {getTypeIcon(tx.type)}
                    </div>
                    
                    {/* 交易信息 */}
                    <div>
                      <p className="text-white font-semibold">{tx.description}</p>
                      <p className="text-gray-400 text-sm font-mono">
                        {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                      </p>
                      <p className="text-gray-300 text-xs">
                        {formatTime(tx.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {/* 金额 */}
                    <p className={`text-lg font-bold ${
                      tx.type === 'prize' ? 'text-green-400' : 
                      tx.type === 'spin' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {tx.type === 'prize' ? '+' : tx.type === 'spin' ? '-' : ''}
                      {formatAmount(tx.amount)} ETH
                    </p>
                    
                    {/* 状态 */}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                      }`}>
                        {tx.status === 'confirmed' ? '已确认' : '处理中'}
                      </span>
                      
                      {/* 区块浏览器链接 */}
                      <motion.button
                        onClick={() => openExplorer(tx.hash)}
                        className="p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* 统计信息 */}
      {displayTransactions.length > 0 && (
        <motion.div
          className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-300 text-sm">总交易数</p>
              <p className="text-white font-bold">{displayTransactions.length}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">总支出</p>
              <p className="text-red-400 font-bold">
                {formatAmount(displayTransactions.filter(tx => tx.type === 'spin').reduce((sum, tx) => sum + parseFloat(tx.amount), 0))} ETH
              </p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">总收入</p>
              <p className="text-green-400 font-bold">
                {formatAmount(displayTransactions.filter(tx => tx.type === 'prize').reduce((sum, tx) => sum + parseFloat(tx.amount), 0))} ETH
              </p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">净收益</p>
              <p className={`font-bold ${
                (displayTransactions.filter(tx => tx.type === 'prize').reduce((sum, tx) => sum + parseFloat(tx.amount), 0) -
                 displayTransactions.filter(tx => tx.type === 'spin').reduce((sum, tx) => sum + parseFloat(tx.amount), 0)) >= 0 
                  ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatAmount(
                  displayTransactions.filter(tx => tx.type === 'prize').reduce((sum, tx) => sum + parseFloat(tx.amount), 0) -
                  displayTransactions.filter(tx => tx.type === 'spin').reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                )} ETH
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TransactionHistory;
