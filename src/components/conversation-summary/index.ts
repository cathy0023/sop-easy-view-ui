import { LitElement, html, nothing, type PropertyValueMap, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { conversationSummaryStyles } from './conversation-summary.styles';
import { emitComponentEvent, syncHostSizeVariables } from '../../utils/dom';
import { escapeHtml, formatTimeFromSeconds, splitMultilineText } from '../../utils/format';
import type {
  ConversationAnswer,
  ConversationQuestionBlock,
  ConversationSummaryData,
  SectionToggleDetail
} from './types';
import { CONVERSATION_EVENTS } from './types';

/** 默认宽度与高度常量，便于在多个方法中复用 */
const DEFAULT_DIMENSIONS = {
  width: '100%',
  height: 'auto'
} as const;

/**
 * 解析 data 属性的工具函数
 *
 * @param value - 来自 HTML 属性的原始字符串
 * @returns 结构化的会话数据对象，如果解析失败则返回 null
 */
const parseDataAttribute = (value: string | null): ConversationSummaryData | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as ConversationSummaryData;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    // 这里仍然保持 console.error，便于排查错误数据
    console.error('Invalid data JSON:', error);
    return null;
  }
};

@customElement('megaview-conversation-summary')
/**
 * 会话纪要组件（Lit 版本）
 *
 * 设计理念：
 * - 使用 Lit 的响应式属性与模板系统，减少手动 DOM 操作
 * - Shadow DOM + CSS 变量保证样式隔离，同时允许宿主自定义尺寸
 * - 保持与旧版本完全一致的对外 API（属性、方法、自定义事件）
 *
 * 使用场景：
 * - 在任何框架或原生 HTML 中通过 `<megaview-conversation-summary>` 渲染会话总结
 * - 可在 React/Vue 中引用组件类以便访问 `updateData` 等方法
 *
 * Shadow DOM 说明：
 * - 默认开启 Shadow DOM（Lit 内置），确保不同系统之间样式互不影响
 * - 可通过 CSS 变量调整主题色，但不会污染全局命名空间
 *
 * 自定义事件说明：
 * - `section-expand`：某个问题展开时触发，detail = `{ questionIndex }`
 * - `section-collapse`：某个问题折叠时触发，detail 结构相同
 */
export default class MegaviewConversationSummary extends LitElement {
  /**
   * 会话数据属性
   *
   * - 通过 attribute converter 自动解析 JSON 字符串
   * - 同时支持直接赋值为对象（`element.data = {...}`）
   */
  @property({
    attribute: 'data',
    converter: {
      fromAttribute: value => parseDataAttribute(value),
      toAttribute: () => null // 避免对象被序列化回字符串
    }
  })
  public data: ConversationSummaryData | null = null;

  /**
   * 组件宽度（默认 100%），会同步到 CSS 变量 `--megaview-conversation-width`
   */
  @property({ type: String, reflect: true })
  public width: string = DEFAULT_DIMENSIONS.width;

  /**
   * 组件高度（默认 auto），会同步到 CSS 变量 `--megaview-conversation-height`
   */
  @property({ type: String, reflect: true })
  public height: string = DEFAULT_DIMENSIONS.height;

  /**
   * 内部展开状态集合（非响应式字段）
   *
   * - 通过 requestUpdate 手动触发渲染，避免在生命周期内重复调度更新
   * - 使用 Set 存储索引，保证增删效率
   */
  private expandedQuestions: Set<number> = new Set();

  /** 复用样式模块，保持结构清晰 */
  static override styles = conversationSummaryStyles;

  /**
   * 构造函数
   *
   * - 主要调用父类构造，保持 Lit 的内部初始化逻辑
   * - 这里补充说明 Shadow DOM 由 Lit 自动创建
   */
  constructor() {
    super();
    // 新手提示：Lit 会自动在构造函数中创建 Shadow DOM，无需手动调用 attachShadow
  }

  /**
   * 生命周期：组件插入 DOM 时触发
   *
   * - 这里主要同步尺寸相关的 CSS 变量，保证首次渲染正确
   */
  override connectedCallback(): void {
    super.connectedCallback();
    this.syncHostDimensions();
  }

