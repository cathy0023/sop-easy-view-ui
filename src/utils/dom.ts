/**
 * DOM 相关的轻量工具方法
 *
 * 设计思想：
 * - 统一封装尺寸同步与事件派发逻辑，避免在组件内重复写样板代码
 * - 所有函数都采用最小 API 面，方便第一次接触 Web Components 的同学理解
 */

/**
 * 同步宿主元素上用于控制宽高的 CSS 自定义属性
 *
 * @param host - 当前的自定义元素实例
 * @param width - 目标宽度字符串，例如 '100%'、'320px'
 * @param height - 目标高度字符串，例如 'auto'、'600px'
 */
export const syncHostSizeVariables = (host: HTMLElement, width: string, height: string): void => {
  host.style.setProperty('--megaview-conversation-width', width);
  host.style.setProperty('--megaview-conversation-height', height);
};

/**
 * 安全派发自定义事件，保持 bubbles/composed 默认开启
 *
 * @param target - 事件派发的宿主元素
 * @param eventName - 事件名称
 * @param detail - 需要透出的事件数据
 */
export const emitComponentEvent = <TDetail>(
  target: HTMLElement,
  eventName: string,
  detail: TDetail
): void => {
  target.dispatchEvent(new CustomEvent<TDetail>(eventName, {
    detail,
    bubbles: true,
    composed: true
  }));
};






