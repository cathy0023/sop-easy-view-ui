import { expect, fixture, html } from '@open-wc/testing';
import '../../index.ts';
import type { ConversationSummaryData } from './types';

/**
 * megaview-conversation-summary 组件单元测试
 *
 * 设计说明：
 * - 覆盖空状态、属性解析、交互行为和可访问性键盘行为
 * - 采用真实自定义元素实例，确保渲染结构与生产环境一致
 */
describe('megaview-conversation-summary', () => {
  const createData = (): ConversationSummaryData => ({
    conversation_id: 1,
    summary_result: [
      {
        question_name: '测试问题',
        answers: [
          {
            content: '第一段回答\n支持换行展示',
            context: [
              {
                begin_time: 1700000000,
                speaker_name: '销售',
                speaker_type: 'user',
                content: '这是上下文'
              }
            ],
            reasoning_process: '推理内容'
          }
        ]
      }
    ]
  });

  it('在没有数据时渲染默认的空状态', async () => {
    const element = await fixture<HTMLElement>(html`<megaview-conversation-summary></megaview-conversation-summary>`);
    const emptyBlock = element.shadowRoot?.querySelector('.empty');
    expect(emptyBlock).to.exist;
  });

  it('支持通过 data 属性解析 JSON 字符串', async () => {
    const element = await fixture<HTMLElement>(html`
      <megaview-conversation-summary data=${JSON.stringify(createData())}></megaview-conversation-summary>
    `);
    const questionItems = element.shadowRoot?.querySelectorAll('.question-item') ?? [];
    expect(questionItems.length).to.equal(1);
  });

  it('支持点击展开/折叠内容', async () => {
    const element = await fixture<HTMLElement>(html`
      <megaview-conversation-summary .data=${createData()}></megaview-conversation-summary>
    `);
    const toggleTarget = element.shadowRoot?.querySelector('.question-header.has-details') as HTMLElement;
    toggleTarget?.click();

    const detailPanel = element.shadowRoot?.querySelector('.question-content');
    expect(detailPanel).to.exist;
    expect(detailPanel).to.not.have.class('collapsed');

    // 再次点击折叠
    toggleTarget?.click();
    expect(detailPanel).to.have.class('collapsed');
  });

  it('支持键盘 Enter 键展开内容，满足基础可访问性', async () => {
    const element = await fixture<HTMLElement>(html`
      <megaview-conversation-summary .data=${createData()}></megaview-conversation-summary>
    `);
    const toggleTarget = element.shadowRoot?.querySelector('.question-header.has-details') as HTMLElement;
    const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true });
    toggleTarget?.dispatchEvent(keyboardEvent);

    const ariaExpanded = toggleTarget?.getAttribute('aria-expanded');
    expect(ariaExpanded).to.equal('true');
  });

  it('会将 width/height 属性同步为 CSS 变量', async () => {
    const element = await fixture<HTMLElement>(html`
      <megaview-conversation-summary width="320px" height="480px"></megaview-conversation-summary>
    `);
    expect(element.style.getPropertyValue('--megaview-conversation-width').trim()).to.equal('320px');
    expect(element.style.getPropertyValue('--megaview-conversation-height').trim()).to.equal('480px');
  });
});

