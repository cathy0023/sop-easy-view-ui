# 深维会话纪要组件库

基于 Web Components 的框架无关可视化组件库，用于展示会话纪要信息。

## 特性

- ✨ **框架无关**: 可在 React、Vue、Angular 或原生 HTML 中使用
- 🎨 **纯 UI 组件**: 数据由客户传入，职责清晰
- 🚀 **零依赖**: 不依赖任何第三方库，体积小，加载快
- 🔒 **样式隔离**: Shadow DOM 确保样式不冲突
- 📦 **多种格式**: 支持 ESM、UMD、IIFE 多种模块格式

## 安装

### 方式一：通过 npm 安装（推荐）

这是推荐的方式，适用于使用构建工具（Vite、Webpack、Rollup 等）的项目。

```bash
npm install megaview-ui
```

安装后，在代码中引入：

```javascript
// ES Module
import 'megaview-ui';

// CommonJS
require('megaview-ui');
```

### 方式二：通过 CDN 引入

适用于直接在 HTML 中使用，无需构建工具。

#### jsDelivr CDN

```html
<!-- ES Module 版本（推荐，现代浏览器） -->
<script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>

<!-- IIFE 版本（传统浏览器，无需模块系统） -->
<script src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.iife.js"></script>
```

#### unpkg CDN

```html
<!-- ES Module 版本 -->
<script type="module" src="https://unpkg.com/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>

<!-- IIFE 版本 -->
<script src="https://unpkg.com/megaview-ui@1.0.0/dist/megaview-ui.iife.js"></script>
```

#### 自定义 CDN

如果部署到自己的 CDN 服务器：

```html
<!-- ES Module 版本 -->
<script type="module" src="https://cdn.yourdomain.com/megaview-ui/1.0.0/megaview-ui.es.js"></script>

<!-- IIFE 版本 -->
<script src="https://cdn.yourdomain.com/megaview-ui/1.0.0/megaview-ui.iife.js"></script>
```

> 💡 **提示**：更多 CDN 部署信息请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 快速开始

### 在原生 HTML 中使用

#### 使用 npm 安装

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import 'megaview-ui';
  </script>
</head>
<body>
  <megaview-conversation-summary
    data='{"summary_result":[{"question_name":"会话总结","answers":[{"content":"本次对话..."}]}]}'>
  </megaview-conversation-summary>
</body>
</html>
```

#### 使用 CDN 引入

```html
<!DOCTYPE html>
<html>
<head>
  <!-- 引入组件库 -->
  <script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>
</head>
<body>
  <!-- 使用组件 -->
  <megaview-conversation-summary
    data='{"summary_result":[{"question_name":"会话总结","answers":[{"content":"本次对话..."}]}]}'
    width="100%"
    height="600px">
  </megaview-conversation-summary>
</body>
</html>
```

### 在 React 中使用

首先安装依赖：

```bash
npm install megaview-ui
```

然后在代码中使用：

```jsx
import 'megaview-ui';
import { useRef, useEffect } from 'react';

function App() {
  const summaryRef = useRef(null);
  
  const conversationData = {
    summary_result: [
      {
        question_name: "会话总结",
        answers: [
          {
            content: "本次对话为销售与客户的初次接触..."
          }
        ]
      }
    ]
  };
  
  useEffect(() => {
    const element = summaryRef.current;
    
    const handleExpand = (e) => {
      console.log('展开:', e.detail.questionIndex);
    };
    
    element?.addEventListener('section-expand', handleExpand);
    
    return () => {
      element?.removeEventListener('section-expand', handleExpand);
    };
  }, []);
  
  return (
    <megaview-conversation-summary
      ref={summaryRef}
      data={JSON.stringify(conversationData)}
    />
  );
}
```

### 在 Vue 3 中使用

首先安装依赖：

```bash
npm install megaview-ui
```

然后在代码中使用：

```vue
<template>
  <megaview-conversation-summary
    :data="dataJson"
    @section-expand="handleExpand"
  />
</template>

<script setup>
import 'megaview-ui';
import { ref, computed } from 'vue';

const conversationData = ref({
  summary_result: [
    {
      question_name: "会话总结",
      answers: [
        {
          content: "本次对话为销售与客户的初次接触..."
        }
      ]
    }
  ]
});

const dataJson = computed(() => JSON.stringify(conversationData.value));

const handleExpand = (event) => {
  console.log('展开:', event.detail.questionIndex);
};
</script>
```

## 组件属性

### megaview-conversation-summary

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | string (JSON) | - | 会话数据（必需） |
| `width` | string | `'100%'` | 组件宽度 |
| `height` | string | `'auto'` | 组件高度 |

### 数据格式

组件接受的数据结构：

```javascript
{
  "conversation_id": 349488961,
  "summary_status": 2,
  "summary_result": [
    {
      "instruction_id": 968,
      "name": "销售XXXX",
      "question_name": "销售是否处理了客户的异议",
      "answer_desc": "问题描述...",
      "create_at": "2025-11-25 07:02:51",
      "answers": [
        {
          "content": "否",
          "context": [
            {
              "begin_time": 1763207700,
              "content": "对话内容...",
              "speaker_type": "user",
              "speaker_name": "销售"
            }
          ],
          "reasoning_process": "客户未在对话中提出任何异议..."
        }
      ]
    }
  ]
}
```

## 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| `updateData(data)` | 更新数据 | `data: object` |

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 浏览器支持

- Chrome >= 54
- Firefox >= 63
- Safari >= 10.1
- Edge >= 79

## 许可证

MIT

## 联系我们

如有问题或建议，请联系深维智信技术支持团队。