  /**
   * 生命周期：组件移除 DOM 时触发
   *
   * - 当前没有额外的资源需要释放，保留空实现以方便未来扩展
   */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  /**
   * 生命周期：响应属性或状态变更
   *
   * @param changedProps - 被 Lit 追踪的变更集合
   */
  protected override updated(changedProps: PropertyValueMap<this>): void {
    if (changedProps.has('width') || changedProps.has('height')) {
      this.syncHostDimensions();
    }

    if (changedProps.has('data')) {
      // 当数据变化时重置展开状态，避免展开索引与新数据不匹配
      this.expandedQuestions.clear();
    }
  }

  /**
   * 公共方法：用于以编程方式更新组件数据
   *
   * @param payload - 可以是 JSON 字符串或结构化对象
   * @example
   *   element.updateData({ summary_result: [] });
   */
  public updateData(payload: ConversationSummaryData | string): void {
    if (typeof payload === 'string') {
      this.data = parseDataAttribute(payload);
      return;
    }
    this.data = payload ?? null;
  }

  /**
   * 渲染入口
   *
   * - 如果没有 summary_result，则渲染空状态
   * - 否则生成问题列表
   */
  override render(): TemplateResult {
    const questions = this.summaryItems;
    if (questions.length === 0) {
      return this.renderEmptyState();
    }

    return html`
      <div class="container">
        <div class="card">
          ${repeat(
            questions,
            (item, index) => item.instruction_id ?? `${index}`,
            (item, index) => this.renderQuestionItem(item, index)
          )}
        </div>
      </div>
    `;
  }

  /**
   * 计算当前有效的 summary_result 列表
   */
  private get summaryItems(): ConversationQuestionBlock[] {
    return Array.isArray(this.data?.summary_result) ? this.data?.summary_result ?? [] : [];
  }

  /**
   * 将宿主属性同步为 CSS 变量
   */
  private syncHostDimensions(): void {
    const width = this.width || DEFAULT_DIMENSIONS.width;
    const height = this.height || DEFAULT_DIMENSIONS.height;
    syncHostSizeVariables(this, width, height);
  }

  /**
   * 渲染空状态视图
   */
  private renderEmptyState(): TemplateResult {
    return html`
      <div class="container">
        <div class="card">
          <div class="empty">暂无数据</div>
        </div>
      </div>
    `;
  }

  /**
   * 渲染单个问题块
   *
   * @param item - 问题数据
   * @param index - 对应的索引
   */
  private renderQuestionItem(item: ConversationQuestionBlock, index: number): TemplateResult {
    const answers = item.answers ?? [];
    const hasExpandableDetails = answers.some(answer => this.answerHasDetails(answer));
    const isExpanded = this.expandedQuestions.has(index);

    const headerClasses = classMap({
      'question-header': true,
      'has-details': hasExpandableDetails,
      'no-details': !hasExpandableDetails
    });

    const toggleHandlers = {
      click: () => this.handleHeaderToggle(index, hasExpandableDetails),
      keydown: (event: KeyboardEvent) => this.handleHeaderKeydown(event, index, hasExpandableDetails)
    };

    return html`
      <div class="question-item">
        <div
          class=${headerClasses}
          role=${hasExpandableDetails ? 'button' : 'heading'}
          tabindex=${hasExpandableDetails ? 0 : -1}
          aria-expanded=${hasExpandableDetails ? String(isExpanded) : nothing}
          @click=${toggleHandlers.click}
          @keydown=${toggleHandlers.keydown}
        >
          <span class="question-name">${escapeHtml(item.question_name ?? '')}</span>
          ${hasExpandableDetails
            ? html`
                <span class=${classMap({
                  'collapse-icon': true,
                  collapsed: !isExpanded
                })}> > </span>
              `
            : nothing}
        </div>
        ${hasExpandableDetails
          ? this.renderQuestionDetails(answers, isExpanded)
          : this.renderSimpleContent(answers)}
      </div>
    `;
  }

  /**
   * 渲染没有详情的简易答案区块
   */
  private renderSimpleContent(answers: ConversationAnswer[]): TemplateResult {
    return html`
      <div class="question-content">
        ${answers.map(answer => html`
          <div class="answer-content">${this.renderMultilineText(answer.content)}</div>
        `)}
      </div>
    `;
  }

