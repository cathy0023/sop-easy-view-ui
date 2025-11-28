import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index';
import type { ConversationSummaryData } from './types';

/**
 * Storybook 文档：Megaview Conversation Summary
 *
 * 设计说明：
 * - 提供基础示例、复杂数据示例以及空状态，帮助第一次接触组件的人理解行为
 * - 使用 args + Controls 机制，让使用者可以即时调整宽高或数据
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
          content: '客户的技术团队仍在评估 API 接口，需准备技术答疑会议。'
        }
      ]
    }
  ]
};

type ConversationSummaryArgs = {
  width: string;
  height: string;
  data: ConversationSummaryData;
};

const meta: Meta<ConversationSummaryArgs> = {
  title: 'Components/Conversation Summary',
  tags: ['autodocs'],
  component: 'megaview-conversation-summary',
  parameters: {
    docs: {
      description: {
        component: '会话纪要组件，支持根据不同数据结构展示上下文、推理等信息。'
      }
    },
    layout: 'fullscreen'
  },
  argTypes: {
    width: {
      control: 'text',
      description: '组件宽度（任何有效的 CSS 尺寸值）'
    },
    height: {
      control: 'text',
      description: '组件高度（任何有效的 CSS 尺寸值）'
    },
    data: {
      control: 'object',
      description: '会话纪要数据结构，详见 README 中的数据格式章节'
    }
  },
  render: (args) => html`
    <megaview-conversation-summary
      style="max-width: 960px; margin: 0 auto;"
      .data=${args.data}
      width=${args.width}
      height=${args.height}>
    </megaview-conversation-summary>
  `
};

export default meta;

type Story = StoryObj<ConversationSummaryArgs>;

export const Default: Story = {
  name: '基础示例',
  args: {
    data: baseData,
    width: '100%',
    height: 'auto'
  }
};

export const MultipleQuestions: Story = {
  name: '多问题列表',
  args: {
    data: multiQuestionData,
    width: '100%',
    height: 'auto'
  }
};

export const EmptyState: Story = {
  name: '空状态',
  args: {
    data: {
      conversation_id: 2,
      summary_status: 1,
      summary_result: []
    },
    width: '100%',
    height: '400px'
  }
};

