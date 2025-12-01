/**
 * 格式化与文本处理工具方法
 *
 * 设计理念：
 * - 保持与业务无关的纯函数，方便在多个组件间复用
 * - 所有函数都具备清晰的输入输出描述，便于初学者理解
 */

/**
 * 安全转义 HTML 字符，避免 XSS
 *
 * @param raw - 任意用户输入或后端返回的字符串
 * @returns 已转义的字符串
 */
export const escapeHtml = (raw?: string): string => {
  if (raw === undefined || raw === null) return '';
  return String(raw)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * 将 Unix 时间戳（秒）格式化为 HH:mm
 *
 * @param timestamp - 以秒为单位的时间戳
 */
export const formatTimeFromSeconds = (timestamp?: number): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * 将多行文本拆分为字符串数组，并确保每一行都已做 HTML 转义
 *
 * @param value - 包含换行符的原始文本
 */
export const splitMultilineText = (value?: string): string[] => {
  if (!value) return [];
  const safeText = escapeHtml(value);
  return safeText.split('\n');
};





