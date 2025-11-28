# 深维会话纪要组件库

基于 Web Components 的框架无关可视化组件库。

## 安装

### 方式一：通过 npm 安装（推荐）

这是推荐的方式，适用于使用构建工具（Vite、Webpack、Rollup 等）的项目。

```bash
npm install megaview-ui
```

安装后，在代码中引入：

```javascript
// ES Module - 推荐方式（自动注册组件）
import 'megaview-ui';

// 或者按需导入组件类（用于类型约束或实例方法调用）
import { MegaviewConversationSummary } from 'megaview-ui';

// CommonJS
require('megaview-ui');
```

### 方式二：通过 CDN 引入

适用于直接在 HTML 中使用，无需构建工具。

#### jsDelivr CDN

```html
<!-- ES Module 版本（推荐，现代浏览器） -->
<script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@0.0.3/dist/megaview-ui.es.js"></script>

<!-- IIFE 版本（传统浏览器，无需模块系统） -->
<script src="https://cdn.jsdelivr.net/npm/megaview-ui@0.0.3/dist/megaview-ui.iife.js"></script>
```

#### unpkg CDN

```html
<!-- ES Module 版本 -->
<script type="module" src="https://unpkg.com/megaview-ui@0.0.3/dist/megaview-ui.es.js"></script>

<!-- IIFE 版本 -->
<script src="https://unpkg.com/megaview-ui@0.0.3/dist/megaview-ui.iife.js"></script>
```

> 💡 **提示**：更多 CDN 部署信息请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

#### 关于导入方式的说明

- **全局导入（推荐）** `import 'megaview-ui'`：在应用入口处导入一次，自动注册所有自定义元素，后续可在任何组件中使用 `<megaview-conversation-summary>`
- **具名导入（可选）** `import { MegaviewConversationSummary }`：用于 TypeScript 类型约束，在需要类型检查的组件中单独导入
- **组合使用**：通常在应用入口全局导入一次，然后在具体组件中按需导入类型
- **不支持** `import { megaview-conversation-summary }`：JavaScript 标识符不能包含连字符，请使用驼峰命名的 `MegaviewConversationSummary`

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
  <script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui@0.0.3/dist/megaview-ui.es.js"></script>
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

然后在应用入口（main.js 或 App.js）全局导入：

```javascript
// src/main.js 或 src/App.js
import 'megaview-ui'; // 全局注册组件
```

在具体组件中使用：

```jsx
import { MegaviewConversationSummary } from 'megaview-ui'; // 仅用于类型约束
import { useRef, useEffect } from 'react';

function ConversationSummary({ conversationData }) {
  const summaryRef = useRef<MegaviewConversationSummary>(null);

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

然后在应用入口（main.js）全局导入：

```javascript
// src/main.js
import 'megaview-ui'; // 全局注册组件
```

在具体组件中使用：

```vue
<template>
  <megaview-conversation-summary
    ref="summaryRef"
    :data="dataJson"
    @section-expand="handleExpand"
  />
</template>

<script setup>
import { MegaviewConversationSummary } from 'megaview-ui'; // 仅用于类型约束
import { ref, computed } from 'vue';

const summaryRef = ref<MegaviewConversationSummary>();

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


## 文档

- [完整文档](./docs/readme-full.md) - 完整的项目介绍和开发指南
- [API 文档](./docs/api.md) - 完整的 API 参考文档
- [集成指南](./docs/integration.md) - 框架集成教程
- [项目结构说明](./docs/structure.md) - 了解项目目录组织方式
- [示例数据](./docs/examples.json) - 完整的数据格式示例

