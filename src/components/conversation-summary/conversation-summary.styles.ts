import { css } from 'lit';

/**
 * 会话纪要组件样式
 *
 * 设计说明：
 * - 使用 CSS 变量暴露颜色与尺寸，便于宿主在不同主题中复用
 * - 样式结构保持与旧版本一致，减少用户升级成本
 * - 所有 class 名称都带有清晰的语义，帮助新手对照 DOM 结构定位
 */
export const conversationSummaryStyles = css`
  :host {
    display: block;
    width: var(--megaview-conversation-width, 100%);
    height: var(--megaview-conversation-height, auto);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: var(--megaview-conversation-text, #333333);
  }

  :host([hidden]) {
    display: none;
  }

  .container {
    background: var(--megaview-conversation-bg, #f5f5f5);
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
  }

  .card {
    height: calc(100% - 48px);
    overflow-y: auto;
    background: var(--megaview-conversation-card-bg, #ffffff);
    border: 1px solid var(--megaview-conversation-border, #e0e0e0);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 16px;
  }

  .question-item {
    margin-bottom: 12px;
    background: var(--megaview-conversation-card-bg, #ffffff);
  }

  .question-item:last-child {
    margin-bottom: 0;
  }

  .question-header {
    display: flex;
    align-items: center;
    gap: 12px;
    user-select: none;
    padding: 12px 16px;
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

  .question-header.has-details:hover {
    background-color: var(--megaview-conversation-hover, #f9f9f9);
  }

  .question-header::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 16px;
    background-color: var(--megaview-conversation-primary, #4461ec);
    border-radius: 2px;
  }

  .question-name {
    font-size: 15px;
    font-weight: 500;
    color: inherit;
    flex: 1;
  }

  .collapse-icon {
    font-size: 14px;
    color: var(--megaview-conversation-text-secondary, #666666);
    transition: transform 0.2s;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(90deg);
  }

  .collapse-icon.collapsed {
    transform: rotate(180deg);
  }

  .question-content {
    padding: 16px;
    padding-left: 32px;
    color: inherit;
    line-height: 1.8;
    background: var(--megaview-conversation-bg, #f5f5f5);
    border-radius: 4px;
  }

  .question-content.collapsed {
    display: none;
  }

  .answer-content {
    color: inherit;
    font-size: 14px;
  }

  .context-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--megaview-conversation-border, #e0e0e0);
  }

  .context-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--megaview-conversation-text-secondary, #666666);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .context-item {
    background: var(--megaview-conversation-card-bg, #ffffff);
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 13px;
    line-height: 1.6;
    border-left: 3px solid var(--megaview-conversation-primary, #4461ec);
  }

  .context-item:last-child {
    margin-bottom: 0;
  }

  .context-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;
    font-size: 12px;
    color: var(--megaview-conversation-primary, #4461ec);
    font-weight: 500;
  }

  .speaker-type {
    color: var(--megaview-conversation-text-secondary, #666666);
    font-weight: 500;
  }

  .context-text {
    color: inherit;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.7;
  }

  .reasoning-section {
    padding-top: 16px;
  }

  .reasoning-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--megaview-conversation-text-secondary, #666666);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .reasoning-content {
    background: var(--megaview-conversation-primary-bg, #eaeffb);
    padding: 12px 16px;
    border-radius: 4px;
    border-left: 3px solid var(--megaview-conversation-primary, #4461ec);
    font-size: 13px;
    line-height: 1.7;
    color: inherit;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--megaview-conversation-text-secondary, #666666);
  }
`;


