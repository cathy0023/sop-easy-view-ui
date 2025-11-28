# 项目目录结构说明

本文档详细说明 MegaviewUI 项目的目录结构，帮助开发者快速了解项目组织方式。

## 目录树

```
MegaviewUI/
├── .storybook/              # Storybook 配置文件目录
│   ├── main.ts              # Storybook 主配置
│   ├── preview.ts           # Storybook 预览配置
│   └── vitest.setup.ts      # Vitest 测试设置
├── docs/                    # 项目文档目录
│   ├── api.md               # API 文档
│   ├── integration.md       # 集成指南
│   ├── examples.json        # 示例数据
│   └── structure.md         # 本文件：项目结构说明
├── examples/                # 示例项目目录
│   ├── cdn/                 # CDN 方式使用示例
│   │   └── index.html
│   ├── react/               # React 集成示例
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── src/
│   │       ├── App.jsx
│   │       ├── index.css
│   │       └── main.jsx
│   ├── vanilla/             # 原生 HTML 使用示例
│   │   └── index.html
│   └── vue/                 # Vue 3 集成示例
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js
│       └── src/
│           ├── App.vue
│           ├── main.js
│           └── style.css
├── scripts/                 # 构建和部署脚本
│   ├── deploy-cdn.js       # CDN 部署脚本
│   ├── publish.ps1         # Windows PowerShell 发布脚本
│   └── publish.sh           # Linux/Mac Shell 发布脚本
├── src/                     # 源代码目录
│   ├── components/          # 组件目录
│   │   └── conversation-summary/  # 会话纪要组件
│   │       ├── index.ts            # 组件主文件（导出组件类）
│   │       ├── types.ts            # TypeScript 类型定义
│   │       ├── conversation-summary.styles.ts  # 组件样式
│   │       ├── conversation-summary.test.ts   # 单元测试
│   │       └── conversation-summary.stories.ts # Storybook 故事
│   ├── utils/               # 工具函数目录
│   │   ├── dom.ts           # DOM 操作工具函数
│   │   ├── format.ts        # 格式化工具函数
│   │   └── index.ts         # 工具函数统一导出
│   └── index.ts             # 组件库入口文件
├── dist/                    # 构建输出目录（自动生成，不提交到 Git）
│   ├── megaview-ui.es.js    # ES Module 格式
│   ├── megaview-ui.umd.js    # UMD 格式
│   ├── megaview-ui.iife.js  # IIFE 格式
│   └── types/               # TypeScript 类型定义文件
│       ├── index.d.ts
│       └── components/
│           └── conversation-summary/
│               ├── index.d.ts
│               ├── types.d.ts
│               └── conversation-summary.styles.d.ts
├── node_modules/            # 依赖包目录（自动生成，不提交到 Git）
├── .gitignore              # Git 忽略文件配置
├── .releaserc.json         # Semantic Release 配置
├── CHANGELOG.md            # 更新日志（自动生成）
├── index.html              # 开发预览页面
├── package.json            # 项目配置文件
├── package-lock.json       # 依赖锁定文件
├── README.md               # 开发者集成文档（简化版）
├── docs/
│   ├── readme-full.md       # 完整项目文档（包含开发指南）
├── tsconfig.json           # TypeScript 编译配置
├── tsconfig.build.json     # 构建专用 TypeScript 配置
├── vite.config.js          # Vite 构建配置
├── vitest.shims.d.ts       # Vitest 类型声明
└── web-test-runner.config.mjs  # Web Test Runner 配置
```

## 目录说明

### 根目录文件

| 文件/目录 | 说明 |
|---------|------|
| `package.json` | 项目配置文件，包含依赖、脚本、元数据等 |
| `package-lock.json` | npm 依赖锁定文件，确保依赖版本一致性 |
| `README.md` | 开发者集成文档，包含快速开始、安装、使用说明 |
| `docs/readme-full.md` | 完整项目文档，包含项目特性、开发指南和技术栈说明 |
| `CHANGELOG.md` | 版本更新日志，由 Semantic Release 自动生成 |
| `.gitignore` | Git 忽略规则，排除 `node_modules`、`dist`、`coverage` 等 |
| `.releaserc.json` | Semantic Release 配置，定义自动发布流程 |
| `index.html` | 开发预览页面，用于 `npm run dev` 时快速测试组件 |

### 配置文件

| 文件 | 说明 |
|-----|------|
| `tsconfig.json` | TypeScript 主配置，用于开发时的类型检查 |
| `tsconfig.build.json` | 构建专用 TypeScript 配置，用于生成类型定义文件 |
| `vite.config.js` | Vite 构建配置，定义库构建模式、输出格式等 |
| `web-test-runner.config.mjs` | Web Test Runner 配置，用于运行单元测试 |
| `vitest.shims.d.ts` | Vitest 类型声明文件，提供测试环境的类型支持 |

### src/ 源代码目录

#### src/components/

组件目录，每个组件都有独立的子目录：

