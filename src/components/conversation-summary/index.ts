import {
  LitElement,
  html,
  nothing,
  type PropertyValueMap,
  type TemplateResult,
} from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { conversationSummaryStyles } from "./conversation-summary.styles";
import { syncHostSizeVariables } from "../../utils/dom";
import {
  escapeHtml,
  formatTimeFromSeconds,
  splitMultilineText,
} from "../../utils/format";
import { isMarkdown, renderMarkdown } from "../../utils/markdown";
import type {
  ConversationAnswer,
  ConversationQuestionBlock,
  ConversationSummaryData,
} from "./types";

/** 默认宽度与高度常量，便于在多个方法中复用 */
const DEFAULT_DIMENSIONS = {
  width: "100%",
  height: "auto",
} as const;

/**
 * 解析 data 属性的工具函数
 *
 * @param value - 来自 HTML 属性的原始字符串
 * @returns 结构化的会话数据对象，如果解析失败则返回 null
 */
const parseDataAttribute = (
  value: string | null
): ConversationSummaryData | null => {
  console.log('parseDataAttribute called with:', {
    value,
    valueLength: value?.length,
    isNull: value === null,
    isUndefined: value === undefined
  });

  if (!value) {
    console.log('parseDataAttribute: value is null/empty, returning null');
    return null;
  }

  try {
    const parsed = JSON.parse(value) as ConversationSummaryData;
    const result = parsed && typeof parsed === "object" ? parsed : null;
    console.log('parseDataAttribute result:', {
      parsed,
      hasSummaryResult: Array.isArray(parsed?.summary_result),
      summaryResultLength: parsed?.summary_result?.length,
      result
    });
    return result;
  } catch (error) {
    // 这里仍然保持 console.error，便于排查错误数据
    console.error("Invalid data JSON:", error);
    return null;
  }
};

@customElement("megaview-conversation-summary")
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
 * - 可在 React/Vue 中引用组件类以便访问 `setData` 等方法
 *
 * Shadow DOM 说明：
 * - 默认开启 Shadow DOM（Lit 内置），确保不同系统之间样式互不影响
 * - 可通过 CSS 变量调整主题色，但不会污染全局命名空间
 */
export default class MegaviewConversationSummary extends LitElement {
  /**
   * 会话数据属性
   *
   * - 支持 HTML 属性传入简单数据（不推荐用于复杂数据）
   * - 推荐通过 JavaScript API 设置复杂数据：`element.setData({...})`
   * - 复杂数据不会显示在 HTML 属性中，保持界面整洁
   */
  /**
   * 内部数据存储（私有属性，不直接暴露给用户）
   * 用户应通过 setData() 方法来设置数据
   */
  private _data: ConversationSummaryData | null = null;

  /**
   * 标记是否刚刚通过 setData 更新了数据，用于在渲染完成后滚动到顶部
   */
  private _dataJustUpdated: boolean = false;

  /**
   * 组件宽度（默认 100%），会同步到 CSS 变量 `--megaview-conversation-width`
   */
  @property({ type: String, reflect: true })
  public width: string = DEFAULT_DIMENSIONS.width;

  /**
   * 详情默认展开状态配置（上下文 + 推理）
   *
   * 设计目的：
   * - 早期版本中：有「上下文 / 推理」详情的问题行，整体内容区域默认是折叠的
   * - 现在的需求：`answer-content`（总结正文）无论是否有详情，都应该默认直接展示
   * - 同时希望可以通过一个全局属性控制「上下文 + 推理」是默认展开还是默认折叠
   *
   * 属性说明：
   * - 对外暴露为字符串属性 `details-default-state`
   * - 可选值：
   *   - `"expanded"`：上下文 + 推理默认展开（推荐默认值）
   *   - `"collapsed"`：上下文 + 推理默认折叠
   * - 如果传入其他值，将回退到 `"expanded"`
   *
   * 使用示例（HTML）：
   * ```html
   * <!-- 默认行为：上下文 + 推理默认展开 -->
   * <megaview-conversation-summary></megaview-conversation-summary>
   *
   * <!-- 显式指定默认展开 -->
   * <megaview-conversation-summary details-default-state="expanded"></megaview-conversation-summary>
   *
   * <!-- 指定默认折叠 -->
   * <megaview-conversation-summary details-default-state="collapsed"></megaview-conversation-summary>
   * ```
   */
  @property({ type: String, reflect: true, attribute: "details-default-state" })
  public detailsDefaultState: "expanded" | "collapsed" = "expanded";

