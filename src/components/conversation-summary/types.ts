/**
 * 会话纪要组件数据类型声明
 *
 * 设计理念：
 * - 所有字段都设置为可选，方便与后端结构对齐
 * - 通过接口拆分（上下文片段、答案、问题）实现更清晰的层次感
 * - 事件类型统一集中在此文件，避免硬编码字符串造成错误
 *
 * 使用场景：
 * - 组件内部用于约束属性、内部状态与渲染逻辑
 * - 外部使用者可以直接引用这些类型完成静态检查
 */

/**
 * 单条上下文片段，描述某个说话人在特定时间的发言内容
 *
 * @property begin_time - Unix 时间戳（秒），用于显示时间轴，可选
 * @property content - 对话文本内容，原始字符串
 * @property speaker_type - 说话人类型（例如 user/customer），用于标注角色
 * @property speaker_name - 说话人名称，优先使用后端提供的字段
 */
export interface ConversationContextSnippet {
  begin_time?: number;
  content?: string;
  speaker_type?: string;
  speaker_name?: string;
}

/**
 * 单个答案的结构，包含核心回答、上下文以及推理过程
 *
 * @property content - 答案主内容，通常是一段总结性文本
 * @property context - 与答案相关的上下文片段数组
 * @property reasoning_process - 模型的推理过程，帮助使用者理解答案依据
 */
export interface ConversationAnswer {
  content?: string;
  context?: ConversationContextSnippet[];
  reasoning_process?: string;
}

/**
 * 会话纪要中的单个问题项
 *
 * @property instruction_id - 模板或规则 ID，可用于追踪配置来源
 * @property name - 指令名称
 * @property question_name - 展示在界面上的问题标题
 * @property answer_desc - 问题的补充描述
 * @property create_at - 该条记录创建时间，字符串格式
 * @property answers - 该问题对应的所有答案集合
 */
export interface ConversationQuestionBlock {
  instruction_id?: number;
  name?: string;
  question_name?: string;
  answer_desc?: string;
  create_at?: string;
  answers?: ConversationAnswer[];
}

/**
 * 传递给组件的完整数据结构
 *
 * @property conversation_id - 会话唯一标识
 * @property summary_status - 后端处理状态，用于判断是否可展示
 * @property summary_result - 问题列表，是组件渲染的核心数据源
 */
export interface ConversationSummaryData {
  conversation_id?: number;
  summary_status?: number;
  summary_result?: ConversationQuestionBlock[];
}

/**
 * 组件暴露的自定义事件详细信息
 *
 * @property questionIndex - 被展开或折叠的问题索引
 */
export interface SectionToggleDetail {
  questionIndex: number;
}

/**
 * 自定义事件名称常量，避免魔法字符串
 */
export const CONVERSATION_EVENTS = {
  expand: 'section-expand',
  collapse: 'section-collapse'
} as const;

export type ConversationEventName = typeof CONVERSATION_EVENTS[keyof typeof CONVERSATION_EVENTS];


