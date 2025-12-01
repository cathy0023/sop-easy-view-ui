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

  it('支持点击展开/折叠上下文和推理，但不影响 answer-content 的展示', async () => {
    const element = await fixture<HTMLElement>(html`
      <megaview-conversation-summary
        details-default-state="collapsed"
        .data=${createData()}
      ></megaview-conversation-summary>
    `);
    const toggleTarget = element.shadowRoot?.querySelector('.question-header.has-details') as HTMLElement;
    toggleTarget?.click();

    const contextSection = element.shadowRoot?.querySelector('.context-section');
    const reasoningSection = element.shadowRoot?.querySelector('.reasoning-section');
    const answerContent = element.shadowRoot?.querySelector('.answer-content');

    // 展开状态下：上下文 & 推理可见，正文始终存在
    expect(contextSection).to.exist;
    expect(reasoningSection).to.exist;
    expect(answerContent).to.exist;
    expect(contextSection).to.not.have.class('collapsed');
    expect(reasoningSection).to.not.have.class('collapsed');

    // 再次点击折叠：只折叠上下文和推理，正文依旧存在
    toggleTarget?.click();
    expect(contextSection).to.have.class('collapsed');
    expect(reasoningSection).to.have.class('collapsed');
    expect(answerContent).to.exist;
  });

  it('支持键盘 Enter 键展开内容，满足基础可访问性', async () => {
    const element = await fixture<HTMLElement>(html`
      <megaview-conversation-summary
        details-default-state="collapsed"
        .data=${createData()}
      ></megaview-conversation-summary>
    `);
    const toggleTarget = element.shadowRoot?.querySelector('.question-header.has-details') as HTMLElement;
    const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true });
    toggleTarget?.dispatchEvent(keyboardEvent);

    const ariaExpanded = toggleTarget?.getAttribute('aria-expanded');
    expect(ariaExpanded).to.equal('true');
  });

  it('在默认配置下会将详情初始化为展开状态', async () => {
    const element = await fixture<HTMLElement>(html`
      <megaview-conversation-summary .data=${createData()}></megaview-conversation-summary>
    `);
    const contextSection = element.shadowRoot?.querySelector('.context-section');
    const reasoningSection = element.shadowRoot?.querySelector('.reasoning-section');
    const header = element.shadowRoot?.querySelector('.question-header.has-details');

    // 默认配置下，详情应该是展开的
    expect(contextSection).to.exist;
    expect(reasoningSection).to.exist;
    expect(contextSection).to.not.have.class('collapsed');
    expect(reasoningSection).to.not.have.class('collapsed');
    expect(header?.getAttribute('aria-expanded')).to.equal('true');
  });

  it('会将 width/height 属性同步为 CSS 变量', async () => {
    const element = await fixture<HTMLElement>(html`
      <megaview-conversation-summary width="320px" height="480px"></megaview-conversation-summary>
    `);
    expect(element.style.getPropertyValue('--megaview-conversation-width').trim()).to.equal('320px');
    expect(element.style.getPropertyValue('--megaview-conversation-height').trim()).to.equal('480px');
  });

  it('应该自动检测并渲染 Markdown 格式的内容', async () => {
    const markdownData: ConversationSummaryData = {
      conversation_id: 2,
      summary_result: [
        {
          question_name: 'Markdown 测试',
          answers: [
            {
              content: '# 标题\n**粗体文本**\n- 列表项1\n- 列表项2'
            }
          ]
        }
      ]
    };
    const element = await fixture<HTMLElement>(html`
      <megaview-conversation-summary .data=${markdownData}></megaview-conversation-summary>
    `);
    const markdownContent = element.shadowRoot?.querySelector('.markdown-content');
    expect(markdownContent).to.exist;
  });

  it('应该对普通文本使用原有的多行文本渲染方式', async () => {
    const normalData: ConversationSummaryData = {
      conversation_id: 3,
      summary_result: [
        {
          question_name: '普通文本测试',
          answers: [
            {
              content: '这是普通文本\n不包含 Markdown 语法'
            }
          ]
        }
      ]
    };
    const element = await fixture<HTMLElement>(html`
      <megaview-conversation-summary .data=${normalData}></megaview-conversation-summary>
    `);
    const markdownContent = element.shadowRoot?.querySelector('.markdown-content');
    expect(markdownContent).to.not.exist;
  });
});

