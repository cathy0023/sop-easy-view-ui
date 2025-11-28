# 集成指南

本文档介绍如何在不同框架中通过 CDN 方式集成深维会话纪要组件。

## 原生 HTML 集成

最简单的集成方式，只需引入脚本并使用组件即可。

### 完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <!-- 1. 引入组件库 -->
  <script type="module" src="https://cdn.megaview.com/ui/1.0.0/megaview-ui.es.js"></script>
</head>
<body>
  <!-- 2. 使用组件 -->
  <megaview-conversation-summary
    id="summary">
  </megaview-conversation-summary>
  
  <script>
    const summary = document.getElementById('summary');
    
    // 3. 设置数据
    const data = {
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
    
    summary.setAttribute('data', JSON.stringify(data));
  </script>
</body>
</html>
```

## Vue 3 集成

在 Vue 项目中使用 CDN 方式集成主要分为三步：引入脚本、配置编译器选项（忽略自定义元素警告）、使用组件。

### 1. 引入脚本

在项目的入口 HTML 文件（通常是 `index.html`）中引入：

```html
<head>
  <script type="module" src="https://cdn.megaview.com/ui/1.0.0/megaview-ui.es.js"></script>
</head>
```

### 2. 配置编译器选项

为了避免 Vue 将自定义元素识别为组件并报错，需要配置 `isCustomElement`。

**如果是 Vite 项目 (`vite.config.js`)**:

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将 megaview- 开头的标签视为自定义元素，Vue 将不会尝试解析它
          isCustomElement: (tag) => tag.startsWith('megaview-')
        }
      }
    })
  ]
});
```

### 3. 在组件中使用

```vue
<template>
  <megaview-conversation-summary
    :data="dataJson"
    @section-expand="handleExpand"
    @section-collapse="handleCollapse"
  />
</template>

<script setup>
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

const handleCollapse = (event) => {
  console.log('折叠:', event.detail.questionIndex);
};
</script>
```

## React 集成

在 React 项目中使用 CDN 方式集成需要注意事件监听和属性传递。

### 1. 引入脚本

在项目的入口 HTML 文件（通常是 `public/index.html`）中引入：

```html
<head>
  <script type="module" src="https://cdn.megaview.com/ui/1.0.0/megaview-ui.es.js"></script>
</head>
```

### 2. 在组件中使用

```jsx
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
    ],
  };
  
  useEffect(() => {
    const element = summaryRef.current;
    
    // 监听展开事件
    const handleExpand = (e) => {
      console.log('展开:', e.detail.questionIndex);
    };
    
    // 监听折叠事件
    const handleCollapse = (e) => {
      console.log('折叠:', e.detail.questionIndex);
    };
    
    element?.addEventListener('section-expand', handleExpand);
    element?.addEventListener('section-collapse', handleCollapse);
    
    return () => {
      element?.removeEventListener('section-expand', handleExpand);
      element?.removeEventListener('section-collapse', handleCollapse);
    };
  }, []);
  
  return (
    <megaview-conversation-summary
      ref={summaryRef}
      data={JSON.stringify(conversationData)}
    />
  );
}

export default App;
```

### TypeScript 支持

如果使用 TypeScript，需要声明自定义元素类型：

```typescript
// src/types/custom-elements.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'megaview-conversation-summary': {
      ref?: React.Ref<HTMLElement>;
      data?: string;
      width?: string;
      height?: string;
    },
    HTMLElement
  }
}
```

## 常见问题

### Q: 为什么我在 React 中直接写 `onSection-expand` 不生效？
A: React 的事件系统（SyntheticEvent）在旧版本中不直接支持 Web Components 的自定义事件。需要使用 `ref` 和 `addEventListener` 来监听。

### Q: Vue 3 中报错 "Failed to resolve component: megaview-conversation-summary"
A: 需要在 `vite.config.js` 或 `vue.config.js` 中配置 `isCustomElement`，告诉 Vue 这是一个自定义元素而不是 Vue 组件。

### Q: 如何动态更新数据？
A: 可以使用两种方式：
1. 使用 `setAttribute` 方法：`element.setAttribute('data', JSON.stringify(newData))`
2. 使用组件的 `updateData` 方法：`element.updateData(newData)`

### Q: 组件支持哪些浏览器？
A: 组件基于 Web Components 标准，支持所有现代浏览器：
- Chrome >= 54
- Firefox >= 63
- Safari >= 10.1
- Edge >= 79

### Q: 可以自定义组件样式吗？
A: 组件使用 Shadow DOM 进行样式隔离，外部样式无法直接影响组件内部。如需自定义样式，可以通过组件的 CSS 变量（如果提供）或联系我们定制。

### Q: 数据格式必须完全匹配吗？
A: 组件会自动处理缺失的字段。必需字段只有 `summary_result` 数组，其他字段都是可选的。如果某个问题的答案没有 `context` 和 `reasoning_process`，组件会直接显示 `content`；如果有，则默认折叠。

## 更多资源

- [API 文档](./api.md) - 完整的 API 参考文档
- [项目结构说明](./structure.md) - 了解项目目录组织方式
- [在线示例](../examples/) - 查看不同框架的集成示例
- [GitHub 仓库](https://github.com/megaview/MegaviewUI)
