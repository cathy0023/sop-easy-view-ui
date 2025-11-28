import type { Preview } from '@storybook/web-components-vite';

/**
 * Storybook 运行时设置
 *
 * 设计理念：
 * - 通过 controls.matchers 自动识别常见属性，便于在 UI 中实时调整
 * - 默认开启 a11y 检查，但只在面板中提示，避免打断新手的学习流程
 * - 使用 fullscreen layout，让组件在文档中占据最大空间，效果更接近真实场景
 */
const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'Megaview Light',
      values: [
        { name: 'Megaview Light', value: '#f5f5f5' },
        { name: 'Megaview Dark', value: '#1f1f1f' }
      ]
    },
    a11y: {
      // 此处设置为 'warn' 以便在 Storybook 面板中提示问题，同时避免打断 CI
      // 新手只需要修复出现的提示即可逐步掌握可访问性要点
      manual: false
    }
  }
};

export default preview;
