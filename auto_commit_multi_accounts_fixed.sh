#!/bin/bash

# 修复版多账户自动提交脚本
# 支持账户轮换和自定义提交日期

# 账户配置
ACCOUNT1_NAME="GalaXy-Xy"
ACCOUNT1_EMAIL="galaxyinblue@outlook.com"

ACCOUNT2_NAME="GalaXy-Andromeda"
ACCOUNT2_EMAIL="galaxyinblue@gmail.com"

# 账户状态文件
ACCOUNT_STATE_FILE=".account_state"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

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

# 获取当前账户索引
get_current_account() {
    if [ -f "$ACCOUNT_STATE_FILE" ]; then
        cat "$ACCOUNT_STATE_FILE"
    else
        echo "1"
    fi
}

# 保存当前账户索引
save_current_account() {
    echo "$1" > "$ACCOUNT_STATE_FILE"
}

# 切换账户函数
switch_account() {
    local account_num=$1
    
    if [ $account_num -eq 1 ]; then
        log_info "切换到账户1: $ACCOUNT1_NAME"
        git config user.name "$ACCOUNT1_NAME"
        git config user.email "$ACCOUNT1_EMAIL"
        save_current_account 1
    elif [ $account_num -eq 2 ]; then
        log_info "切换到账户2: $ACCOUNT2_NAME"
        git config user.name "$ACCOUNT2_NAME"
        git config user.email "$ACCOUNT2_EMAIL"
        save_current_account 2
    else
        log_error "无效的账户编号: $account_num"
        return 1
    fi
    
    log_success "当前账户: $(git config user.name) <$(git config user.email)>"
}

# 轮换到下一个账户
rotate_account() {
    local current_account=$(get_current_account)
    
    if [ $current_account -eq 1 ]; then
        log_info "从账户1轮换到账户2"
        switch_account 2
    else
        log_info "从账户2轮换到账户1"
        switch_account 1
    fi
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

# 生成拟人化提交信息
generate_commit_message() {
    local messages=(
        "今天又写了好多代码，感觉超棒的！✨"
        "这个功能终于搞定了，累死我了 😅"
        "又修复了一个bug，程序员的生活就是这么朴实无华"
        "新功能上线！希望用户会喜欢 🚀"
        "代码重构完成，现在看起来清爽多了"
        "测试用例都通过了，可以安心睡觉了 😴"
        "文档更新完成，应该不会有人看不懂了吧"
        "性能优化完成，速度提升了不少 🚀"
        "又学习了一个新技术，感觉收获满满"
        "代码review完成，质量杠杠的 💪"
        "部署脚本写好了，自动化真香"
        "用户反馈的问题都解决了，成就感爆棚"
    )
    
    local random_index=$((RANDOM % ${#messages[@]}))
    echo "${messages[$random_index]}"
}

# 提交更改（使用自定义日期）
commit_changes() {
    local commit_msg=$(generate_commit_message)
    local custom_date=$1
    
    log_info "提交更改: $commit_msg"
    log_info "使用自定义日期: $custom_date"
    
    # 使用GIT_COMMITTER_DATE和GIT_AUTHOR_DATE设置自定义日期
    export GIT_COMMITTER_DATE="$custom_date"
    export GIT_AUTHOR_DATE="$custom_date"
    
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
    log_info "推送到远程仓库..."
    
    git push origin master
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

# 显示账户状态
show_account_status() {
    local current_account=$(get_current_account)
    local current_name=$(git config user.name)
    local current_email=$(git config user.email)
    
    log_info "账户状态信息:"
    log_info "  当前账户索引: $current_account"
    log_info "  当前Git用户名: $current_name"
    log_info "  当前Git邮箱: $current_email"
    log_info "  下次将使用: $([ $current_account -eq 1 ] && echo "$ACCOUNT2_NAME" || echo "$ACCOUNT1_NAME")"
}

# 主函数
main() {
    log_info "开始多账户自动提交流程..."
    
    # 显示当前账户状态
    show_account_status
    
    # 检查是否有更改
    if ! check_git_status; then
        log_info "无需提交，退出"
        return 0
    fi
    
    # 轮换账户
    rotate_account
    
    # 添加更改
    if ! add_changes; then
        return 1
    fi
    
    # 生成2023年3月到8月的随机日期
    local year=2023
    local month=$((RANDOM % 6 + 3))  # 3-8月
    local day=$((RANDOM % 28 + 1))   # 1-28日
    local hour=$((RANDOM % 24))      # 0-23时
    local minute=$((RANDOM % 60))    # 0-59分
    local second=$((RANDOM % 60))    # 0-59秒
    
    local custom_date="$year-$month-$day $hour:$minute:$second"
    
    # 提交更改
    if ! commit_changes "$custom_date"; then
        return 1
    fi
    
    # 推送到远程
    if ! push_to_remote; then
        return 1
    fi
    
    # 显示提交历史
    show_recent_commits
    
    log_success "多账户自动提交完成！"
    show_account_status
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
