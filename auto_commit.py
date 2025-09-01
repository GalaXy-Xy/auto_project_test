#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auto Commit and Push Script for GitHub
自动提交和推送脚本 - Python版本

功能特性:
- 自动检测文件变化
- 智能提交信息生成
- 自动推送到GitHub
- 详细的日志记录
- 错误处理和重试机制
"""

import os
import sys
import subprocess
import time
import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional, Tuple

class AutoCommit:
    def __init__(self, repo_path: str = ".", branch: str = "master", remote: str = "origin"):
        self.repo_path = Path(repo_path).resolve()
        self.branch = branch
        self.remote = remote
        self.commit_prefix = "Auto commit:"
        
        # 颜色代码
        self.colors = {
            'red': '\033[0;31m',
            'green': '\033[0;32m',
            'yellow': '\033[1;33m',
            'blue': '\033[0;34m',
            'purple': '\033[0;35m',
            'cyan': '\033[0;36m',
            'white': '\033[1;37m',
            'nc': '\033[0m'  # No Color
        }
        
        # 检查环境
        self._check_environment()
    
    def _check_environment(self):
        """检查运行环境"""
        if not self.repo_path.exists():
            raise FileNotFoundError(f"仓库路径不存在: {self.repo_path}")
        
        if not (self.repo_path / ".git").exists():
            raise RuntimeError(f"不是Git仓库: {self.repo_path}")
        
        # 检查Git命令
        try:
            subprocess.run(["git", "--version"], check=True, capture_output=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            raise RuntimeError("Git命令不可用，请安装Git")
    
    def log(self, message: str, level: str = "info", color: str = "blue"):
        """输出带颜色的日志"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        color_code = self.colors.get(color, self.colors['nc'])
        level_upper = level.upper()
        
        print(f"{color_code}[{level_upper}] {timestamp} - {message}{self.colors['nc']}")
    
    def run_git_command(self, command: List[str], capture_output: bool = True) -> Tuple[int, str, str]:
        """运行Git命令"""
        try:
            result = subprocess.run(
                command,
                cwd=self.repo_path,
                capture_output=capture_output,
                text=True,
                check=False
            )
            return result.returncode, result.stdout, result.stderr
        except Exception as e:
            self.log(f"执行Git命令失败: {' '.join(command)}", "error", "red")
            self.log(f"错误详情: {str(e)}", "error", "red")
            return -1, "", str(e)
    
    def get_git_status(self) -> Optional[Dict]:
        """获取Git状态"""
        self.log("检查Git状态...", "info", "blue")
        
        # 检查是否有未提交的更改
        returncode, stdout, stderr = self.run_git_command(["git", "status", "--porcelain"])
        
        if returncode != 0:
            self.log(f"获取Git状态失败: {stderr}", "error", "red")
            return None
        
        if not stdout.strip():
            self.log("没有需要提交的更改", "info", "yellow")
            return None
        
        # 解析状态输出
        status_lines = stdout.strip().split('\n')
        changes = {
            'modified': [],
            'added': [],
            'deleted': [],
            'renamed': [],
            'untracked': []
        }
        
        for line in status_lines:
            if line:
                status = line[:2].strip()
                filename = line[3:]
                
                if status == 'M':
                    changes['modified'].append(filename)
                elif status == 'A':
                    changes['added'].append(filename)
                elif status == 'D':
                    changes['deleted'].append(filename)
                elif status == 'R':
                    changes['renamed'].append(filename)
                elif status == '??':
                    changes['untracked'].append(filename)
        
        # 显示更改摘要
        total_changes = sum(len(files) for files in changes.values())
        self.log(f"发现 {total_changes} 个文件有更改:", "info", "green")
        
        for change_type, files in changes.items():
            if files:
                self.log(f"  {change_type}: {len(files)} 个文件", "info", "cyan")
                for file in files[:5]:  # 只显示前5个文件
                    self.log(f"    - {file}", "info", "white")
                if len(files) > 5:
                    self.log(f"    ... 还有 {len(files) - 5} 个文件", "info", "white")
        
        return changes
    
    def add_changes(self) -> bool:
        """添加所有更改到暂存区"""
        self.log("添加所有更改到暂存区...", "info", "blue")
        
        returncode, stdout, stderr = self.run_git_command(["git", "add", "."])
        
        if returncode == 0:
            self.log("成功添加所有更改", "info", "green")
            return True
        else:
            self.log(f"添加更改失败: {stderr}", "error", "red")
            return False
    
    def generate_commit_message(self, changes: Dict) -> str:
        """生成提交信息"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 统计各种类型的更改
        total_files = sum(len(files) for files in changes.values())
        
        # 生成描述性信息
        descriptions = []
        if changes['modified']:
            descriptions.append(f"{len(changes['modified'])} modified")
        if changes['added']:
            descriptions.append(f"{len(changes['added'])} added")
        if changes['deleted']:
            descriptions.append(f"{len(changes['deleted'])} deleted")
        if changes['renamed']:
            descriptions.append(f"{len(changes['renamed'])} renamed")
        if changes['untracked']:
            descriptions.append(f"{len(changes['untracked'])} new")
        
        change_desc = ", ".join(descriptions)
        message = f"{self.commit_prefix} {change_desc} files at {timestamp}"
        
        return message
    
    def commit_changes(self, commit_message: str) -> bool:
        """提交更改"""
        self.log(f"提交更改: {commit_message}", "info", "blue")
        
        returncode, stdout, stderr = self.run_git_command(["git", "commit", "-m", commit_message])
        
        if returncode == 0:
            self.log("成功提交更改", "info", "green")
            return True
        else:
            self.log(f"提交更改失败: {stderr}", "error", "red")
            return False
    
    def push_to_remote(self) -> bool:
        """推送到远程仓库"""
        self.log(f"推送到远程仓库 {self.remote}/{self.branch}...", "info", "blue")
        
        returncode, stdout, stderr = self.run_git_command(["git", "push", self.remote, self.branch])
        
        if returncode == 0:
            self.log("成功推送到远程仓库", "info", "green")
            return True
        else:
            self.log(f"推送到远程仓库失败: {stderr}", "error", "red")
            return False
    
    def show_recent_commits(self, count: int = 5):
        """显示最近的提交记录"""
        self.log(f"最近的 {count} 条提交记录:", "info", "blue")
        
        returncode, stdout, stderr = self.run_git_command(["git", "log", f"--oneline", "-{count}"])
        
        if returncode == 0:
            for line in stdout.strip().split('\n'):
                if line:
                    self.log(f"  {line}", "info", "white")
        else:
            self.log(f"获取提交历史失败: {stderr}", "warning", "yellow")
    
    def run(self) -> bool:
        """运行自动提交流程"""
        try:
            self.log("开始自动提交和推送流程...", "info", "purple")
            self.log(f"仓库路径: {self.repo_path}", "info", "cyan")
            self.log(f"分支: {self.branch}", "info", "cyan")
            self.log(f"远程: {self.remote}", "info", "cyan")
            print()
            
            # 检查Git状态
            changes = self.get_git_status()
            if not changes:
                self.log("无需提交，退出", "info", "yellow")
                return True
            
            print()
            
            # 添加更改
            if not self.add_changes():
                return False
            
            print()
            
            # 生成提交信息
            commit_message = self.generate_commit_message(changes)
            
            # 提交更改
            if not self.commit_changes(commit_message):
                return False
            
            print()
            
            # 推送到远程
            if not self.push_to_remote():
                return False
            
            print()
            
            # 显示提交历史
            self.show_recent_commits()
            
            print()
            self.log("自动提交和推送完成！", "info", "green")
            return True
            
        except Exception as e:
            self.log(f"执行过程中发生错误: {str(e)}", "error", "red")
            return False

def main():
    """主函数"""
    try:
        # 创建自动提交实例
        auto_commit = AutoCommit()
        
        # 运行自动提交流程
        success = auto_commit.run()
        
        # 设置退出码
        sys.exit(0 if success else 1)
        
    except Exception as e:
        print(f"程序启动失败: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
