# npm 发布脚本 (PowerShell)
# 使用方法: .\scripts\publish.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 MegaviewUI npm 发布脚本" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否已登录
Write-Host "📋 步骤 1: 检查 npm 登录状态..." -ForegroundColor Yellow
try {
    $username = npm whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 已登录为: $username" -ForegroundColor Green
    } else {
        throw "未登录"
    }
} catch {
    Write-Host "❌ 未登录 npm" -ForegroundColor Red
    Write-Host "请先运行: npm login" -ForegroundColor Yellow
    exit 1
}

# 检查包名是否可用
Write-Host ""
Write-Host "📋 步骤 2: 检查包名可用性..." -ForegroundColor Yellow
$packageInfo = npm view @megaview/ui 2>&1
if ($LASTEXITCODE -eq 0) {
    $currentVersion = (npm view @megaview/ui version 2>&1)
    $packageJson = Get-Content package.json | ConvertFrom-Json
    $packageVersion = $packageJson.version
    
    Write-Host "⚠️  包已存在，当前版本: $currentVersion" -ForegroundColor Yellow
    Write-Host "📦 本地版本: $packageVersion" -ForegroundColor Yellow
    
    if ($currentVersion -eq $packageVersion) {
        Write-Host "❌ 版本号相同，请先更新版本号" -ForegroundColor Red
        Write-Host "可以使用: npm version patch|minor|major" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ 包名可用，可以发布" -ForegroundColor Green
}

# 构建项目
Write-Host ""
Write-Host "📋 步骤 3: 构建项目..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    exit 1
}

# 检查构建文件
Write-Host ""
Write-Host "📋 步骤 4: 检查构建文件..." -ForegroundColor Yellow
$files = @("dist/megaview-ui.es.js", "dist/megaview-ui.umd.js", "dist/megaview-ui.iife.js")
$allExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (缺失)" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host "❌ 构建文件缺失，请检查构建过程" -ForegroundColor Red
    exit 1
}

# 预览将要发布的文件
Write-Host ""
Write-Host "📋 步骤 5: 预览将要发布的文件..." -ForegroundColor Yellow
npm pack --dry-run

# 确认发布
Write-Host ""
Write-Host "📋 步骤 6: 准备发布..." -ForegroundColor Yellow
$confirm = Read-Host "确认发布到 npm? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ 已取消发布" -ForegroundColor Red
    exit 1
}

# 发布
Write-Host ""
Write-Host "📋 步骤 7: 发布到 npm..." -ForegroundColor Yellow
npm publish --access public

if ($LASTEXITCODE -eq 0) {
    $packageJson = Get-Content package.json | ConvertFrom-Json
    $version = $packageJson.version
    
    Write-Host ""
    Write-Host "✅ 发布成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 包地址: https://www.npmjs.com/package/@megaview/ui" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 CDN 使用方式:" -ForegroundColor Yellow
    Write-Host "   jsDelivr: https://cdn.jsdelivr.net/npm/@megaview/ui@$version/dist/megaview-ui.es.js" -ForegroundColor Cyan
    Write-Host "   unpkg:    https://unpkg.com/@megaview/ui@$version/dist/megaview-ui.es.js" -ForegroundColor Cyan
} else {
    Write-Host "❌ 发布失败" -ForegroundColor Red
    exit 1
}