  /**
   * 组件高度（默认 auto），会同步到 CSS 变量 `--megaview-conversation-height`
   */
  @property({ type: String, reflect: true })
  public height: string = DEFAULT_DIMENSIONS.height;

  /**
   * 内部展开状态集合（非响应式字段）
   *
   * - 用于记录哪些问题行的「详情区域（上下文 + 推理）」当前处于展开状态
   * - 不再控制 `answer-content` 的显隐，正文内容现在始终展示
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
    console.log('Component updated, changedProps:', Array.from(changedProps.keys()));

    if (changedProps.has("width") || changedProps.has("height")) {
      this.syncHostDimensions();
    }

    // 如果数据刚刚通过 setData 更新，滚动到顶部
    if (this._dataJustUpdated) {
      this._dataJustUpdated = false; // 重置标记
      this.scrollToTop();
    }
  }

  /**
   * 公共方法：设置组件数据（主要API）
   *
   * 这是设置会话数据的标准方法，提供数据验证和错误处理。
   * 不直接暴露 data 属性，确保所有数据设置都经过验证。
   *
   * @param data - 会话数据对象
   * @throws {Error} 当数据格式无效时抛出错误
   * @example
   *   // 设置数据
   *   element.setData({
   *     conversation_id: 123,
   *     summary_result: [...]
   *   });
   *
   *   // 清空数据
   *   element.setData(null);
   */
  public setData(data: ConversationSummaryData | null): void {
    try {
      if (data === null) {
        this._data = null;
        this._dataJustUpdated = true; // 标记数据刚刚更新（清空）
        console.log('数据已清空');
        this.requestUpdate();
        return;
      }

      // 数据验证：确保是有效的对象
      if (typeof data !== 'object' || data === null) {
        throw new Error('数据必须是有效的对象或 null');
      }

      // 验证数据结构
      this.validateDataStructure(data);

      // 设置数据并触发重新渲染
      this._data = data;

      // 每次设置新数据时，根据全局配置初始化「详情默认展开/折叠」状态
      // 说明：
      // - 只在 setData 时重置 expandedQuestions，避免用户手动展开/折叠状态被意外覆盖
      // - 这样可以保证：新的一份数据总是按照配置的默认策略来展开或折叠详情
      this.initializeExpandedState();

      this._dataJustUpdated = true; // 标记数据刚刚更新
      this.requestUpdate();
      console.log('数据设置成功');

    } catch (error) {
      console.error('setData 失败:', error);
      // 在开发环境下抛出错误，生产环境下记录错误
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    }
  }

  /**
   * 验证数据结构的完整性
   *
   * 验证规则：
   * - 必须包含 summary_result 字段
   * - summary_result 必须是数组
   * - 数组中的每个元素必须有 question_name 字段
   *
   * @param data - 要验证的数据对象
   * @private
   */
  private validateDataStructure(data: any): void {
    // 基本类型检查
    if (!data || typeof data !== 'object') {
      throw new Error('数据必须是非空对象');
    }

    // 检查必需字段：summary_result
    if (!data.hasOwnProperty('summary_result')) {
      throw new Error('数据必须包含 summary_result 字段');
    }

    if (!Array.isArray(data.summary_result)) {
      throw new Error('summary_result 必须是数组');
    }

    // 检查数组中的每个问题对象
    if (data.summary_result.length > 0) {
      data.summary_result.forEach((item: any, index: number) => {
        if (!item || typeof item !== 'object') {
          throw new Error(`summary_result[${index}] 必须是对象`);
        }

        if (!item.question_name || typeof item.question_name !== 'string') {
          throw new Error(`summary_result[${index}] 必须包含有效的 question_name 字符串`);
        }

        // 检查 answers 字段（如果存在）
        if (item.hasOwnProperty('answers')) {
          if (!Array.isArray(item.answers)) {
            throw new Error(`summary_result[${index}].answers 必须是数组`);
          }
        }
      });
    }

    console.log('数据结构验证通过');
  }

