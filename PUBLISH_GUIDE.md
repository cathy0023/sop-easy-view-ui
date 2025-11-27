# npm 发布指南

本指南将帮助你完成将 MegaviewUI 发布到 npm 的完整流程。

## 📋 发布前检查清单

### 1. 检查 package.json 配置

确保以下字段已正确配置：

- ✅ `name`: `megaview-ui`（非作用域包）
- ✅ `version`: 当前版本号（如 `1.0.0`）
- ✅ `description`: 包描述
- ✅ `main`: UMD 入口文件
- ✅ `module`: ES Module 入口文件
- ✅ `files`: 发布时包含的文件列表
- ✅ `license`: MIT
- ✅ `repository`: Git 仓库地址

### 2. 构建项目

```bash
npm run build
```

确保 `dist` 目录下有以下文件：
- `megaview-ui.es.js`
- `megaview-ui.umd.js`
- `megaview-ui.iife.js`

### 3. 检查文件大小

构建完成后，检查文件大小是否合理（当前约 10KB，gzip 后约 3KB）。

## 🚀 发布步骤

### 步骤 1: 登录 npm

如果你还没有 npm 账号：

1. 访问 [https://www.npmjs.com/signup](https://www.npmjs.com/signup) 注册账号
2. 验证邮箱

登录 npm：

```bash
npm login
```

输入你的：
- Username（用户名）
- Password（密码）
- Email（邮箱）

### 步骤 2: 检查登录状态

```bash
npm whoami
```

如果显示你的用户名，说明已成功登录。

### 步骤 3: 检查包名是否可用

```bash
npm view megaview-ui
```

如果包不存在，会显示 404，说明可以发布。如果包已存在，你需要：
- 更新版本号（见步骤 4）
- 或者使用不同的包名

### 步骤 4: 更新版本号（如需要）

如果包已存在，需要更新版本号。使用语义化版本：

```bash
# 补丁版本（1.0.0 -> 1.0.1）
npm version patch

# 次版本（1.0.0 -> 1.1.0）
npm version minor

# 主版本（1.0.0 -> 2.0.0）
npm version major
```

或者直接编辑 `package.json` 中的 `version` 字段。

### 步骤 5: 发布包

发布作用域包（megaview-ui）需要添加 `--access public` 参数：

```bash
npm publish --access public
```

> ⚠️ **注意**：首次发布作用域包（@scope/package）时，必须使用 `--access public`，否则包默认是私有的。

### 步骤 6: 验证发布

发布成功后，可以通过以下方式验证：

1. **在 npm 网站查看**：
   ```
   https://www.npmjs.com/package/megaview-ui
   ```

2. **通过命令行查看**：
   ```bash
   npm view megaview-ui
   ```

3. **测试安装**：
   ```bash
   npm install megaview-ui
   ```

## 📦 发布后使用

### 通过 npm 安装

```bash
npm install megaview-ui
```

### 通过 CDN 使用

发布到 npm 后，可以通过以下 CDN 服务使用：

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

1. 修改代码
2. 更新版本号：
   ```bash
   npm version patch  # 或 minor、major
   ```
3. 构建项目：
   ```bash
   npm run build
   ```
4. 发布：
   ```bash
   npm publish --access public
   ```

## ⚠️ 常见问题

### 问题 1: 包名已存在

**解决方案**：
- 如果这是你的包，更新版本号后重新发布
- 如果不是你的包，需要更换包名（修改 `package.json` 中的 `name`）

### 问题 2: 权限不足

**错误信息**：`You do not have permission to publish "megaview-ui"`

**解决方案**：
- 确保你已登录正确的 npm 账号
- 如果包已存在，确保你是包的维护者
- 如果是新包，确保包名正确且可用

### 问题 3: 作用域包默认私有

**解决方案**：
- 使用 `npm publish --access public` 发布为公开包
- 或者在 `package.json` 中添加：
  ```json
  {
    "publishConfig": {
      "access": "public"
    }
  }
  ```

### 问题 4: 文件未包含在发布中

**解决方案**：
- 检查 `package.json` 中的 `files` 字段
- 确保 `dist` 目录在 `files` 列表中
- 可以使用 `npm pack` 预览将要发布的文件

## 📝 发布清单

发布前请确认：

- [ ] `package.json` 配置正确
- [ ] 已运行 `npm run build` 且构建成功
- [ ] 已登录 npm（`npm whoami` 显示用户名）
- [ ] 包名可用或版本号已更新
- [ ] README.md 文档完整
- [ ] 代码已测试，功能正常
- [ ] 已提交代码到 Git（可选但推荐）

## 🎯 快速发布命令

```bash
# 1. 登录（首次需要）
npm login

# 2. 构建
npm run build

# 3. 发布
npm publish --access public
```

## 📚 相关资源

- [npm 官方文档](https://docs.npmjs.com/)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [npm 作用域包文档](https://docs.npmjs.com/about-scoped-packages)

