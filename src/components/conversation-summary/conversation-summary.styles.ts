import { css } from 'lit';

/**
 * 会话纪要组件样式
 *
 * 设计说明：
 * - 使用全局 CSS 变量进行颜色配置，支持统一的主题定制
 * - 样式结构保持与旧版本一致，减少用户升级成本
 * - 所有 class 名称都带有清晰的语义，帮助新手对照 DOM 结构定位
 *
 * Part 暴露说明：
 * - container: 最外层容器，通过 ::part(container) 可自定义布局
 * - card: 卡片容器，通过 ::part(card) 可自定义卡片样式
 * - 根节点通过组件标签名直接样式化，不需要 part 属性
 *
 * 颜色配置说明：
 * - 所有颜色都通过 --megaview-color-* 变量控制
 * - 开发者可以通过覆盖这些全局变量来定制主题色
 * - 向后兼容旧的 --megaview-conversation-* 变量作为fallback
 */
export const conversationSummaryStyles = css`
  :host {
    display: block;
    width: var(--megaview-conversation-width, 100%);
    height: var(--megaview-conversation-height, auto);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: var(--megaview-color-text, var(--megaview-conversation-text, #333333));
    /* 将滚动移到根组件上，避免在某些场景下出现双滚动条或无法滚动的问题 */
    overflow-y: auto;
  }

  :host([hidden]) {
    display: none;
  }

  .container {
    height: 100%;
    box-sizing: border-box;
  }

  .card {
    /* 移除 overflow-y: auto，将滚动控制权交给根组件 */
    background: var(--megaview-color-surface, var(--megaview-conversation-card-bg, #ffffff));
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 16px;
  }

  .question-item {
    margin-bottom: 12px;
    border-radius: 4px;
    background: var(--megaview-color-surface, var(--megaview-conversation-card-bg, #ffffff));
  }

  .question-item:hover {
    background-color: var(--megaview-color-hover, var(--megaview-conversation-hover, #f5f5f5));
  }

  .question-item:last-child {
    margin-bottom: 0;
  }

  .question-header {
    display: flex;
    align-items: center;
    gap: 12px;
    user-select: none;
    padding: 8px 16px;
    border-radius: 4px;
    transition: background-color 0.2s;
    position: relative;
    padding-left: 20px;
  }

  .question-header.has-details {
    cursor: pointer;
  }

  .question-header.no-details {
    cursor: default;
  }

  .question-header::before {
    /* 
     * 问题标题左侧标记点样式
     *
     * 设计说明：
     * - 旧版本这里是一条竖直的蓝色高亮条，和系统中其他模块的“重点高亮条”设计一致
     * - 实际使用中，用户会误以为这两种高亮条表达的是同一层级/同一含义，造成概念混淆
     * - 为了弱化“结构层级”的暗示、强化“这是一个问题条目”的感觉，我们改成一个小圆点标记
     *
     * 视觉效果：
     * - 小圆点使用主题主色，尺寸较小，不会抢占太多视觉注意力
     * - 与传统的列表项 bullet 有些类似，可以自然地表达“这是一个问题项”的含义
     */
    content: '';
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--megaview-color-primary, var(--megaview-conversation-primary, #4461ec));
  }

  .question-name {
    font-size: 15px;
    font-weight: 500;
    color: inherit;
    flex: 1;
  }

  .collapse-icon {
    font-size: 14px;
    color: var(--megaview-color-text-secondary, var(--megaview-conversation-text-secondary, #666666));
    transition: transform 0.2s;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .collapse-icon.collapsed {
    transform: rotate(180deg);
  }

  .question-content {
    padding: 4px 16px 12px 24px;
    color: inherit;
    line-height: 1.8;
    border-radius: 4px;
    /* 
     * 折叠动画说明：
     * - 这里为问答内容区域预置「高度 + 透明度」的过渡动画
     * - 当外部为 .question-content 添加 .collapsed 类时，会看到从展开到收起的平滑动画
     * - 之所以使用 max-height 而不是 display: none，是因为 display: none 无法参与过渡动画
     * - 2000px 只是一个足够大的理论上限，保证正常内容不会被裁剪
     */
    max-height: 2000px;
    opacity: 1;
    overflow: hidden;
    transition:
      max-height 0.25s ease,
      opacity 0.25s ease,
      padding-top 0.25s ease,
      padding-bottom 0.25s ease,
      margin-top 0.25s ease,
      margin-bottom 0.25s ease;
  }
  
  .question-content:first-child {
    padding: 0px 16px 12px 24px;
  }

  /**
   * 问答内容折叠状态
   *
   * 设计思路：
   * - 通过减小 max-height + 降低透明度来模拟「收起」动画
   * - 同时去掉上下内边距和上下外边距，避免折叠后留下多余空白
   * - 不使用 display: none，这样浏览器才能执行过渡动画
   */
  .question-content.collapsed {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  .answer-content {
    color: inherit;
    font-size: 14px;
    padding-top: 8px;
    border-top: 1px dashed var(--megaview-color-border, #e0e0e0);
    margin-top: 16px;
  }

  .answer-content:first-child {
    padding-top: 0;
    margin-top: 0;
    border-top: none;
  }

  .context-section {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--megaview-color-border, var(--megaview-conversation-border, #e0e0e0));
    /* 
     * 上下文区域折叠动画基础样式
     *
     * 设计思路：
     * - 使用 max-height + opacity 的方式来实现「展开/收起」的过渡动画
     * - 不能使用 display: none，因为那样浏览器不会对高度变化做动画
     * - 这里给一个足够大的 max-height（例如 2000px），正常内容高度远小于此值
     */
    max-height: 2000px;
    opacity: 1;
    overflow: hidden;
    transition:
      max-height 0.25s ease,
      opacity 0.25s ease,
      padding-top 0.25s ease,
      padding-bottom 0.25s ease,
      margin-top 0.25s ease;
  }

  /**
   * 当上下文被折叠时隐藏整块内容（带动画）
   *
   * 说明：
   * - 不再使用 display: none，而是通过减小 max-height + 降低透明度实现动画
   * - 同时收紧 padding / margin，避免折叠后留下多余空白
   */
  .context-section.collapsed {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    border-top: none;
  }

  .context-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--megaview-color-text-secondary, var(--megaview-conversation-text-secondary, #666666));
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .context-item {
    background: var(--megaview-color-surface, var(--megaview-conversation-card-bg, #ffffff));
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 13px;
    line-height: 1.6;
    border-left: 3px solid var(--megaview-color-primary, var(--megaview-conversation-primary, #4461ec));
  }

  .context-item:last-child {
    margin-bottom: 0;
  }

  .context-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;
    font-size: 12px;
    color: var(--megaview-color-primary, var(--megaview-conversation-primary, #4461ec));
    font-weight: 500;
  }

  .speaker-type {
    color: var(--megaview-color-text-secondary, var(--megaview-conversation-text-secondary, #666666));
    font-weight: 500;
  }

  .context-text {
    color: inherit;
    word-break: break-word;
    line-height: 1.7;
  }

  .reasoning-section {
    padding-top: 16px;
    /* 推理区域折叠动画基础样式，逻辑与 context-section 一致 */
    max-height: 2000px;
    opacity: 1;
    overflow: hidden;
    transition:
      max-height 0.25s ease,
      opacity 0.25s ease,
      padding-top 0.25s ease,
      padding-bottom 0.25s ease,
      margin-top 0.25s ease;
  }

  /* 推理详情折叠状态样式，使用高度 + 透明度过渡而不是直接隐藏 */
  .reasoning-section.collapsed {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
  }

  .reasoning-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--megaview-color-text-secondary, var(--megaview-conversation-text-secondary, #666666));
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .reasoning-content {
    background: var(--megaview-color-primary-bg, var(--megaview-conversation-primary-bg, #eaeffb));
    padding: 12px 16px;
    border-radius: 4px;
    border-left: 3px solid var(--megaview-color-primary, var(--megaview-conversation-primary, #4461ec));
    font-size: 13px;
    line-height: 1.7;
    color: inherit;
    word-break: break-word;
  }

  .empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--megaview-color-text-secondary, var(--megaview-conversation-text-secondary, #666666));
  }

  /* Markdown 渲染内容容器样式 */
  /* 这些样式用于美化 Markdown 渲染后的 HTML 内容，使其与组件整体风格一致 */
  .markdown-content {
    color: inherit;
    font-size: 14px;
    line-height: 1.8;
    word-break: break-word;
  }

  /* Markdown 标题样式 */
  /* h1-h6 标题使用不同的字号和间距，保持清晰的层次感 */
  .markdown-content h1,
  .markdown-content h2,
  .markdown-content h3,
  .markdown-content h4,
  .markdown-content h5,
  .markdown-content h6 {
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: 600;
    color: inherit;
    line-height: 1.4;
  }

  .markdown-content h1 {
    font-size: 24px;
    border-bottom: 2px solid var(--megaview-color-border, #e0e0e0);
    padding-bottom: 8px;
  }

  .markdown-content h2 {
    font-size: 20px;
    border-bottom: 1px solid var(--megaview-color-border, #e0e0e0);
    padding-bottom: 6px;
  }

  .markdown-content h3 {
    font-size: 18px;
  }

  .markdown-content h4 {
    font-size: 16px;
  }

  .markdown-content h5 {
    font-size: 15px;
  }

  .markdown-content h6 {
    font-size: 14px;
    color: var(--megaview-color-text-secondary, var(--megaview-conversation-text-secondary, #666666));
  }

  /* Markdown 段落样式 */
  .markdown-content p {
    margin-top: 8px;
    margin-bottom: 8px;
    line-height: 1.8;
  }

  .markdown-content p:first-child {
    margin-top: 0;
  }

  .markdown-content p:last-child {
    margin-bottom: 0;
  }

  /* Markdown 列表样式 */
  /* 无序列表和有序列表使用合适的缩进和间距 */
  .markdown-content ul,
  .markdown-content ol {
    margin-top: 8px;
    margin-bottom: 8px;
    padding-left: 24px;
  }

  .markdown-content ul {
    list-style-type: disc;
  }

  .markdown-content ol {
    list-style-type: decimal;
  }

  .markdown-content li {
    margin-top: 4px;
    margin-bottom: 4px;
    line-height: 1.8;
  }

  .markdown-content ul ul,
  .markdown-content ol ol,
  .markdown-content ul ol,
  .markdown-content ol ul {
    margin-top: 4px;
    margin-bottom: 4px;
  }

  /* Markdown 代码块样式 */
  /* 行内代码和代码块使用不同的背景色和边框，突出代码内容 */
  .markdown-content code {
    background-color: var(--megaview-color-primary-bg, var(--megaview-conversation-primary-bg, #eaeffb));
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 13px;
    font-family: 'Courier New', Courier, monospace;
    color: var(--megaview-color-primary, var(--megaview-conversation-primary, #4461ec));
  }

  .markdown-content pre {
    background-color: var(--megaview-color-primary-bg, var(--megaview-conversation-primary-bg, #eaeffb));
    padding: 12px 16px;
    border-radius: 4px;
    /* 这里原本使用左侧竖条（border-left）来强调代码块区域
     * 但是在实际 UI 中，这个竖条效果与上方的问题标题（question-header）太相似
     * 容易让用户误以为代码块也是一个“问题标题”区域
     * 因此这里移除 border-left，只保留背景色和圆角，让代码块在视觉上更独立、更柔和
     */
    overflow-x: auto;
    margin-top: 8px;
    margin-bottom: 8px;
    line-height: 1.6;
  }

  .markdown-content pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    color: inherit;
    font-size: 13px;
  }

  /* Markdown 链接样式 */
  /* 链接使用主题色，并添加下划线和悬停效果 */
  .markdown-content a {
    color: var(--megaview-color-primary, var(--megaview-conversation-primary, #4461ec));
    text-decoration: none;
    border-bottom: 1px solid var(--megaview-color-primary, var(--megaview-conversation-primary, #4461ec));
    transition: opacity 0.2s;
  }

  .markdown-content a:hover {
    opacity: 0.8;
  }

  /* Markdown 引用块样式 */
  /* 引用块使用左边框和背景色突出显示 */
  .markdown-content blockquote {
    margin: 8px 0;
    padding: 8px 16px;
    background-color: var(--megaview-color-primary-bg, var(--megaview-conversation-primary-bg, #eaeffb));
    border-radius: 4px;
    color: var(--megaview-color-text-secondary, var(--megaview-conversation-text-secondary, #666666));
    /* 同样地，这里原本有一条左侧竖条（border-left）用于强调引用内容
     * 但从整体视觉效果来看，引用块与 question-header 的左侧竖条过于相似
     * 容易造成“引用 = 问题标题”的错觉
     * 所以我们保留浅色背景来区分内容类型，同时去掉竖条以减少干扰
     */
  }

  .markdown-content blockquote p {
    margin: 0;
  }

  /* Markdown 分隔线样式 */
  .markdown-content hr {
    border: none;
    border-top: 1px solid var(--megaview-color-border, #e0e0e0);
    margin: 16px 0;
  }

  /* Markdown 表格样式 */
  /* 表格使用边框和斑马纹背景，提高可读性 */
  .markdown-content table {
    border-collapse: collapse;
    width: 100%;
    margin: 8px 0;
    font-size: 14px;
  }

  .markdown-content table th,
  .markdown-content table td {
    border: 1px solid var(--megaview-color-border, #e0e0e0);
    padding: 8px 12px;
    text-align: left;
  }

  .markdown-content table th {
    background-color: var(--megaview-color-primary-bg, var(--megaview-conversation-primary-bg, #eaeffb));
    font-weight: 600;
    color: var(--megaview-color-primary, var(--megaview-conversation-primary, #4461ec));
  }

  .markdown-content table tr:nth-child(even) {
    background-color: var(--megaview-color-hover, var(--megaview-conversation-hover, #f5f5f5));
  }

  /* Markdown 强调文本样式 */
  /* 粗体和斜体使用适当的字体样式 */
  .markdown-content strong {
    font-weight: 600;
    color: inherit;
  }

  .markdown-content em {
    font-style: italic;
    color: inherit;
  }

  .markdown-content u {
    text-decoration: underline;
  }

  .markdown-content s {
    text-decoration: line-through;
    color: var(--megaview-color-text-secondary, var(--megaview-conversation-text-secondary, #666666));
  }

  /* Markdown 图片样式 */
  .markdown-content img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 8px 0;
  }
`;


