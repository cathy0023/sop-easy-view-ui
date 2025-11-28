#!/bin/bash

# npm 发布脚本
# 使用方法: bash scripts/publish.sh

set -e

echo "🚀 MegaviewUI npm 发布脚本"
echo "================================"
echo ""

# 检查是否已登录
echo "📋 步骤 1: 检查 npm 登录状态..."
if npm whoami > /dev/null 2>&1; then
    USERNAME=$(npm whoami)
    echo "✅ 已登录为: $USERNAME"
else
    echo "❌ 未登录 npm"
    echo "请先运行: npm login"
    exit 1
fi

# 检查包名是否可用
echo ""
echo "📋 步骤 2: 检查包名可用性..."
if npm view megaview-ui > /dev/null 2>&1; then
    CURRENT_VERSION=$(npm view megaview-ui version 2>/dev/null || echo "未知")
    PACKAGE_VERSION=$(node -p "require('./package.json').version")
    echo "⚠️  包已存在，当前版本: $CURRENT_VERSION"
    echo "📦 本地版本: $PACKAGE_VERSION"
    
    if [ "$CURRENT_VERSION" == "$PACKAGE_VERSION" ]; then
        echo "❌ 版本号相同，请先更新版本号"
        echo "可以使用: npm version patch|minor|major"
        exit 1
    fi
else
    echo "✅ 包名可用，可以发布"
fi

# 构建项目
echo ""
echo "📋 步骤 3: 构建项目..."
npm run build

# 检查构建文件
echo ""
echo "📋 步骤 4: 检查构建文件..."
if [ ! -f "dist/megaview-ui.es.js" ] || [ ! -f "dist/megaview-ui.umd.js" ] || [ ! -f "dist/megaview-ui.iife.js" ]; then
    echo "❌ 构建文件缺失，请检查构建过程"
    exit 1
fi
echo "✅ 构建文件检查通过"

# 预览将要发布的文件
echo ""
echo "📋 步骤 5: 预览将要发布的文件..."
npm pack --dry-run

# 确认发布
echo ""
echo "📋 步骤 6: 准备发布..."
read -p "确认发布到 npm? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 已取消发布"
    exit 1
fi

# 发布
echo ""
echo "📋 步骤 7: 发布到 npm..."
npm publish --access public

echo ""
echo "✅ 发布成功！"
echo ""
echo "📦 包地址: https://www.npmjs.com/package/megaview-ui"
echo ""
echo "💡 CDN 使用方式:"
echo "   jsDelivr: https://cdn.jsdelivr.net/npm/megaview-ui@$(node -p "require('./package.json').version")/dist/megaview-ui.es.js"
echo "   unpkg:    https://unpkg.com/megaview-ui@$(node -p "require('./package.json').version")/dist/megaview-ui.es.js"



