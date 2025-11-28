import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/web-components-vite';
import * as projectAnnotations from './preview';

/**
 * 为 Web Test Runner 注入 Storybook 运行时配置
 *
 * 为什么需要这一段？
 * - Storybook 的测试模式会独立于实际运行环境执行，如果不显式传入 preview.ts 中的参数，
 *   可访问性、控件匹配等设置都会失效，导致测试结果与文档不一致
 * - setProjectAnnotations 可以一次性注入多个注解，这里我们将 a11y 插件与项目级别设置一起注入
 *
 * 注意：
 * - 该文件会在 Web Test Runner 的 setupFiles 中自动执行，无需手动导入
 * - 如果后续新增其他全局插件（如暗色主题、国际化），也需要在此处同步
 */
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);