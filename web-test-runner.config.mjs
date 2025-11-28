import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';

/**
 * Web Test Runner 配置
 *
 * 设计理念：
 * - 使用真实浏览器（Chromium）执行测试，确保结果与生产环境一致
 * - 仅扫描 `src` 目录下的 `*.test.ts` 文件，避免 Storybook 示例被误判为测试
 * - 默认开启覆盖率统计，帮助新手了解测试覆盖情况
 * - 借助 esbuild 插件在运行时编译 TypeScript，减少繁琐的预构建流程
 */
export default {
  files: [
    'src/**/*.test.ts'
  ],
  nodeResolve: true,
  watch: false,
  browserLogs: true,
  concurrentBrowsers: 1,
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        headless: true
      }
    })
  ],
  coverageConfig: {
    reportDir: 'coverage',
    report: true,
    include: [
      'src/**/*.ts'
    ],
    exclude: [
      'src/**/*.stories.*',
      'src/stories/**'
    ]
  },
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'es2022',
      tsconfig: 'tsconfig.json'
    })
  ]
};