  /**
   * 渲染入口
   *
   * - 如果没有 summary_result，则渲染空状态
   * - 否则生成问题列表
   */
  override render(): TemplateResult {
    const questions = this.summaryItems;
    console.log('Component render called:', {
      data: this._data,
      questionsLength: questions.length,
      summaryItems: questions
    });

    if (questions.length === 0) {
      console.log('Rendering empty state');
      return this.renderEmptyState();
    }

    return html`
      <div class="container" part="container">
        <div class="card" part="card">
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
    return Array.isArray(this._data?.summary_result)
      ? this._data?.summary_result ?? []
      : [];
  }

  /**
   * 根据组件配置和当前数据初始化问题的展开状态集合
   *
   * 设计说明：
   * - 这个方法只会在 setData 时被调用
   * - 目的：根据 `detailsDefaultState` 的配置决定「上下文 + 推理」初始是展开还是折叠
   * - 不会在普通属性更新时反复重置，避免打断用户已经进行的交互操作
   */
  private initializeExpandedState(): void {
    const questions = this.summaryItems;

    // 规范化配置值，任何非 "collapsed" 的值都视为 "expanded"
    const shouldExpandByDefault = this.detailsDefaultState !== "collapsed";

    const nextSet = new Set<number>();
    if (shouldExpandByDefault) {
      questions.forEach((_, index) => {
        nextSet.add(index);
      });
    }

    this.expandedQuestions = nextSet;
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
   * 滚动到容器顶部
   *
   * 在 setData 更新数据后调用，确保用户看到最新的内容从顶部开始
   * 使用组件宿主元素作为滚动容器
   */
  private scrollToTop(): void {
    // 使用组件宿主元素作为滚动容器
    this.scrollTo({
      top: 0,
      behavior: 'smooth' // 使用平滑滚动提供更好的用户体验
    });
  }

  /**
   * 渲染空状态视图
   */
  private renderEmptyState(): TemplateResult {
    return html`
      <div class="container" part="container">
        <div class="card" part="card">
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
  private renderQuestionItem(
    item: ConversationQuestionBlock,
    index: number
  ): TemplateResult {
    const answers = item.answers ?? [];
    const hasExpandableDetails = answers.some((answer) =>
      this.answerHasDetails(answer)
    );
    const isExpanded = this.expandedQuestions.has(index);

    const headerClasses = classMap({
      "question-header": true,
      "has-details": hasExpandableDetails,
      "no-details": !hasExpandableDetails,
    });

    const toggleHandlers = {
      click: () => this.handleHeaderToggle(index, hasExpandableDetails),
      keydown: (event: KeyboardEvent) =>
        this.handleHeaderKeydown(event, index, hasExpandableDetails),
    };

    return html`
      <div class="question-item">
        <div
          class=${headerClasses}
          role=${hasExpandableDetails ? "button" : "heading"}
          tabindex=${hasExpandableDetails ? 0 : -1}
          aria-expanded=${hasExpandableDetails ? String(isExpanded) : nothing}
          @click=${toggleHandlers.click}
          @keydown=${toggleHandlers.keydown}
        >
          <span class="question-name"
            >${escapeHtml(item.question_name ?? "")}</span
          >
          ${hasExpandableDetails
            ? html`
                <span
                  class=${classMap({
                    "collapse-icon": true,
                    collapsed: !isExpanded,
                  })}
                >
                  <svg
                    t="1764296133904"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="25320"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M758.624 630.624a32 32 0 0 1-45.248 0L512 429.248l-201.376 201.376a32 32 0 0 1-45.248-45.248l224-224a32 32 0 0 1 45.248 0l224 224a32 32 0 0 1 0 45.248z"
                      p-id="25321"
                    ></path>
                  </svg>
                </span>
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
        ${answers.map(
          (answer) => html`
            <div class="answer-content">
              ${this.renderMultilineText(answer.content)}
            </div>
          `
        )}
      </div>
    `;
  }

  /**
   * 渲染包含上下文/推理的详情面板
   *
   * @param answers - 当前问题的答案列表
   * @param isExpanded - 详情部分（上下文 + 推理）是否展开
   *
   * 重要说明：
   * - 旧逻辑：`isExpanded` 为 false 时，整个 `.question-content` 都被隐藏，
   *   这会导致 `answer-content`（总结正文）也一起被折叠
   * - 新需求：`answer-content` 必须始终展示；`isExpanded` 只控制上下文和推理
   *
   * 因此本方法会：
   * - 始终渲染一层 `.question-content` 容器
   * - 调用 `renderAnswerContent` 时，将 `isExpanded` 作为「是否展示详情」的标志传入
   */
  private renderQuestionDetails(
    answers: ConversationAnswer[],
    isExpanded: boolean
  ): TemplateResult {
    return html`
      <div class="question-content">
        ${answers.map((answer) => html` ${this.renderAnswerContent(answer, isExpanded)} `)}
      </div>
    `;
  }

  /**
   * 渲染单个答案内部的内容：正文、上下文、推理
   */
  private renderAnswerContent(
    answer: ConversationAnswer,
    detailsExpanded: boolean = true
  ): TemplateResult {
    const contextList = answer.context ?? [];
    return html`
      ${answer.content
        ? html`<div class="answer-content">
            ${this.renderMultilineText(answer.content)}
          </div>`
        : nothing}
      ${contextList.length > 0
        ? html`
            <div
              class=${classMap({
                "context-section": true,
                collapsed: !detailsExpanded,
              })}
            >
              <div class="context-title">上下文</div>
              ${repeat(
                contextList,
                (_, idx) => `${idx}`,
                (ctx) => html`
                  <div class="context-item">
                    ${ctx.begin_time || ctx.speaker_type
                      ? html`
                          <div class="context-meta">
                            ${ctx.begin_time
                              ? html`<span
                                  >${formatTimeFromSeconds(
                                    ctx.begin_time
                                  )}</span
                                >`
                              : nothing}
                            ${ctx.speaker_type || ctx.speaker_type
                              ? html`<span class="speaker-type"
                                  >${escapeHtml(
                                    ctx.speaker_type === 'customer' ? '客户' : '销售'
                                  )}</span
                                >`
                              : nothing}
                          </div>
                        `
                      : nothing}
                    <div class="context-text">
                      ${this.renderMultilineText(ctx.content)}
                    </div>
                  </div>
                `
              )}
            </div>
          `
        : nothing}
      ${answer.reasoning_process
        ? html`
            <div
              class=${classMap({
                "reasoning-section": true,
                collapsed: !detailsExpanded,
              })}
            >
              <div class="reasoning-title">推理</div>
              <div class="reasoning-content">
                ${this.renderMultilineText(answer.reasoning_process)}
              </div>
            </div>
          `
        : nothing}
    `;
  }

  /**
   * 渲染多行文本，支持 Markdown 和普通文本两种格式
   *
   * 自动检测文本格式：
   * - 如果检测到 Markdown 语法特征，使用 marked 库渲染为 HTML
   * - 否则按照普通多行文本处理，使用 <br> 标签换行并转义 HTML
   *
   * Markdown 检测说明：
   * - 通过检测常见的 Markdown 语法特征（标题、粗体、列表、代码块等）来判断
   * - 至少需要匹配 2 个不同的 Markdown 特征才判定为 Markdown，避免误判普通文本
   * - 检测结果会影响渲染方式，但不影响数据本身
   *
   * 安全性说明：
   * - Markdown 渲染后的 HTML 会经过 DOMPurify 清理，防止 XSS 攻击
   * - 普通文本会通过 escapeHtml 函数转义，确保安全性
   *
   * @param value - 待渲染的文本内容（可能是 Markdown 或普通文本）
   * @returns Lit 模板结果，包含渲染后的内容
   */
  private renderMultilineText(value?: string): TemplateResult | typeof nothing {
    if (!value) return nothing;

    // 检测文本是否为 Markdown 格式
    // isMarkdown 函数会检测常见的 Markdown 语法特征，如标题、粗体、列表等
    const isMarkdownFormat = isMarkdown(value);

    if (isMarkdownFormat) {
      // 如果检测到 Markdown 格式，使用 marked 库渲染
      // renderMarkdown 函数会将 Markdown 转换为 HTML，并经过 DOMPurify 清理以确保安全
      const htmlContent = renderMarkdown(value);

      // 使用 unsafeHTML 指令渲染 HTML
      // unsafeHTML 是 Lit 提供的指令，用于渲染 HTML 字符串
      // 注意：这里虽然叫 unsafeHTML，但 HTML 已经经过 DOMPurify 清理，是安全的
      return html`<div class="markdown-content">${unsafeHTML(htmlContent)}</div>`;
    } else {
      // 如果是普通文本，按照原有的多行文本逻辑处理
      // splitMultilineText 会将文本按换行符拆分，并对每段进行 HTML 转义
      const segments = splitMultilineText(value);
      return html`${segments.map(
        (segment, index) => html`${index > 0 ? html`<br />` : nothing}${segment}`
      )}`;
    }
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

    if (isCurrentlyExpanded) {
      nextSet.delete(index);
    } else {
      nextSet.add(index);
    }

    this.expandedQuestions = nextSet;
    this.requestUpdate();
  }

  /**
   * 键盘辅助：监听 Enter/Space 保证可访问性
   */
  private handleHeaderKeydown(
    event: KeyboardEvent,
    index: number,
    expandable: boolean
  ): void {
    if (!expandable) return;
    const keys = ["Enter", " "];
    if (keys.includes(event.key)) {
      event.preventDefault();
      this.handleHeaderToggle(index, expandable);
    }
  }

}
