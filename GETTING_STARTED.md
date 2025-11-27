# 快速开始指南

欢迎使用深维会话纪要组件库！本指南将帮助您快速上手。

## 项目已完成的内容

✅ **核心组件**: 会话纪要展示组件（megaview-conversation-summary）
✅ **构建配置**: 支持 ESM、UMD、IIFE 三种格式输出
✅ **示例项目**: 原生 HTML、React、Vue 集成示例
✅ **完整文档**: README、API 文档、集成指南

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 http://localhost:5173，您可以看到组件的实时预览。

### 3. 构建生产版本

```bash
npm run build
```

构建产物会生成在 `dist/` 目录下：
- `megaview-ui.es.js` - ESM 格式（现代打包工具使用）
- `megaview-ui.umd.js` - UMD 格式（浏览器和 Node.js）
- `megaview-ui.iife.js` - IIFE 格式（CDN 直接引入）

## 组件使用示例

### 基础用法

```html
<megaview-conversation-summary
  data='{"title":"会议纪要","date":"2024-01-15","summary":"会议内容..."}'>
</megaview-conversation-summary>
```

### 完整配置

```html
<megaview-conversation-summary
  data='{"title":"产品会议","date":"2024-01-15","participants":["张三","李四"],"summary":"...","keyPoints":["要点1","要点2"]}'
  collapsible="true"
  show-export="true"
  width="800px"
  height="600px">
</megaview-conversation-summary>
```

### 数据格式

```javascript
{
  "title": "会议标题",
  "date": "2024-01-15 14:00",
  "duration": "45分钟",
  "participants": ["张三", "李四"],
  "summary": "会议摘要...",
  "keyPoints": ["要点1", "要点2"],
  "actionItems": [
    {
      "task": "待办事项",
      "assignee": "负责人",
      "deadline": "2024-01-20"
    }
  ],
  "tags": ["标签1", "标签2"]
}
```

## 运行示例项目

### 原生 HTML 示例

```bash
# 先构建组件库
npm run build

# 然后打开示例文件
# 使用浏览器打开 examples/vanilla/index.html
```

### React 示例

```bash
cd examples/react
npm install
npm run dev
```

### Vue 示例

```bash
cd examples/vue
npm install
npm run dev
```

## 集成到您的项目

### 方式 1: NPM 安装（推荐）

```bash
npm install megaview-ui
```

然后在代码中引入：

```javascript
import 'megaview-ui';
```

### 方式 2: CDN 引入

```html
<!-- jsDelivr CDN -->
<script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>

<!-- 或 unpkg CDN -->
<script type="module" src="https://unpkg.com/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>
```

## 组件特性

### 1. 可折叠区块

设置 `collapsible="true"` 启用区块折叠功能：

```html
<megaview-conversation-summary
  data='...'
  collapsible="true">
</megaview-conversation-summary>
```

### 2. 数据导出

设置 `show-export="true"` 显示导出按钮：

```html
<megaview-conversation-summary
  data='...'
  show-export="true">
</megaview-conversation-summary>
```

监听导出事件：

```javascript
element.addEventListener('export-click', (e) => {
  console.log('导出内容:', e.detail.text);
  // 可以在这里实现下载功能
});
```

### 3. 动态更新数据

```javascript
const element = document.querySelector('megaview-conversation-summary');

// 方式 1: 使用 setAttribute
element.setAttribute('data', JSON.stringify(newData));

// 方式 2: 使用 updateData 方法
element.updateData(newData);
```

### 4. 事件监听

```javascript
// 监听区块展开
element.addEventListener('section-expand', (e) => {
  console.log('展开:', e.detail.section);
});

// 监听区块折叠
element.addEventListener('section-collapse', (e) => {
  console.log('折叠:', e.detail.section);
});
```

## 常见问题

### Q: 组件样式被覆盖了？

A: 组件使用 Shadow DOM，样式是完全隔离的，不会被外部样式影响。

### Q: 如何自定义样式？

A: 目前组件使用固定的样式配置。如需自定义，可以修改源码中的 `getStyles()` 方法。

### Q: 支持哪些浏览器？

A: 支持所有现代浏览器（Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+）

### Q: 数据格式有什么要求？

A: 所有字段都是可选的，但建议至少提供 `title` 和 `summary`。详见 API 文档。

## 下一步

- 查看 [API 文档](docs/api.md) 了解详细的属性和方法
- 查看 [集成指南](docs/integration.md) 了解如何在不同框架中使用
- 查看 `examples/` 目录下的完整示例代码

## 技术支持

如有问题，请联系深维技术支持团队。


