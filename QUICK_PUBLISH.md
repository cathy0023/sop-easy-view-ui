# 快速发布指南

## 🚀 三步发布到 npm

### 步骤 1: 登录 npm（首次需要）

```bash
npm login
```

输入你的 npm 账号信息：
- Username（用户名）
- Password（密码）
- Email（邮箱）

> 💡 如果没有 npm 账号，请先访问 [https://www.npmjs.com/signup](https://www.npmjs.com/signup) 注册

### 步骤 2: 构建项目

```bash
npm run build
```

确保构建成功，生成以下文件：
- ✅ `dist/megaview-ui.es.js`
- ✅ `dist/megaview-ui.umd.js`
- ✅ `dist/megaview-ui.iife.js`

### 步骤 3: 发布

```bash
npm publish
```

> ✅ 已配置 `publishConfig.access: "public"`，无需添加 `--access public` 参数

## 📦 发布后验证

### 1. 在 npm 网站查看
访问：https://www.npmjs.com/package/megaview-ui

### 2. 测试安装
```bash
npm install megaview-ui
```

### 3. 通过 CDN 使用
发布后可通过以下 CDN 使用：

**jsDelivr:**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>
```

**unpkg:**
```html
<script type="module" src="https://unpkg.com/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>
```

## 🔄 更新版本

当需要发布新版本时：

```bash
# 1. 更新版本号（选择其一）
npm version patch   # 1.0.0 -> 1.0.1 (补丁版本)
npm version minor   # 1.0.0 -> 1.1.0 (次版本)
npm version major   # 1.0.0 -> 2.0.0 (主版本)

# 2. 构建（会自动执行，因为配置了 prepublishOnly）
npm publish
```

## ⚠️ 常见问题

### 问题：未登录
**错误**: `need auth This command requires you to be logged in`

**解决**: 运行 `npm login`

### 问题：版本号已存在
**错误**: `You cannot publish over the previously published versions`

**解决**: 更新版本号后重新发布

### 问题：权限不足
**错误**: `You do not have permission to publish`

**解决**: 
- 确认已登录正确的账号
- 确认包名正确

## 📝 完整发布命令（一键执行）

```bash
# Windows PowerShell
npm login; npm run build; npm publish

# Linux/Mac
npm login && npm run build && npm publish
```

## 🎯 使用自动化脚本（推荐）

### Windows (PowerShell)
```powershell
.\scripts\publish.ps1
```

### Linux/Mac (Bash)
```bash
bash scripts/publish.sh
```

脚本会自动：
- ✅ 检查登录状态
- ✅ 检查包名和版本
- ✅ 构建项目
- ✅ 检查构建文件
- ✅ 预览发布内容
- ✅ 确认后发布

## 📚 更多信息

- 详细发布指南：查看 [PUBLISH_GUIDE.md](./PUBLISH_GUIDE.md)
- 部署指南：查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

