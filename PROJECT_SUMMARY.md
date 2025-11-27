# 深维会话纪要组件库 - 项目总结

## 项目概述

本项目是一个基于 Web Components 的框架无关可视化组件库，专门用于展示会话纪要信息。组件采用纯 JavaScript 开发，无需任何外部依赖，可以在任何前端框架（React、Vue、Angular）或原生 HTML 中使用。

## 核心特性

### 1. 框架无关
- 基于 Web Components 标准（Custom Elements + Shadow DOM）
- 可在任何前端框架中使用，无需额外适配
- 支持原生 HTML、React、Vue 3、Angular 等

### 2. 智能折叠
- 自动识别数据结构，决定是否需要折叠
- **简单模式**：如果答案中没有 `context` 和 `reasoning_process`，直接显示 `content`
- **折叠模式**：如果答案中有 `context` 或 `reasoning_process`，默认折叠，点击 `question_name` 展开

### 3. 纯 UI 组件
- 只负责数据展示，不处理 API 调用
- 数据由客户通过属性传入
- 职责清晰，易于集成

### 4. 零依赖
- 不依赖任何第三方库（包括 ECharts、React 等）
- 打包后体积小（约 10KB）
- 加载速度快

### 5. 样式隔离
- 使用 Shadow DOM 确保样式不冲突
- 组件内部样式不会影响外部页面
- 外部样式也无法影响组件内部

## 数据结构

组件接受以下数据格式：

```typescript
{
  conversation_id?: number;        // 会话ID
  summary_status?: number;         // 总结状态
  summary_result: Array<{          // 总结结果数组（必需）
    instruction_id: number;        // 指令ID
    name: string;                  // 分类名称
    question_name: string;         // 问题名称
    answer_desc?: string;          // 答案描述
    create_at?: string;            // 创建时间
    answers: Array<{               // 答案数组
      content: string;             // 答案内容
      context?: Array<{            // 上下文数组（可选）
        begin_time?: number;       // 开始时间戳
        end_time?: number;         // 结束时间戳
        content: string;           // 上下文内容
        speaker_id?: number;       // 说话人ID
        speaker_type?: string;     // 说话人类型
        speaker_name?: string;     // 说话人名称
        order?: number;            // 顺序
      }>;
      reasoning_process?: string;  // 推理过程（可选）
    }>;
  }>;
}
```

## 技术栈

- **核心技术**: Web Components (Custom Elements + Shadow DOM)
- **开发语言**: 原生 JavaScript (ES6+)
- **构建工具**: Vite
- **输出格式**: ESM、UMD、IIFE

## 项目结构

```
MegaviewUI/
├── src/
│   ├── components/
│   │   └── conversation-summary/
│   │       └── index.js              # 组件实现
│   └── index.js                      # 库入口
├── examples/
│   ├── vanilla/                      # 原生HTML示例
│   ├── react/                        # React集成示例
│   └── vue/                          # Vue集成示例
├── docs/
│   ├── api.md                        # API文档
│   ├── integration.md                # 集成指南
│   └── examples.json                 # 示例数据
├── dist/                             # 构建输出
│   ├── megaview-ui.es.js            # ESM格式
│   ├── megaview-ui.umd.js           # UMD格式
│   └── megaview-ui.iife.js          # IIFE格式
├── index.html                        # 主演示页面
├── test-examples.html                # examples.json数据测试页面
├── package.json
├── vite.config.js
└── README.md
```

## 使用方式

### 1. 原生 HTML

```html
<script type="module" src="https://cdn.megaview.com/ui/1.0.0/megaview-ui.es.js"></script>

<megaview-conversation-summary
  id="summary"
  data='{"summary_result":[...]}'>
</megaview-conversation-summary>
```

### 2. React

```jsx
import { useRef, useEffect } from 'react';

function App() {
  const summaryRef = useRef(null);
  
  useEffect(() => {
    const element = summaryRef.current;
    element?.addEventListener('section-expand', handleExpand);
    return () => element?.removeEventListener('section-expand', handleExpand);
  }, []);
  
  return (
    <megaview-conversation-summary
      ref={summaryRef}
      data={JSON.stringify(data)}
    />
  );
}
```

### 3. Vue 3

```vue
<template>
  <megaview-conversation-summary
    :data="dataJson"
    @section-expand="handleExpand"
  />
</template>

<script setup>
const dataJson = computed(() => JSON.stringify(data));
</script>
```

## 组件 API

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | string | - | 会话数据（JSON字符串，必需） |
| `width` | string | `'100%'` | 组件宽度 |
| `height` | string | `'auto'` | 组件高度 |

### 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `section-expand` | 问题展开时触发 | `{ questionIndex: number }` |
| `section-collapse` | 问题折叠时触发 | `{ questionIndex: number }` |

### 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| `updateData(data)` | 更新数据 | `data: object` |

## 构建与部署

### 开发

```bash
npm install
npm run dev
```

### 构建

```bash
npm run build
```

构建后会生成三种格式的文件：
- `dist/megaview-ui.es.js` - ESM 格式（约 9.92 KB）
- `dist/megaview-ui.umd.js` - UMD 格式（约 8.95 KB）
- `dist/megaview-ui.iife.js` - IIFE 格式（约 8.78 KB）

### 测试

1. 打开 `index.html` 查看基本示例
2. 打开 `test-examples.html` 查看 `examples.json` 数据渲染效果
3. 运行 `examples/vanilla/index.html` 查看原生 HTML 集成示例
4. 运行 `examples/react/` 查看 React 集成示例
5. 运行 `examples/vue/` 查看 Vue 集成示例

## 浏览器支持

- Chrome >= 54
- Firefox >= 63
- Safari >= 10.1
- Edge >= 79

## 文档

- [README.md](./README.md) - 项目概述和快速开始
- [docs/api.md](./docs/api.md) - 完整的 API 文档
- [docs/integration.md](./docs/integration.md) - 各框架集成指南
- [docs/examples.json](./docs/examples.json) - 真实的数据示例

## 关键实现细节

### 1. 智能折叠逻辑

组件在渲染每个问题时，会检查答案中是否包含 `context` 或 `reasoning_process`：

```javascript
const hasDetails = answers.some(answer => 
  (answer.context && answer.context.length > 0) || 
  (answer.reasoning_process && answer.reasoning_process.trim())
);
```

- 如果 `hasDetails` 为 `true`，问题默认折叠，显示折叠图标
- 如果 `hasDetails` 为 `false`，问题直接展开，不显示折叠图标

### 2. 时间戳格式化

上下文中的时间戳会自动转换为 `HH:MM` 格式：

```javascript
formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
```

### 3. Shadow DOM 样式隔离

组件使用 Shadow DOM 确保样式隔离：

```javascript
constructor() {
  super();
  this.shadow = this.attachShadow({ mode: 'open' });
}
```

所有样式都注入到 Shadow DOM 中，不会影响外部页面。

### 4. 事件系统

组件使用 CustomEvent 触发事件，确保事件可以穿透 Shadow DOM：

```javascript
this.dispatchEvent(new CustomEvent('section-expand', { 
  detail: { questionIndex: index },
  bubbles: true,
  composed: true  // 允许事件穿透 Shadow DOM
}));
```

## 未来改进方向

1. **主题支持**：添加明暗主题切换功能
2. **导出功能**：支持导出为 PDF、文本等格式
3. **搜索功能**：支持在会话纪要中搜索关键词
4. **国际化**：支持多语言
5. **更多组件**：根据需求添加更多可视化组件

## 联系方式

如有问题或建议，请联系深维技术支持团队。
