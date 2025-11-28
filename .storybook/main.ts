import type { StorybookConfig } from '@storybook/web-components-vite';

/**
 * Storybook 全局配置
 *
 * 设计思路：
 * - 将 stories 文件限定在组件目录中，避免示例代码和正式组件脱节
 * - 默认启用 a11y、Docs、Vitest 等插件，帮助新手快速验证可访问性与交互
 * - 使用 Vite 构建器，保证与正式构建一致的打包环境
 */
const config: StorybookConfig = {
  stories: [
    '../src/components/**/*.stories.@(ts|tsx|mdx)'
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
};

export default config;