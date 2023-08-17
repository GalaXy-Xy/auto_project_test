import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';

const WalletConnect = ({ onConnect, onDisconnect, isConnected, account, chainId }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showNetworks, setShowNetworks] = useState(false);

  // 支持的网络配置
  const supportedNetworks = [
    { id: 1, name: 'Ethereum Mainnet', icon: '🔵' },
    { id: 11155111, name: 'Sepolia Testnet', icon: '🟣' },
    { id: 31337, name: 'Hardhat Local', icon: '🟡' }
  ];

  // 连接钱包
  const handleConnect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('请先安装MetaMask钱包！');
      return;
    }

    setIsConnecting(true);
    try {
      // 请求账户连接
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        onConnect(accounts[0]);
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      alert('连接钱包失败，请重试！');
    } finally {
      setIsConnecting(false);
    }
  };

  // 断开连接
  const handleDisconnect = () => {
    onDisconnect();
  };

  // 切换网络
  const switchNetwork = async (targetChainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      });
    } catch (error) {
      console.error('切换网络失败:', error);
      alert('切换网络失败，请手动切换！');
    }
  };

  // 获取网络名称
  const getNetworkName = (id) => {
    const network = supportedNetworks.find(n => n.id === id);
    return network ? network.name : `未知网络 (${id})`;
  };

  // 获取网络图标
  const getNetworkIcon = (id) => {
    const network = supportedNetworks.find(n => n.id === id);
    return network ? network.icon : '❓';
  };

  // 格式化账户地址
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Wallet className="mr-2" />
          钱包连接
        </h2>
        
        {isConnected && (
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm">已连接</span>
          </div>
        )}
      </div>

      {!isConnected ? (
        <div className="text-center">
          <p className="text-gray-300 mb-4">
            连接您的MetaMask钱包开始游戏
          </p>
          <motion.button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 ${
              isConnecting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105'
            } text-white flex items-center justify-center mx-auto`}
            whileHover={{ scale: isConnecting ? 1 : 1.05 }}
            whileTap={{ scale: isConnecting ? 1 : 0.95 }}
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                连接中...
              </>
            ) : (
              <>
                <Wallet className="mr-2" />
                连接钱包
              </>
            )}
          </motion.button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 账户信息 */}
          <div className="bg-white/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">账户地址</p>
                <p className="text-white font-mono font-semibold">
                  {formatAddress(account)}
                </p>
              </div>
              <motion.button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                断开
              </motion.button>
            </div>
          </div>

          {/* 网络信息 */}
          <div className="bg-white/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">当前网络</p>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getNetworkIcon(chainId)}</span>
                  <p className="text-white font-semibold">
                    {getNetworkName(chainId)}
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={() => setShowNetworks(!showNetworks)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronDown className={`w-5 h-5 text-white transition-transform ${
                  showNetworks ? 'rotate-180' : ''
                }`} />
              </motion.button>
            </div>

            {/* 网络选择下拉菜单 */}
            {showNetworks && (
              <motion.div
                className="mt-4 space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {supportedNetworks.map((network) => (
                  <motion.button
                    key={network.id}
                    onClick={() => switchNetwork(network.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      network.id === chainId
                        ? 'bg-green-500/30 border border-green-400'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{network.icon}</span>
                        <span className="text-white font-medium">
                          {network.name}
                        </span>
                      </div>
                      {network.id === chainId && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* 连接状态指示器 */}
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-green-500/20 border border-green-400/50 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">
                钱包已连接，可以开始游戏
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