- **conversation-summary/**：会话纪要组件
  - `index.ts`：组件主文件，定义并导出 `MegaviewConversationSummary` 类
  - `types.ts`：组件相关的 TypeScript 类型定义和事件常量
  - `conversation-summary.styles.ts`：组件样式（使用 Lit 的 `css` 标签）
  - `conversation-summary.test.ts`：组件单元测试
  - `conversation-summary.stories.ts`：Storybook 故事文件，用于组件文档和可视化测试

#### src/utils/

工具函数目录：

- `dom.ts`：DOM 操作相关工具函数（如事件派发、CSS 变量设置）
- `format.ts`：格式化相关工具函数（如时间格式化、HTML 转义、文本处理）
- `index.ts`：工具函数统一导出（可选）

#### src/index.ts

组件库入口文件：
- 导入并注册所有组件（触发自定义元素注册）
- 导出组件类和类型，方便在 TypeScript 中使用
- 导出事件常量，便于类型安全的事件监听

### examples/ 示例目录

包含不同框架的集成示例，帮助用户快速上手：

- **cdn/**：CDN 方式使用示例（最简单）
- **vanilla/**：原生 HTML + JavaScript 使用示例
- **react/**：React 项目集成示例（包含完整项目结构）
- **vue/**：Vue 3 项目集成示例（包含完整项目结构）

### docs/ 文档目录

项目文档：

- `api.md`：完整的 API 文档，包含属性、方法、事件说明
- `integration.md`：集成指南，详细说明如何在 React、Vue、原生 HTML 中使用
- `examples.json`：示例数据文件，包含完整的会话数据格式示例
- `structure.md`：本文件，项目结构说明

### scripts/ 脚本目录

构建和部署相关脚本：

- `deploy-cdn.js`：CDN 部署脚本（Node.js）
- `publish.ps1`：Windows PowerShell 发布脚本
- `publish.sh`：Linux/Mac Shell 发布脚本

### dist/ 构建输出目录

**注意**：此目录由构建工具自动生成，不应手动修改，也不应提交到 Git。

包含三种格式的构建产物：

1. **ES Module** (`megaview-ui.es.js`)：现代浏览器和构建工具使用
2. **UMD** (`megaview-ui.umd.js`)：Node.js 和 AMD 模块系统使用
3. **IIFE** (`megaview-ui.iife.js`)：直接在浏览器中使用，无需模块系统

`dist/types/` 目录包含完整的 TypeScript 类型定义文件（`.d.ts`）。

### .storybook/ Storybook 配置

Storybook 相关配置文件：

- `main.ts`：Storybook 主配置，定义框架、插件、故事文件位置等
- `preview.ts`：预览配置，定义全局样式、参数等
- `vitest.setup.ts`：Vitest 测试设置，用于 Storybook 的测试集成

## 文件命名规范

### 组件文件

- 组件主文件：`index.ts`
- 类型定义：`types.ts`
- 样式文件：`{component-name}.styles.ts`
- 测试文件：`{component-name}.test.ts`
- Storybook 文件：`{component-name}.stories.ts`

### 工具文件

- 工具函数文件：`{功能}.ts`（如 `dom.ts`、`format.ts`）
- 统一导出：`index.ts`（可选）

## 构建流程

1. **开发阶段**：
   - 运行 `npm run dev`，使用 Vite 开发服务器
   - 修改 `src/` 下的源代码
   - 在 `index.html` 或 Storybook 中预览

2. **构建阶段**：
   - 运行 `npm run build`
   - Vite 构建库文件到 `dist/`
   - TypeScript 生成类型定义到 `dist/types/`

3. **测试阶段**：
   - 运行 `npm run test` 执行单元测试
   - 运行 `npm run storybook` 启动 Storybook 进行可视化测试

4. **发布阶段**：
   - 提交符合 Conventional Commits 规范的代码
   - Semantic Release 自动检测变更并发布新版本

## 扩展新组件

当需要添加新组件时，遵循以下步骤：

1. 在 `src/components/` 下创建新组件目录（如 `new-component/`）
2. 创建组件文件：`index.ts`、`types.ts`、`{component-name}.styles.ts`
3. 创建测试文件：`{component-name}.test.ts`
4. 创建 Storybook 文件：`{component-name}.stories.ts`
5. 在 `src/index.ts` 中导入并导出新组件
6. 更新文档：`docs/api.md`、`docs/integration.md`

## 注意事项

1. **不要手动修改 `dist/` 目录**：此目录由构建工具自动生成
2. **不要提交构建产物**：`dist/`、`node_modules/`、`coverage/` 已在 `.gitignore` 中
3. **遵循命名规范**：保持文件命名一致性，便于团队协作
4. **更新文档**：添加新功能时记得同步更新相关文档
5. **编写测试**：新组件应包含单元测试和 Storybook 故事

## 相关文档

- [API 文档](./api.md) - 详细的 API 说明
- [集成指南](./integration.md) - 框架集成教程
- [README.md](../README.md) - 开发者集成文档
- [readme-full.md](./readme-full.md) - 完整项目文档

