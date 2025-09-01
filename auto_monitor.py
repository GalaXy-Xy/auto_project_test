#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auto Monitor and Commit Script
自动监控和提交脚本

功能特性:
- 实时监控文件变化
- 自动提交和推送
- 支持多种触发方式
- 配置文件管理
- 日志记录和通知
"""

import os
import sys
import time
import json
import signal
import threading
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import subprocess

class AutoMonitor:
    def __init__(self, config_file: str = "config.json"):
        self.config_file = Path(config_file)
        self.config = self.load_config()
        self.running = False
        self.last_commit_time = None
        self.file_watchers = {}
        
        # 设置信号处理
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
        # 初始化自动提交器
        self.auto_commit = AutoCommit()
    
    def load_config(self) -> Dict:
        """加载配置文件"""
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            print(f"✅ 配置文件加载成功: {self.config_file}")
            return config
        except FileNotFoundError:
            print(f"❌ 配置文件不存在: {self.config_file}")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"❌ 配置文件格式错误: {e}")
            sys.exit(1)
    
    def signal_handler(self, signum, frame):
        """信号处理函数"""
        print(f"\n🛑 收到信号 {signum}，正在停止监控...")
        self.stop()
        sys.exit(0)
    
    def start_monitoring(self):
        """开始监控"""
        if self.running:
            print("⚠️ 监控已经在运行中")
            return
        
        self.running = True
        print("🚀 开始自动监控...")
        print(f"📁 监控目录: {Path.cwd()}")
        print(f"⏰ 检查间隔: {self.config['auto_commit']['check_interval']} 秒")
        print("按 Ctrl+C 停止监控\n")
        
        try:
            while self.running:
                self.check_and_commit()
                time.sleep(self.config['auto_commit']['check_interval'])
        except KeyboardInterrupt:
            print("\n🛑 用户中断，正在停止...")
        finally:
            self.stop()
    
    def check_and_commit(self):
        """检查文件变化并提交"""
        try:
            # 检查是否有文件变化
            if self.has_changes():
                print(f"📝 检测到文件变化，时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                
                # 执行预提交脚本
                self.run_scripts('pre_commit')
                
                # 自动提交
                if self.auto_commit.run():
                    self.last_commit_time = datetime.now()
                    print("✅ 自动提交成功")
                    
                    # 执行后提交脚本
                    self.run_scripts('post_commit')
                else:
                    print("❌ 自动提交失败")
            else:
                print(f"⏰ 检查完成，无变化 - {datetime.now().strftime('%H:%M:%S')}")
                
        except Exception as e:
            print(f"❌ 检查过程中发生错误: {e}")
    
    def has_changes(self) -> bool:
        """检查是否有文件变化"""
        try:
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                capture_output=True,
                text=True,
                check=True
            )
            return bool(result.stdout.strip())
        except subprocess.CalledProcessError:
            return False
    
    def run_scripts(self, script_type: str):
        """运行指定类型的脚本"""
        scripts = self.config['scripts'].get(script_type, [])
        if not scripts:
            return
        
        print(f"🔧 执行 {script_type} 脚本...")
        for script in scripts:
            try:
                if script.startswith('npm '):
                    # 运行npm脚本
                    subprocess.run(script.split(), check=True)
                    print(f"  ✅ {script}")
                elif script.startswith('python '):
                    # 运行Python脚本
                    subprocess.run(script.split(), check=True)
                    print(f"  ✅ {script}")
                else:
                    # 运行shell命令
                    subprocess.run(script, shell=True, check=True)
                    print(f"  ✅ {script}")
            except subprocess.CalledProcessError as e:
                print(f"  ❌ {script} 执行失败: {e}")
    
    def stop(self):
        """停止监控"""
        self.running = False
        print("🛑 监控已停止")
    
    def get_status(self) -> Dict:
        """获取监控状态"""
        return {
            'running': self.running,
            'last_commit': self.last_commit_time.isoformat() if self.last_commit_time else None,
            'config': self.config,
            'current_time': datetime.now().isoformat()
        }

class AutoCommit:
    """自动提交类（简化版本）"""
    
    def __init__(self):
        self.colors = {
            'red': '\033[0;31m',
            'green': '\033[0;32m',
            'yellow': '\033[1;33m',
            'blue': '\033[0;34m',
            'nc': '\033[0m'
        }
    
    def log(self, message: str, level: str = "info", color: str = "blue"):
        """输出日志"""
        color_code = self.colors.get(color, self.colors['nc'])
        level_upper = level.upper()
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"{color_code}[{level_upper}] {timestamp} - {message}{self.colors['nc']}")
    
    def run(self) -> bool:
        """运行自动提交流程"""
        try:
            # 检查Git状态
            if not self.has_changes():
                return True
            
            # 添加更改
            self.log("添加更改...", "info", "blue")
            subprocess.run(["git", "add", "."], check=True)
            
            # 生成提交信息
            commit_msg = f"Auto commit: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            
            # 提交更改
            self.log("提交更改...", "info", "blue")
            subprocess.run(["git", "commit", "-m", commit_msg], check=True)
            
            # 推送到远程
            self.log("推送到远程...", "info", "blue")
            subprocess.run(["git", "push"], check=True)
            
            self.log("自动提交完成", "info", "green")
            return True
            
        except subprocess.CalledProcessError as e:
            self.log(f"Git操作失败: {e}", "error", "red")
            return False
        except Exception as e:
            self.log(f"发生错误: {e}", "error", "red")
            return False
    
    def has_changes(self) -> bool:
        """检查是否有更改"""
        try:
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                capture_output=True,
                text=True,
                check=True
            )
            return bool(result.stdout.strip())
        except subprocess.CalledProcessError:
            return False

def main():
    """主函数"""
    print("🚀 Auto Monitor and Commit Script")
    print("=" * 50)
    
    # 检查配置文件
    config_file = "config.json"
    if not Path(config_file).exists():
        print(f"❌ 配置文件不存在: {config_file}")
        print("请先创建配置文件或确保文件存在")
        sys.exit(1)
    
    try:
        # 创建监控器
        monitor = AutoMonitor(config_file)
        
        # 开始监控
        monitor.start_monitoring()
        
    except KeyboardInterrupt:
        print("\n🛑 程序被用户中断")
    except Exception as e:
        print(f"❌ 程序运行错误: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
