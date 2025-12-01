/**
 * Markdown 检测和渲染工具函数
 *
 * 设计理念：
 * - 提供自动检测文本是否为 Markdown 格式的能力
 * - 提供安全的 Markdown 渲染功能，防止 XSS 攻击
 * - 使用成熟的库（marked + DOMPurify）确保稳定性和安全性
 *
 * 使用场景：
 * - 在组件中自动检测文本格式，选择合适的渲染方式
 * - 将 Markdown 文本安全地渲染为 HTML
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Markdown 语法特征的正则表达式模式
 *
 * 这些模式用于检测文本中是否包含 Markdown 语法特征
 * 检测时至少需要匹配 2 个不同的特征才判定为 Markdown
 */
const MARKDOWN_PATTERNS = {
  // 标题：行首 1-6 个 # 后跟空格或文本
  heading: /^#{1,6}\s+/m,
  
  // 粗体：**text** 或 __text__
  bold: /\*\*[^*]+\*\*|__[^_]+__/,
  
  // 斜体：*text* 或 _text_（排除粗体的情况）
  italic: /(?<!\*)\*[^*]+\*(?!\*)|(?<!_)_[^_]+_(?!_)/,
  
  // 无序列表：行首 -、* 或 + 后跟空格
  unorderedList: /^[\s]*[-*+]\s+/m,
  
  // 有序列表：行首数字 + . 后跟空格
  orderedList: /^[\s]*\d+\.\s+/m,
  
  // 代码块：```code``` 或 ```language code```
  codeBlock: /```[\s\S]*?```/,
  
  // 行内代码：`code`
  inlineCode: /`[^`\n]+`/,
  
  // 链接：[text](url) 格式
  link: /\[([^\]]+)\]\(([^)]+)\)/,
  
  // URL 链接：<url> 格式
  urlLink: /<https?:\/\/[^\s>]+>/,
  
  // 引用：行首 > 后跟空格
  blockquote: /^>\s+/m,
  
  // 分隔线：---、*** 或 ___（至少三个）
  horizontalRule: /^[-*_]{3,}$/m,
};

/**
 * 检测文本是否包含 Markdown 语法特征
 *
 * 通过检测常见的 Markdown 语法模式来判断文本是否为 Markdown 格式
 * 为了避免误判（比如普通文本中可能包含单个 # 或 *），需要至少匹配 2 个
 * 不同的 Markdown 特征才判定为 Markdown
 *
 * 检测规则：
 * - 标题语法：行首的 # 符号
 * - 粗体/斜体：**text**、*text* 等
 * - 列表语法：-、*、+ 或数字列表
 * - 代码块：```code```
 * - 行内代码：`code`
 * - 链接：[text](url) 或 <url>
 * - 引用：> 开头的行
 * - 分隔线：---、*** 等
 *
 * @param text - 待检测的文本内容
 * @returns 如果文本包含足够的 Markdown 特征则返回 true，否则返回 false
 *
 * @example
 *   isMarkdown('# 标题\n**粗体**') // true
 *   isMarkdown('普通文本内容') // false
 *   isMarkdown('只有单个 # 符号') // false（特征不足）
 */
export function isMarkdown(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  // 统计匹配到的不同 Markdown 特征数量
  const matchedFeatures = new Set<string>();

  // 检测标题语法
  if (MARKDOWN_PATTERNS.heading.test(text)) {
    matchedFeatures.add('heading');
  }

  // 检测粗体
  if (MARKDOWN_PATTERNS.bold.test(text)) {
    matchedFeatures.add('bold');
  }

  // 检测斜体（需要排除粗体的情况）
  if (MARKDOWN_PATTERNS.italic.test(text)) {
    matchedFeatures.add('italic');
  }

  // 检测无序列表
  if (MARKDOWN_PATTERNS.unorderedList.test(text)) {
    matchedFeatures.add('unorderedList');
  }

  // 检测有序列表
  if (MARKDOWN_PATTERNS.orderedList.test(text)) {
    matchedFeatures.add('orderedList');
  }

  // 检测代码块
  if (MARKDOWN_PATTERNS.codeBlock.test(text)) {
    matchedFeatures.add('codeBlock');
  }

  // 检测行内代码
  if (MARKDOWN_PATTERNS.inlineCode.test(text)) {
    matchedFeatures.add('inlineCode');
  }

  // 检测链接
  if (MARKDOWN_PATTERNS.link.test(text) || MARKDOWN_PATTERNS.urlLink.test(text)) {
    matchedFeatures.add('link');
  }

  // 检测引用
  if (MARKDOWN_PATTERNS.blockquote.test(text)) {
    matchedFeatures.add('blockquote');
  }

  // 检测分隔线
  if (MARKDOWN_PATTERNS.horizontalRule.test(text)) {
    matchedFeatures.add('horizontalRule');
  }

  // 至少需要匹配 2 个不同的特征才判定为 Markdown
  // 这样可以避免误判普通文本（比如普通文本中可能包含单个 # 或 *）
  return matchedFeatures.size >= 2;
}

/**
 * 配置 marked 的选项
 *
 * - breaks: true - 将单个换行符转换为 <br>，保留原始文本的换行格式
 * - gfm: true - 启用 GitHub Flavored Markdown，支持表格、删除线等扩展语法
 */
const markedOptions: marked.MarkedOptions = {
  breaks: true,
  gfm: true,
};

/**
 * 将 Markdown 文本渲染为安全的 HTML
 *
 * 使用 marked 库解析 Markdown 语法，然后通过 DOMPurify 进行 XSS 防护
 * 确保渲染的 HTML 是安全的，不会执行恶意脚本
 *
 * 安全性说明：
 * - marked 负责将 Markdown 语法转换为 HTML
 * - DOMPurify 负责清理危险的 HTML 标签和属性（如 <script>、onclick 等）
 * - 保留安全的样式标签（如 <strong>、<em>、<code> 等）
 *
 * @param markdown - Markdown 格式的文本
 * @returns 渲染后的 HTML 字符串（已进行 XSS 防护）
 *
 * @example
 *   renderMarkdown('# 标题\n**粗体**') // '<h1>标题</h1>\n<p><strong>粗体</strong></p>'
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  try {
    // 使用 marked 将 Markdown 转换为 HTML
    // marked.parse() 是同步方法，适合在浏览器环境中使用
    // 需要将返回值转换为字符串类型
    const parsedResult = marked.parse(markdown, markedOptions);
    const html = typeof parsedResult === 'string' ? parsedResult : String(parsedResult);

    // 使用 DOMPurify 清理 HTML，防止 XSS 攻击
    // DOMPurify.sanitize() 会移除危险的标签和属性，保留安全的 HTML 结构
    // 这样可以确保即使 Markdown 中包含恶意脚本，也不会被执行
    const sanitizedHtml = DOMPurify.sanitize(html, {
      // 允许所有安全的 HTML 标签和属性
      // DOMPurify 默认会保留大部分安全的 HTML，移除脚本和事件处理器
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'blockquote',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'hr',
        'div', 'span',
      ],
      ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'class'],
    });

    return sanitizedHtml;
  } catch (error) {
    // 如果解析失败（比如格式错误），返回空字符串或原始文本
    // 在生产环境中可以记录错误日志
    console.error('Markdown 解析失败:', error);
    return '';
  }
}
