import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Mail, Heart, Shield, Zap, Users } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // 链接配置
  const links = {
    product: [
      { name: '功能特性', href: '#features' },
      { name: '游戏规则', href: '#rules' },
      { name: '技术架构', href: '#architecture' },
      { name: '更新日志', href: '#changelog' }
    ],
    support: [
      { name: '帮助中心', href: '#help' },
      { name: '常见问题', href: '#faq' },
      { name: '联系我们', href: '#contact' },
      { name: '社区论坛', href: '#community' }
    ],
    legal: [
      { name: '隐私政策', href: '#privacy' },
      { name: '服务条款', href: '#terms' },
      { name: '免责声明', href: '#disclaimer' },
      { name: '智能合约审计', href: '#audit' }
    ]
  };

  // 社交媒体链接
  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/GalaXy-Xy/auto_project_test', color: 'hover:text-gray-400' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/luckywheel', color: 'hover:text-blue-400' },
    { name: 'Email', icon: Mail, href: 'mailto:support@luckywheel.com', color: 'hover:text-red-400' }
  ];

  // 特性列表
  const features = [
    { icon: Shield, title: '安全可靠', description: '基于区块链技术，确保游戏公平透明' },
    { icon: Zap, title: '快速响应', description: '智能合约自动执行，无需等待人工确认' },
    { icon: Users, title: '社区驱动', description: '玩家共建奖池，共享游戏乐趣' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900/50 to-black/80 backdrop-blur-md border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* 项目介绍 */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="text-3xl mr-2">🎯</span>
                LuckyWheel DApp
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                基于以太坊区块链的幸运轮盘游戏，采用Chainlink VRF技术确保随机数公平性，
                为玩家提供透明、安全、有趣的去中心化游戏体验。
              </p>
              
              {/* 特性展示 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="text-center p-3 bg-white/5 rounded-lg border border-white/10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <feature.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <h4 className="text-white font-semibold text-sm mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-xs">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 产品链接 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">产品</h4>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 支持链接 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">支持</h4>
            <ul className="space-y-2">
              {links.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-white/10 mb-8" />

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* 版权信息 */}
          <motion.div
            className="flex items-center text-gray-400 text-sm"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span>© {currentYear} LuckyWheel DApp. 保留所有权利.</span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              用 <Heart className="w-4 h-4 text-red-400 mx-1" /> 制作
            </span>
          </motion.div>

          {/* 社交媒体链接 */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 ${social.color} transition-colors duration-200`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* 技术栈信息 */}
        <motion.div
          className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h5 className="text-white font-semibold mb-3 text-center">技术栈</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <p className="text-blue-300 text-xs font-medium">Solidity</p>
              <p className="text-blue-200 text-xs">智能合约</p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg border border-green-400/30">
              <p className="text-green-300 text-xs font-medium">Hardhat</p>
              <p className="text-green-200 text-xs">开发环境</p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
              <p className="text-purple-300 text-xs font-medium">Next.js</p>
              <p className="text-purple-200 text-xs">前端框架</p>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
              <p className="text-yellow-300 text-xs font-medium">Chainlink</p>
              <p className="text-yellow-200 text-xs">随机数生成</p>
            </div>
          </div>
        </motion.div>

        {/* 安全提示 */}
        <motion.div
          className="mt-6 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl border border-red-400/30"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center space-x-2 text-center">
            <Shield className="w-5 h-5 text-red-400" />
            <p className="text-red-200 text-sm">
              <strong>安全提醒：</strong>
              请确保在安全的网络环境下使用，不要在不信任的网站上连接钱包。
              游戏费用为 0.01 ETH，请确认交易详情后再确认。
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