  /**
   * 渲染包含上下文/推理的详情面板
   *
   * @param answers - 当前问题的答案列表
   * @param isExpanded - 面板是否展开
   */
  private renderQuestionDetails(answers: ConversationAnswer[], isExpanded: boolean): TemplateResult {
    if (!isExpanded) {
      return html`<div class="question-content collapsed"></div>`;
    }

    return html`
      <div class="question-content">
        ${answers.map(answer => html`
          ${this.renderAnswerContent(answer)}
        `)}
      </div>
    `;
  }

  /**
   * 渲染单个答案内部的内容：正文、上下文、推理
   */
  private renderAnswerContent(answer: ConversationAnswer): TemplateResult {
    const contextList = answer.context ?? [];
    return html`
      ${answer.content
        ? html`<div class="answer-content">${this.renderMultilineText(answer.content)}</div>`
        : nothing}
      ${contextList.length > 0
        ? html`
            <div class="context-section">
              <div class="context-title">上下文</div>
              ${repeat(
                contextList,
                (_, idx) => `${idx}`,
                ctx => html`
                  <div class="context-item">
                    ${(ctx.begin_time || ctx.speaker_name)
                      ? html`
                          <div class="context-meta">
                            ${ctx.begin_time ? html`<span>${formatTimeFromSeconds(ctx.begin_time)}</span>` : nothing}
                            ${ctx.speaker_name || ctx.speaker_type
                              ? html`<span class="speaker-type">${escapeHtml(ctx.speaker_name ?? ctx.speaker_type ?? '')}</span>`
                              : nothing}
                          </div>
                        `
                      : nothing}
                    <div class="context-text">${this.renderMultilineText(ctx.content)}</div>
                  </div>
                `
              )}
            </div>
          `
        : nothing}
      ${answer.reasoning_process
        ? html`
            <div class="reasoning-section">
              <div class="reasoning-title">推理</div>
              <div class="reasoning-content">${this.renderMultilineText(answer.reasoning_process)}</div>
            </div>
          `
        : nothing}
    `;
  }

  /**
   * 将多行文本拆分并插入 <br />，同时保证 HTML 转义
   */
  private renderMultilineText(value?: string): TemplateResult | typeof nothing {
    if (!value) return nothing;
    const segments = splitMultilineText(value);
    return html`${segments.map((segment, index) => html`${index > 0 ? html`<br />` : nothing}${segment}`)}`;
  }

  /**
   * 判断答案是否包含上下文或推理内容
   */
  private answerHasDetails(answer: ConversationAnswer): boolean {
    return Boolean(
      (answer.context && answer.context.length > 0) ||
      (answer.reasoning_process && answer.reasoning_process.trim().length > 0)
    );
  }

  /**
   * 处理交互：点击或键盘触发展开/折叠
   */
  private handleHeaderToggle(index: number, expandable: boolean): void {
    if (!expandable) return;
    const nextSet = new Set(this.expandedQuestions);
    const isCurrentlyExpanded = nextSet.has(index);
    const eventName = isCurrentlyExpanded ? CONVERSATION_EVENTS.collapse : CONVERSATION_EVENTS.expand;

    if (isCurrentlyExpanded) {
      nextSet.delete(index);
    } else {
      nextSet.add(index);
    }

    this.expandedQuestions = nextSet;
    this.requestUpdate();
    this.dispatchToggleEvent(eventName, index);
  }

  /**
   * 键盘辅助：监听 Enter/Space 保证可访问性
   */
  private handleHeaderKeydown(event: KeyboardEvent, index: number, expandable: boolean): void {
    if (!expandable) return;
    const keys = ['Enter', ' '];
    if (keys.includes(event.key)) {
      event.preventDefault();
      this.handleHeaderToggle(index, expandable);
    }
  }

  /**
   * 自定义事件派发的统一封装
   */
  private dispatchToggleEvent(eventName: string, index: number): void {
    emitComponentEvent<SectionToggleDetail>(this, eventName, { questionIndex: index });
  }
}

