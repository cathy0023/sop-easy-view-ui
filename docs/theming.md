# 主题配置

MegaviewUI 支持通过 CSS 变量进行全局主题定制，让你能够轻松改变整个组件库的外观。

## 全局颜色变量

组件库提供了以下全局 CSS 变量来控制颜色主题：

### 基础色彩

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--megaview-color-primary` | `#4461ec` | 主色，用于主要按钮、链接、强调元素 |
| `--megaview-color-text` | `#333333` | 主要文字颜色 |
| `--megaview-color-text-secondary` | `#666666` | 次要文字颜色 |
| `--megaview-color-bg` | `#f5f5f5` | 页面背景色 |
| `--megaview-color-surface` | `#ffffff` | 卡片、面板背景色 |
| `--megaview-color-border` | `#e0e0e0` | 边框颜色 |
| `--megaview-color-hover` | `#f5f5f5` | 悬停状态背景色 |

### 扩展色彩

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--megaview-color-primary-bg` | `#eaeffb` | 主色浅背景，用于高亮区域 |
| `--megaview-color-success` | `#52c41a` | 成功状态颜色 |
| `--megaview-color-warning` | `#faad14` | 警告状态颜色 |
| `--megaview-color-error` | `#ff4d4f` | 错误状态颜色 |

## 定制方法

### 方法一：在 HTML 中全局覆盖

最简单的方式，直接在 HTML 中定义样式：

```html
<!DOCTYPE html>
<html>
<head>
  <style>
  :root {
    /* 自定义主色调 */
    --megaview-color-primary: #ff6b35;
    --megaview-color-primary-bg: rgba(255, 107, 53, 0.1);

    /* 自定义文字颜色 */
    --megaview-color-text: #2d3748;
    --megaview-color-text-secondary: #4a5568;

    /* 自定义背景 */
    --megaview-color-bg: #f8f9fa;
    --megaview-color-surface: #ffffff;
    --megaview-color-border: #e2e8f0;
    --megaview-color-hover: #edf2f7;
  }
  </style>
  <script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui/dist/megaview-ui.es.js"></script>
</head>
<body>
  <megaview-conversation-summary data='{"summary_result": [...]}'>
  </megaview-conversation-summary>
</body>
</html>
```

### 方法二：外部 CSS 文件

创建一个主题文件，然后引入：

```css
/* theme.css */
:root {
  /* 橙色主题 */
  --megaview-color-primary: #ff6b35;
  --megaview-color-primary-bg: rgba(255, 107, 53, 0.1);
  --megaview-color-text: #2d3748;
  --megaview-color-text-secondary: #4a5568;
  --megaview-color-bg: #f8f9fa;
  --megaview-color-surface: #ffffff;
  --megaview-color-border: #e2e8f0;
  --megaview-color-hover: #edf2f7;
}
```

```html
<head>
  <link rel="stylesheet" href="theme.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui/dist/megaview-ui.es.js"></script>
</head>
```

### 方法三：JavaScript 动态设置

运行时动态改变主题：

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/megaview-ui/dist/megaview-ui.es.js"></script>
</head>
<body>
  <button onclick="changeTheme()">切换主题</button>
  <megaview-conversation-summary data='{"summary_result": [...]}'>
  </megaview-conversation-summary>

  <script>
    function changeTheme() {
      // 切换到橙色主题
      document.documentElement.style.setProperty('--megaview-color-primary', '#ff6b35');
      document.documentElement.style.setProperty('--megaview-color-primary-bg', 'rgba(255, 107, 53, 0.1)');
      document.documentElement.style.setProperty('--megaview-color-text', '#2d3748');
      document.documentElement.style.setProperty('--megaview-color-text-secondary', '#4a5568');
      document.documentElement.style.setProperty('--megaview-color-bg', '#f8f9fa');
      document.documentElement.style.setProperty('--megaview-color-surface', '#ffffff');
      document.documentElement.style.setProperty('--megaview-color-border', '#e2e8f0');
      document.documentElement.style.setProperty('--megaview-color-hover', '#edf2f7');
    }
  </script>
</body>
</html>
```

### 方法四：在构建工具中使用

#### Vite 项目

```javascript
// vite.config.js
export default {
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `
          :root {
            --megaview-color-primary: #10b981;
            --megaview-color-text: #1f2937;
            /* ... 其他变量 */
          }
        `
      }
    }
  }
}
```

#### Webpack 项目

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-css-variables', {
                    variables: {
                      '--megaview-color-primary': '#10b981',
                      '--megaview-color-text': '#1f2937',
                      // ... 其他变量
                    }
                  }]
                ]
              }
            }
          }
        ]
      }
    ]
  }
}
```

## 框架特定集成

### React 项目

```jsx
// App.js 或 main.js
import 'megaview-ui'; // 自动导入全局样式

// 动态主题切换
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // 设置自定义主题
    document.documentElement.style.setProperty('--megaview-color-primary', '#10b981');
    document.documentElement.style.setProperty('--megaview-color-text', '#1f2937');
  }, []);

  return (
    <div>
      <megaview-conversation-summary data={JSON.stringify(data)} />
    </div>
  );
}
```

### Vue 3 项目

```javascript
// main.js
import 'megaview-ui'; // 自动导入全局样式

// 在组件中使用
export default {
  mounted() {
    // 设置自定义主题
    document.documentElement.style.setProperty('--megaview-color-primary', '#10b981');
    document.documentElement.style.setProperty('--megaview-color-text', '#1f2937');
  }
}
```

## 主题示例

### 深色主题

```css
:root {
  --megaview-color-primary: #597ef7;
  --megaview-color-text: #ffffff;
  --megaview-color-text-secondary: #bfbfbf;
  --megaview-color-bg: #141414;
  --megaview-color-surface: #1f1f1f;
  --megaview-color-border: #434343;
  --megaview-color-hover: #262626;
  --megaview-color-primary-bg: rgba(89, 126, 247, 0.1);
}
```

### 绿色主题

```css
:root {
  --megaview-color-primary: #10b981;
  --megaview-color-text: #1f2937;
  --megaview-color-text-secondary: #4b5563;
  --megaview-color-bg: #f0fdf4;
  --megaview-color-surface: #ffffff;
  --megaview-color-border: #d1fae5;
  --megaview-color-hover: #ecfdf5;
  --megaview-color-primary-bg: rgba(16, 185, 129, 0.1);
}
```

## 向后兼容性

组件库保持对旧版本的兼容性：

- 旧的 `--megaview-conversation-*` 变量仍然有效
- 新版本建议使用 `--megaview-color-*` 全局变量进行主题定制
- 全局变量优先级高于组件特定变量

## 注意事项

1. **CSS 变量作用域**：变量需要在 `:root` 或父元素中定义才能全局生效
2. **动态更新**：通过 JavaScript 设置的变量会立即生效，无需重新渲染组件
3. **性能影响**：CSS 变量是原生支持的，不会影响性能
4. **浏览器兼容性**：支持所有现代浏览器，IE 11 需要 polyfill

## 更多资源

- [全局颜色变量定义](../src/styles/global.css) - 查看完整的变量定义
- [集成指南](./integration.md) - 了解如何在不同框架中集成
- [API 文档](./api.md) - 组件 API 参考


