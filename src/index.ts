/**
 * Megaview UI 组件库入口文件
 *
 * 设计理念：
 * - 统一暴露组件的注册副作用，确保在任意框架环境中只要导入一次即可注册自定义元素
 * - 以纯扁平目录结构管理组件，便于未来扩展更多 Web Components
 * - 基于 Lit + TypeScript 构建，提供类型安全和现代化开发体验
 * - 提供全局颜色变量系统，支持统一的主题定制
 *
 * 使用场景：
 * - 直接 `import 'megaview-ui'` 以完成组件注册和全局样式导入
 * - 或者按需引入 `MegaviewConversationSummary` 以便做类型约束或实例方法调用
 *
 * 技术栈：
 * - Lit 3.x：现代化 Web Components 框架
 * - TypeScript：类型安全，提升开发体验
 * - 所有组件均使用 Lit 构建，保持一致的 API 和事件系统
 */
import './styles/global.css';
import './components/conversation-summary/index';

// 导出组件类，方便直接访问实例方法，便于在 React/Vue 等框架中获取引用
export { default as MegaviewConversationSummary } from './components/conversation-summary/index';

// 导出类型与事件常量，便于业务方在 TypeScript 中复用
export type {
  ConversationAnswer,
  ConversationContextSnippet,
  ConversationEventName,
  ConversationQuestionBlock,
  ConversationSummaryData,
  SectionToggleDetail
} from './components/conversation-summary/types';

export { CONVERSATION_EVENTS } from './components/conversation-summary/types';

