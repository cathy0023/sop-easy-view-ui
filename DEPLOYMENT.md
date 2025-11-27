# 部署指南

本文档说明如何将 MegaviewUI 组件库部署到公网环境，供其他项目引用。

## 部署方式

### 方式一：发布到 npm（推荐）

这是最常用的方式，其他项目可以通过 npm 安装使用。

#### 1. 准备发布

确保 `package.json` 配置正确：

```json
{
  "name": "megaview-ui",
  "version": "1.0.0",
  "main": "./dist/megaview-ui.umd.js",
  "module": "./dist/megaview-ui.es.js",
  "files": ["dist"]
}
```

#### 2. 构建项目

```bash
npm run build
```

#### 3. 发布到 npm

```bash
# 登录 npm（如果还没有登录）
npm login

# 发布包
npm publish --access public
```

发布后，其他项目可以通过以下方式使用：

```bash
npm install megaview-ui
```

#### 4. 通过 npm CDN 使用

发布到 npm 后，可以通过以下 CDN 服务直接引用：

**jsDelivr CDN:**
```html
<!-- ES Module 版本 -->
<script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>

<!-- UMD 版本 -->
<script src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.umd.js"></script>

<!-- IIFE 版本 -->
<script src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.iife.js"></script>
```

**unpkg CDN:**
```html
<!-- ES Module 版本 -->
<script type="module" src="https://unpkg.com/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>

<!-- UMD 版本 -->
<script src="https://unpkg.com/megaview-ui@1.0.0/dist/megaview-ui.umd.js"></script>

<!-- IIFE 版本 -->
<script src="https://unpkg.com/megaview-ui@1.0.0/dist/megaview-ui.iife.js"></script>
```

### 方式二：部署到自己的 CDN 服务器

#### 1. 构建项目

```bash
npm run build
```

#### 2. 上传 dist 目录到 CDN

将 `dist` 目录下的文件上传到你的 CDN 服务器，建议目录结构：

```
https://cdn.yourdomain.com/megaview-ui/
  ├── 1.0.0/
  │   ├── megaview-ui.es.js
  │   ├── megaview-ui.umd.js
  │   └── megaview-ui.iife.js
  └── latest/
      ├── megaview-ui.es.js
      ├── megaview-ui.umd.js
      └── megaview-ui.iife.js
```

#### 3. 配置 CORS

确保 CDN 服务器配置了正确的 CORS 头：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

#### 4. 使用示例

```html
<!-- ES Module 版本 -->
<script type="module" src="https://cdn.yourdomain.com/megaview-ui/1.0.0/megaview-ui.es.js"></script>

<!-- IIFE 版本（推荐用于直接引入） -->
<script src="https://cdn.yourdomain.com/megaview-ui/1.0.0/megaview-ui.iife.js"></script>
```

### 方式三：使用 GitHub Pages

#### 1. 创建 gh-pages 分支

```bash
git checkout -b gh-pages
```

#### 2. 复制 dist 文件

```bash
# 将 dist 目录内容复制到根目录
cp -r dist/* .
```

#### 3. 提交并推送

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

#### 4. 启用 GitHub Pages

在 GitHub 仓库设置中启用 Pages，选择 `gh-pages` 分支。

#### 5. 使用示例

```html
<script type="module" src="https://yourusername.github.io/MegaviewUI/megaview-ui.es.js"></script>
```

## 版本管理

建议使用语义化版本（Semantic Versioning）：

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

每次发布新版本时：
1. 更新 `package.json` 中的 `version`
2. 构建项目：`npm run build`
3. 提交代码并打标签：`git tag v1.0.0`
4. 发布到 npm 或上传到 CDN

## 文件格式说明

- **megaview-ui.es.js**: ES Module 格式，适用于现代浏览器和构建工具（Vite、Webpack 等）
- **megaview-ui.umd.js**: UMD 格式，适用于 CommonJS、AMD 和浏览器全局变量
- **megaview-ui.iife.js**: IIFE 格式，适用于直接在 HTML 中引入，会创建全局变量 `MegaviewUI`

## 使用建议

### 现代项目（推荐）

使用 ES Module 版本：

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui/dist/megaview-ui.es.js"></script>
```

### 传统项目

使用 IIFE 版本：

```html
<script src="https://cdn.jsdelivr.net/npm/megaview-ui/dist/megaview-ui.iife.js"></script>
```

### 构建工具项目（Vite、Webpack 等）

通过 npm 安装：

```bash
npm install megaview-ui
```

```javascript
import 'megaview-ui';
```

## 性能优化建议

1. **启用 Gzip 压缩**：在 CDN 服务器上启用 Gzip 压缩，可减少 60-70% 的文件大小
2. **使用版本号**：使用具体版本号而非 `latest`，避免缓存问题
3. **CDN 选择**：选择地理位置接近用户的 CDN 节点
4. **HTTP/2**：使用支持 HTTP/2 的 CDN，提升加载速度

## 安全检查清单

- [ ] 确保代码中没有敏感信息
- [ ] 检查依赖项的安全性
- [ ] 配置正确的 CORS 策略
- [ ] 使用 HTTPS 协议
- [ ] 定期更新依赖项

## 故障排查

### 问题：CORS 错误

**解决方案**：确保 CDN 服务器配置了正确的 CORS 头。

### 问题：组件未注册

**解决方案**：确保脚本已正确加载，检查浏览器控制台是否有错误。

### 问题：样式不生效

**解决方案**：Web Components 使用 Shadow DOM，样式是隔离的，这是正常行为。

## 联系支持

如有部署相关问题，请联系深维技术支持团队。

