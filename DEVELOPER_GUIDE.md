# 深维会话纪要组件库 - 开发者指南

## 📖 目录

- [组件库理念](#组件库理念)
- [快速开始](#快速开始)
- [集成步骤](#集成步骤)
- [数据格式说明](#数据格式说明)
- [常见问题](#常见问题)
- [最佳实践](#最佳实践)
- [API 参考](#api-参考)

---

## 🎯 组件库理念

### 设计哲学

深维会话纪要组件库是一个**纯 UI 展示组件库**，遵循以下核心设计理念：

#### 1. 框架无关 (Framework Agnostic)

基于 **Web Components** 标准构建，可以在任何前端框架中使用：

```
┌─────────────────────────────────────┐
│      Web Components 标准             │
├─────────────────────────────────────┤
│  • Custom Elements                  │
│  • Shadow DOM                       │
│  • 浏览器原生支持                    │
└─────────────────────────────────────┘
         ↓        ↓        ↓
    React      Vue      Angular    原生HTML
```

**优势**：
- ✅ 一次开发，到处使用
- ✅ 不受框架版本限制
- ✅ 无需额外的框架适配层
- ✅ 未来技术栈迁移零成本

#### 2. 职责分离 (Separation of Concerns)

组件**只负责 UI 展示**，不处理业务逻辑：

```
┌──────────────┐
│  你的应用     │  ← 负责：数据获取、状态管理、业务逻辑
└──────┬───────┘
       │ 传递数据 (JSON)
       ↓
┌──────────────┐
│  深维组件     │  ← 负责：UI 渲染、交互展示、样式管理
└──────────────┘
```

**优势**：
- ✅ 组件轻量，无副作用
- ✅ 易于测试和维护
- ✅ 数据流清晰可控
- ✅ 可以自由控制数据来源

#### 3. 零依赖 (Zero Dependencies)

不依赖任何第三方库，包括：

- ❌ 不依赖 React、Vue 等框架
- ❌ 不依赖 ECharts、D3 等图表库
- ❌ 不依赖 Lodash、Moment 等工具库

**优势**：
- ✅ 打包体积小（约 10KB）
- ✅ 加载速度快
- ✅ 无版本冲突风险
- ✅ 安全性高

#### 4. 样式隔离 (Style Encapsulation)

使用 **Shadow DOM** 实现样式完全隔离：

```
┌─────────────────────────────────────┐
│  你的应用样式                        │
│  .button { color: red; }            │
└─────────────────────────────────────┘
              ↕ 互不影响
┌─────────────────────────────────────┐
│  Shadow DOM (组件内部)               │
│  .button { color: blue; }           │
└─────────────────────────────────────┘
```

**优势**：
- ✅ 不会污染全局样式
- ✅ 不受外部样式影响
- ✅ 可以安全地使用通用类名
- ✅ 多个组件实例互不干扰

#### 5. 智能交互 (Smart Interaction)

组件会根据数据结构**自动判断**如何展示：

- 📄 **简单内容**：直接展开显示
- 📁 **复杂内容**：默认折叠，点击展开

这种设计让用户界面更加简洁，同时保留了查看详细信息的能力。

---

## 🚀 快速开始

### 30 秒快速体验

创建一个 HTML 文件，复制以下代码：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>深维会话纪要组件</title>
  <!-- 1️⃣ 引入组件库 -->
  <script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>
</head>
<body>
  <!-- 2️⃣ 使用组件 -->
  <megaview-conversation-summary id="summary"></megaview-conversation-summary>
  
  <script>
    // 3️⃣ 设置数据
    const data = {
      summary_result: [
        {
          question_name: "会话总结",
          answers: [{ content: "这是一次关于产品需求的讨论会议。" }]
        }
      ]
    };
    
    document.getElementById('summary').setAttribute('data', JSON.stringify(data));
  </script>
</body>
</html>
```

打开浏览器，你就能看到渲染好的会话纪要！

---

## 📦 集成步骤

### 方式一：通过 npm 安装（推荐）

适合使用构建工具的项目（Vite、Webpack、Rollup 等）。

#### 安装

```bash
npm install megaview-ui
```

#### 在代码中引入

```javascript
// ES Module
import 'megaview-ui';

// CommonJS
require('megaview-ui');
```

### 方式二：通过 CDN 引入

适合快速集成和原型开发，无需构建工具。

#### 原生 HTML / JavaScript

```html
<!-- 引入组件（jsDelivr CDN） -->
<script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>

<!-- 或使用 unpkg CDN -->
<script type="module" src="https://unpkg.com/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>

<!-- 使用组件 -->
<megaview-conversation-summary
  id="summary"
  width="100%"
  height="600px">
</megaview-conversation-summary>

<script>
  const summary = document.getElementById('summary');
  
  // 设置数据
  fetch('/api/conversation/summary')
    .then(res => res.json())
    .then(data => {
      summary.setAttribute('data', JSON.stringify(data));
    });
  
  // 监听事件
  summary.addEventListener('section-expand', (e) => {
    console.log('用户展开了问题:', e.detail.questionIndex);
  });
</script>
```

#### React 项目

**步骤 1**: 在 `public/index.html` 中引入组件库

```html
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>
</head>
```

**步骤 2**: 在组件中使用

```jsx
import { useRef, useEffect, useState } from 'react';

function ConversationSummary() {
  const summaryRef = useRef(null);
  const [data, setData] = useState(null);
  
  // 加载数据
  useEffect(() => {
    fetch('/api/conversation/summary')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  // 监听事件
  useEffect(() => {
    const element = summaryRef.current;
    if (!element) return;
    
    const handleExpand = (e) => {
      console.log('展开问题:', e.detail.questionIndex);
    };
    
    element.addEventListener('section-expand', handleExpand);
    return () => element.removeEventListener('section-expand', handleExpand);
  }, []);
  
  return (
    <megaview-conversation-summary
      ref={summaryRef}
      data={data ? JSON.stringify(data) : ''}
      width="100%"
      height="600px"
    />
  );
}
```

**TypeScript 支持**：

```typescript
// src/types/custom-elements.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'megaview-conversation-summary': {
      ref?: React.Ref<HTMLElement>;
      data?: string;
      width?: string;
      height?: string;
    };
  }
}
```

#### Vue 3 项目

**步骤 1**: 在 `index.html` 中引入组件库

```html
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>
</head>
```

**步骤 2**: 配置 `vite.config.js`（告诉 Vue 这是自定义元素）

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('megaview-')
        }
      }
    })
  ]
});
```

**步骤 3**: 在组件中使用

```vue
<template>
  <megaview-conversation-summary
    :data="dataJson"
    width="100%"
    height="600px"
    @section-expand="handleExpand"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const conversationData = ref(null);

// 加载数据
onMounted(async () => {
  const response = await fetch('/api/conversation/summary');
  conversationData.value = await response.json();
});

const dataJson = computed(() => 
  conversationData.value ? JSON.stringify(conversationData.value) : ''
);

const handleExpand = (event) => {
  console.log('展开问题:', event.detail.questionIndex);
};
</script>
```

### 方式二：通过 CDN 引入

适合快速集成和原型开发，无需构建工具。

#### jsDelivr CDN

```html
<!-- ES Module 版本（推荐） -->
<script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>

<!-- IIFE 版本（传统浏览器） -->
<script src="https://cdn.jsdelivr.net/npm/megaview-ui@1.0.0/dist/megaview-ui.iife.js"></script>
```

#### unpkg CDN

```html
<!-- ES Module 版本 -->
<script type="module" src="https://unpkg.com/megaview-ui@1.0.0/dist/megaview-ui.es.js"></script>

<!-- IIFE 版本 -->
<script src="https://unpkg.com/megaview-ui@1.0.0/dist/megaview-ui.iife.js"></script>
```

使用方式与 npm 安装相同，组件会自动注册。

---

## 📊 数据格式说明

### 核心数据结构

组件接受一个包含 `summary_result` 数组的对象：

```typescript
{
  conversation_id?: number;        // 可选：会话ID
  summary_status?: number;         // 可选：总结状态
  summary_result: Array<{          // 必需：总结结果数组
    question_name: string;         // 必需：问题名称
    answers: Array<{               // 必需：答案数组
      content: string;             // 必需：答案内容
      context?: Array<{            // 可选：上下文对话
        begin_time?: number;       // Unix 时间戳（秒）
        content: string;           // 对话内容
        speaker_type?: string;     // 说话人类型
        speaker_name?: string;     // 说话人名称
      }>;
      reasoning_process?: string;  // 可选：AI 推理过程
    }>;
  }>;
}
```

### 渲染逻辑

组件会**自动判断**如何展示每个问题：

#### 情况 1：简单问题（直接展示）

如果答案中**没有** `context` 和 `reasoning_process`：

```javascript
{
  question_name: "会话总结",
  answers: [
    {
      content: "这是一次关于产品需求的讨论会议。"
    }
  ]
}
```

**渲染效果**：
```
会话总结
这是一次关于产品需求的讨论会议。
```

#### 情况 2：复杂问题（默认折叠）

如果答案中**有** `context` 或 `reasoning_process`：

```javascript
{
  question_name: "销售是否处理了客户的异议",
  answers: [
    {
      content: "否",
      context: [
        {
          begin_time: 1763207700,
          content: "客户说：价格太贵了。",
          speaker_type: "customer"
        }
      ],
      reasoning_process: "客户提出了价格异议，但销售未进行处理。"
    }
  ]
}
```

**渲染效果**：
```
▼ 销售是否处理了客户的异议    ← 默认折叠，点击展开

（点击后展开）
▼ 销售是否处理了客户的异议
  否
  
  上下文
  ┌─────────────────────────┐
  │ 07:35  customer         │
  │ 客户说：价格太贵了。     │
  └─────────────────────────┘
  
  推理
  ┌─────────────────────────┐
  │ 客户提出了价格异议，但   │
  │ 销售未进行处理。         │
  └─────────────────────────┘
```

### 数据示例

完整的真实数据示例请参考 [`docs/examples.json`](./docs/examples.json)。

---

## ❓ 常见问题

### Q1: 为什么我的组件不显示？

**可能原因 1**：数据格式不正确

```javascript
// ❌ 错误：缺少 summary_result
const data = {
  title: "会议纪要"
};

// ✅ 正确：必须包含 summary_result 数组
const data = {
  summary_result: [
    {
      question_name: "会话总结",
      answers: [{ content: "..." }]
    }
  ]
};
```

**可能原因 2**：忘记 JSON.stringify

```javascript
// ❌ 错误：直接传对象
element.setAttribute('data', data);

// ✅ 正确：转换为 JSON 字符串
element.setAttribute('data', JSON.stringify(data));
```

**可能原因 3**：组件库未加载完成

```javascript
// ❌ 错误：立即使用组件
const summary = document.querySelector('megaview-conversation-summary');
summary.setAttribute('data', JSON.stringify(data));

// ✅ 正确：等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
  const summary = document.querySelector('megaview-conversation-summary');
  summary.setAttribute('data', JSON.stringify(data));
});
```

### Q2: React 中事件监听不生效？

**问题**：直接写 `onSection-expand` 不生效

```jsx
// ❌ 错误：React 不支持自定义事件的 on* 语法
<megaview-conversation-summary
  onSection-expand={handleExpand}
/>
```

**解决方案**：使用 `ref` + `addEventListener`

```jsx
// ✅ 正确
const summaryRef = useRef(null);

useEffect(() => {
  const element = summaryRef.current;
  element?.addEventListener('section-expand', handleExpand);
  return () => element?.removeEventListener('section-expand', handleExpand);
}, []);

return <megaview-conversation-summary ref={summaryRef} />;
```

### Q3: Vue 3 报错 "Failed to resolve component"？

**错误信息**：
```
[Vue warn]: Failed to resolve component: megaview-conversation-summary
```

**原因**：Vue 默认会尝试将 `<megaview-conversation-summary>` 解析为 Vue 组件。

**解决方案**：配置 `vite.config.js`

```javascript
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 告诉 Vue 这是自定义元素，不是 Vue 组件
          isCustomElement: (tag) => tag.startsWith('megaview-')
        }
      }
    })
  ]
});
```

### Q4: 如何动态更新数据？

**方式 1**：使用 `setAttribute`（推荐）

```javascript
// 更新数据
const newData = { summary_result: [...] };
element.setAttribute('data', JSON.stringify(newData));
```

**方式 2**：使用组件方法

```javascript
// 直接调用组件的 updateData 方法
element.updateData(newData);
```

### Q5: 组件支持哪些浏览器？

组件基于 Web Components 标准，支持所有现代浏览器：

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 54+ |
| Firefox | 63+ |
| Safari | 10.1+ |
| Edge | 79+ |

**不支持**：IE 11 及以下版本

### Q6: 可以自定义组件样式吗？

由于组件使用 Shadow DOM 进行样式隔离，外部样式**无法直接**影响组件内部。

**当前方案**：
- 可以通过 `width` 和 `height` 属性控制组件尺寸
- 组件内部样式已经过精心设计，适合大多数场景

**未来计划**：
- 提供 CSS 变量支持，允许自定义主题色
- 提供主题切换功能（明暗主题）

### Q7: 组件会发送网络请求吗？

**不会**。组件是纯 UI 组件，不会：
- ❌ 发送任何网络请求
- ❌ 读取或写入 Cookie
- ❌ 访问 LocalStorage
- ❌ 收集用户数据

所有数据都由你的应用传入，组件只负责展示。

### Q8: 组件的性能如何？

**性能指标**：
- 📦 打包体积：~10KB（gzip 后 ~3KB）
- ⚡ 首次渲染：< 50ms（1000 条问题）
- 🔄 更新渲染：< 20ms
- 💾 内存占用：< 2MB

**优化建议**：
- 如果数据量很大（>1000 条），建议分页加载
- 使用虚拟滚动（未来版本会支持）

---

## 💡 最佳实践

### 1. 数据加载

**推荐做法**：先显示加载状态，再渲染组件

```javascript
// 显示加载中
const container = document.getElementById('container');
container.innerHTML = '<div class="loading">加载中...</div>';

// 加载数据
fetch('/api/conversation/summary')
  .then(res => res.json())
  .then(data => {
    // 创建组件
    container.innerHTML = '<megaview-conversation-summary id="summary"></megaview-conversation-summary>';
    
    // 设置数据
    const summary = document.getElementById('summary');
    summary.setAttribute('data', JSON.stringify(data));
  })
  .catch(error => {
    container.innerHTML = '<div class="error">加载失败</div>';
  });
```

### 2. 错误处理

**推荐做法**：验证数据格式

```javascript
function isValidData(data) {
  return data 
    && Array.isArray(data.summary_result) 
    && data.summary_result.length > 0;
}

fetch('/api/conversation/summary')
  .then(res => res.json())
  .then(data => {
    if (!isValidData(data)) {
      console.error('数据格式不正确:', data);
      return;
    }
    
    summary.setAttribute('data', JSON.stringify(data));
  });
```

### 3. 事件监听

**推荐做法**：及时清理事件监听器

```javascript
// React
useEffect(() => {
  const element = summaryRef.current;
  const handleExpand = (e) => { /* ... */ };
  
  element?.addEventListener('section-expand', handleExpand);
  
  // 清理函数
  return () => {
    element?.removeEventListener('section-expand', handleExpand);
  };
}, []);
```

### 4. 响应式布局

**推荐做法**：使用百分比宽度

```html
<!-- ✅ 推荐：自适应容器宽度 -->
<megaview-conversation-summary
  width="100%"
  height="600px">
</megaview-conversation-summary>

<!-- ❌ 不推荐：固定像素宽度 -->
<megaview-conversation-summary
  width="800px"
  height="600px">
</megaview-conversation-summary>
```

---

## 📚 API 参考

### 属性（Attributes）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | `string` | - | 会话数据（JSON 字符串，必需） |
| `width` | `string` | `'100%'` | 组件宽度（支持 CSS 单位） |
| `height` | `string` | `'auto'` | 组件高度（支持 CSS 单位） |

### 事件（Events）

| 事件名 | 触发时机 | 事件参数 |
|--------|---------|---------|
| `section-expand` | 用户展开某个问题时 | `{ detail: { questionIndex: number } }` |
| `section-collapse` | 用户折叠某个问题时 | `{ detail: { questionIndex: number } }` |

### 方法（Methods）

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| `updateData(data)` | `data: Object` | `void` | 更新组件数据 |

---

## 🔗 相关资源

- **API 文档**：[docs/api.md](./docs/api.md)
- **集成指南**：[docs/integration.md](./docs/integration.md)
- **示例数据**：[docs/examples.json](./docs/examples.json)
- **在线演示**：[examples/](./examples/)

---

## 📞 技术支持

如有问题或建议，请联系深维技术支持团队。

**常见问题优先查看**：本文档的「常见问题」章节

**技术咨询**：请提供以下信息以便快速定位问题
- 使用的框架和版本（如 React 18.2.0）
- 浏览器和版本
- 完整的错误信息
- 最小可复现代码

---

## 📄 许可证

MIT License

---

**最后更新**：2024-11-26


