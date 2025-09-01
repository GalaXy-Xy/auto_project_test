#!/bin/bash

# Auto Commit and Push Script for GitHub
# 自动提交和推送脚本

# 配置信息
REPO_NAME="auto_project_test"
BRANCH="master"
REMOTE="origin"
COMMIT_MESSAGE_PREFIX="Auto commit:"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Git状态
check_git_status() {
    log_info "检查Git状态..."
    
    if ! git status --porcelain | grep -q .; then
        log_info "没有需要提交的更改"
        return 1
    fi
    
    log_info "发现未提交的更改:"
    git status --short
    return 0
}

# 添加所有更改
add_changes() {
    log_info "添加所有更改到暂存区..."
    git add .
    if [ $? -eq 0 ]; then
        log_success "成功添加所有更改"
    else
        log_error "添加更改失败"
        return 1
    fi
}

# 生成提交信息
generate_commit_message() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local changed_files=$(git diff --cached --name-only | wc -l)
    local message="${COMMIT_MESSAGE_PREFIX} ${changed_files} files changed at ${timestamp}"
    echo "$message"
}

# 提交更改
commit_changes() {
    local commit_msg=$(generate_commit_message)
    log_info "提交更改: $commit_msg"
    
    git commit -m "$commit_msg"
    if [ $? -eq 0 ]; then
        log_success "成功提交更改"
        return 0
    else
        log_error "提交更改失败"
        return 1
    fi
}

# 推送到远程仓库
push_to_remote() {
    log_info "推送到远程仓库 ${REMOTE}/${BRANCH}..."
    
    git push $REMOTE $BRANCH
    if [ $? -eq 0 ]; then
        log_success "成功推送到远程仓库"
        return 0
    else
        log_error "推送到远程仓库失败"
        return 1
    fi
}

# 显示提交历史
show_recent_commits() {
    log_info "最近的提交记录:"
    git log --oneline -5
}

# 主函数
main() {
    log_info "开始自动提交和推送流程..."
    log_info "仓库: ${REPO_NAME}"
    log_info "分支: ${BRANCH}"
    log_info "远程: ${REMOTE}"
    echo
    
    # 检查是否有更改
    if ! check_git_status; then
        log_info "无需提交，退出"
        exit 0
    fi
    
    echo
    
    # 添加更改
    if ! add_changes; then
        log_error "添加更改失败，退出"
        exit 1
    fi
    
    echo
    
    # 提交更改
    if ! commit_changes; then
        log_error "提交更改失败，退出"
        exit 1
    fi
    
    echo
    
    # 推送到远程
    if ! push_to_remote; then
        log_error "推送失败，退出"
        exit 1
    fi
    
    echo
    
    # 显示提交历史
    show_recent_commits
    
    echo
    log_success "自动提交和推送完成！"
}

# 检查是否在Git仓库中
if [ ! -d ".git" ]; then
    log_error "当前目录不是Git仓库"
    exit 1
fi

# 检查Git命令是否可用
if ! command -v git &> /dev/null; then
    log_error "Git命令不可用，请安装Git"
    exit 1
fi

# 运行主函数
main "$@"
