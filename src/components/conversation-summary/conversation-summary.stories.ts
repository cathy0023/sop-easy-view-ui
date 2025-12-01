import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index';
import type { ConversationSummaryData } from './types';

/**
 * Storybook 文档：Megaview Conversation Summary
 *
 * 设计说明：
 * - 提供基础示例、复杂数据示例以及空状态，帮助第一次接触组件的人理解行为
 * - 使用 setData 方法进行数据设置，提供更好的类型检查和错误处理
 * - 包含滚动处理机制的演示
 * - 所有示例都展示推荐的数据设置方式
 */

const baseData: ConversationSummaryData = {
  conversation_id: 1,
  summary_status: 2,
  summary_result: [
    {
      question_name: '会话总结',
      answers: [
        {
          content: '客户目前关注产品部署时间，后续需要提供试用方案。',
          context: [
            {
              begin_time: 1700000000,
              speaker_name: '销售',
              speaker_type: 'user',
              content: '您好，这里是 Megaview，我们可以提供 7 天试用。'
            },
            {
              begin_time: 1700000060,
              speaker_name: '客户',
              speaker_type: 'customer',
              content: '试用期可以延长到 14 天吗？'
            }
          ],
          reasoning_process: '根据客户提出的试用周期问题，判断其处于方案评估阶段。'
        }
      ]
    }
  ]
};

const multiQuestionData: ConversationSummaryData = {
  ...baseData,
  summary_result: [
    ...(baseData.summary_result ?? []),
    {
      question_name: '潜在风险',
      answers: [
        {
          content: '客户的技术团队仍在评估 API 接口，需准备技术答疑会议。',
          context: [
            {
              begin_time: 1700000120,
              speaker_name: '客户技术',
              speaker_type: 'customer',
              content: '我们还在测试你们的 API，遇到了一些集成问题。'
            },
            {
              begin_time: 1700000180,
              speaker_name: '销售',
              speaker_type: 'user',
              content: '我可以安排我们的技术专家与您进行一次详细的答疑会议。'
            }
          ],
          reasoning_process: '客户明确提到集成问题，表明技术评估阶段尚未完成。需要主动提供技术支持以推动项目进展。'
        }
      ]
    },
    {
      question_name: '竞争对手情况',
      answers: [
        {
          content: '客户提到正在评估三家供应商的产品，目前处于对比测试阶段。',
          reasoning_process: '客户多次提到"对比测试"和"其他供应商"，表明这是一个竞争激烈的采购决策过程。'
        }
      ]
    }
  ]
};

type ConversationSummaryArgs = {
  width: string;
  height: string;
};

const meta: Meta<ConversationSummaryArgs> = {
  title: 'Components/Conversation Summary',
  tags: ['autodocs'],
  component: 'megaview-conversation-summary',
  parameters: {
    docs: {
      description: {
        component: '会话纪要组件，支持根据不同数据结构展示上下文、推理等信息。最新版本优化了滚动处理机制，使用 setData 方法进行数据设置，并提供完善的数据验证。'
      }
    },
    layout: 'fullscreen'
  },
  argTypes: {
    width: {
      control: 'text',
      description: '组件宽度（任何有效的 CSS 尺寸值），会同步到 CSS 变量 --megaview-conversation-width'
    },
    height: {
      control: 'text',
      description: '组件高度（任何有效的 CSS 尺寸值），会同步到 CSS 变量 --megaview-conversation-height'
    }
  }
};

export default meta;

type Story = StoryObj<ConversationSummaryArgs>;

export const Default: Story = {
  name: '基础示例',
  args: {
    width: '100%',
    height: 'auto'
  },
  render: (args) => {
    const elementId = 'conversation-summary-default';

    // 使用 setTimeout 确保 DOM 元素已渲染后再设置数据
    setTimeout(() => {
      const element = document.getElementById(elementId) as any;
      if (element && element.setData) {
        element.setData(baseData);
      }
    }, 0);

    return html`
      <megaview-conversation-summary
        id=${elementId}
        style="max-width: 960px; margin: 0 auto;"
        width=${args.width}
        height=${args.height}>
      </megaview-conversation-summary>
    `;
  }
};

export const MultipleQuestions: Story = {
  name: '多问题列表',
  args: {
    width: '100%',
    height: 'auto'
  },
  render: (args) => {
    const elementId = 'conversation-summary-multiple';

    setTimeout(() => {
      const element = document.getElementById(elementId) as any;
      if (element && element.setData) {
        element.setData(multiQuestionData);
      }
    }, 0);

    return html`
      <megaview-conversation-summary
        id=${elementId}
        style="max-width: 960px; margin: 0 auto;"
        width=${args.width}
        height=${args.height}>
      </megaview-conversation-summary>
    `;
  }
};

export const EmptyState: Story = {
  name: '空状态',
  args: {
    width: '100%',
    height: '400px'
  },
  render: (args) => {
    const elementId = 'conversation-summary-empty';
    const emptyData: ConversationSummaryData = {
      conversation_id: 2,
      summary_status: 1,
      summary_result: []
    };

    setTimeout(() => {
      const element = document.getElementById(elementId) as any;
      if (element && element.setData) {
        element.setData(emptyData);
      }
    }, 0);

    return html`
      <megaview-conversation-summary
        id=${elementId}
        style="max-width: 960px; margin: 0 auto;"
        width=${args.width}
        height=${args.height}>
      </megaview-conversation-summary>
    `;
  }
};

export const ScrollBehavior: Story = {
  name: '滚动行为演示',
  args: {
    width: '100%',
    height: '300px'
  },
  parameters: {
    docs: {
      description: {
        story: '演示组件的滚动处理机制，高度限制在 300px 以触发滚动条。'
      }
    }
  },
  render: (args) => {
    const elementId = 'conversation-summary-scroll';

    setTimeout(() => {
      const element = document.getElementById(elementId) as any;
      if (element && element.setData) {
        element.setData(multiQuestionData);
      }
    }, 0);

    return html`
      <megaview-conversation-summary
        id=${elementId}
        style="max-width: 960px; margin: 0 auto;"
        width=${args.width}
        height=${args.height}>
      </megaview-conversation-summary>
    `;
  }
};

export const DataMethodExample: Story = {
  name: 'setData 方法使用说明',
  args: {
    width: '100%',
    height: 'auto'
  },
  parameters: {
    docs: {
      description: {
        story: '展示推荐的 setData 方法数据设置方式，提供更好的类型检查和错误处理。'
      }
    }
  },
  render: (args) => {
    const elementId = 'conversation-summary-method';

    setTimeout(() => {
      const element = document.getElementById(elementId) as any;
      if (element && element.setData) {
        element.setData(baseData);
      }
    }, 0);

    return html`
      <megaview-conversation-summary
        id=${elementId}
        style="max-width: 960px; margin: 0 auto;"
        width=${args.width}
        height=${args.height}>
      </megaview-conversation-summary>
      <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 4px;">
        <strong>setData 方法使用说明：</strong><br>
        <code style="display: block; margin-top: 8px; white-space: pre-line;">
// 获取组件实例后调用 setData 方法
const element = document.querySelector('megaview-conversation-summary');
element.setData({
  conversation_id: 123,
  summary_result: [
    {
      question_name: '问题标题',
      answers: [
        {
          content: '答案内容',
          context: [...],
          reasoning_process: '推理过程...'
        }
      ]
    }
  ]
});

// 清空数据
element.setData(null);
        </code>
        <p style="margin-top: 8px; color: #666;">
          <strong>优势：</strong>提供数据验证、错误处理和更好的类型检查
        </p>
      </div>
    `;
  }
};

