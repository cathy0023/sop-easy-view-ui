// src/components/conversation-summary/index.js

class MegaviewConversationSummary extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.data = null;
    this.expandedQuestions = new Set(); // 存储展开的问题索引
  }
  
  // 监听的属性
  static get observedAttributes() {
    return ['data', 'width', 'height'];
  }
  
  // 属性变化回调
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'data':
        this.parseData(newValue);
        this.render();
        break;
      case 'width':
      case 'height':
        this.updateStyles();
        break;
    }
  }
  
  // 组件挂载
  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }
  
  // 组件卸载
  disconnectedCallback() {
    this.removeEventListeners();
  }
  
  // 解析数据
  parseData(dataString) {
    try {
      this.data = JSON.parse(dataString);
      console.log('parseData', this.data);
    } catch (e) {
      console.error('Invalid data JSON:', e);
      this.data = null;
    }
  }
  
  // 渲染组件
  render() {
    if (!this.data) {
      this.shadow.innerHTML = this.getEmptyTemplate();
      return;
    }
    
    const styles = this.getStyles();
    const html = this.getTemplate();
    
    this.shadow.innerHTML = `
      <style>${styles}</style>
      ${html}
    `;
  }
  
  // 获取样式
  getStyles() {
    const width = this.getAttribute('width') || '100%';
    const height = this.getAttribute('height') || 'auto';
    
    const colors = {
      bg: '#f5f5f5',
      cardBg: '#ffffff',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e0e0e0',
      primary: '#4461ec',
      primaryBg: '#eaeffb',
      hover: '#f9f9f9'
    };
    
    return `
      :host {
        display: block;
        width: ${width};
        height: ${height};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: ${colors.text};
      }
      
      .container {
        background: ${colors.bg};
        padding: 20px;
        height: 100%;
        box-sizing: border-box;
      }
      
      .card {
        height: calc(100% - 48px);
        overflow-y: auto;
        background: ${colors.cardBg};
        border: 1px solid ${colors.border};
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 16px;
      }
      
      .question-item {
        margin-bottom: 12px;
        background: ${colors.cardBg};
      }
      
      .question-item:last-child {
        margin-bottom: 0;
      }
      
      .question-header {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        user-select: none;
        padding: 12px 16px;
        border-radius: 4px;
        transition: background-color 0.2s;
        position: relative;
        padding-left: 20px;
      }
      
      .question-header::before {
        content: '';
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 16px;
        background-color: ${colors.primary};
        border-radius: 2px;
      }
      
      .question-header:hover {
        background-color: ${colors.hover};
      }
      
      .question-header.has-details {
        cursor: pointer;
      }
      
      .question-header.no-details {
        cursor: default;
      }
      
      .question-header.no-details:hover {
        background-color: transparent;
      }
      
      .question-name {
        font-size: 15px;
        font-weight: 500;
        color: ${colors.text};
        flex: 1;
      }
      
      .collapse-icon {
        font-size: 14px;
        color: ${colors.textSecondary};
        transition: transform 0.2s;
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .collapse-icon.collapsed {
        transform: rotate(180deg);
      }
      
      .question-content {
        padding: 16px;
        padding-left: 32px;
        color: ${colors.text};
        line-height: 1.8;
        background: ${colors.bg};
        border-radius: 4px;
      }
      
      .question-content.collapsed {
        display: none;
      }
      
      .answer-content {
        color: ${colors.text};
        font-size: 14px;
      }
      
      .context-section {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid ${colors.border};
      }
      
      .context-title {
        font-size: 12px;
        font-weight: 600;
        color: ${colors.textSecondary};
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .context-item {
        background: ${colors.cardBg};
        padding: 12px 16px;
        border-radius: 4px;
        margin-bottom: 10px;
        font-size: 13px;
        line-height: 1.6;
        border-left: 3px solid ${colors.primary};
      }
      
      .context-item:last-child {
        margin-bottom: 0;
      }
      
      .context-meta {
        display: flex;
        gap: 16px;
        margin-bottom: 8px;
        font-size: 12px;
        color: ${colors.primary};
        font-weight: 500;
      }
      
      .speaker-type {
        color: ${colors.textSecondary};
        font-weight: 500;
      }
      
      .context-text {
        color: ${colors.text};
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.7;
      }
      
      .reasoning-section {
        padding-top: 16px;
      }
      
      .reasoning-title {
        font-size: 12px;
        font-weight: 600;
        color: ${colors.textSecondary};
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .reasoning-content {
        background: ${colors.primaryBg};
        padding: 12px 16px;
        border-radius: 4px;
        border-left: 3px solid ${colors.primary};
        font-size: 13px;
        line-height: 1.7;
        color: ${colors.text};
        white-space: pre-wrap;
        word-break: break-word;
      }
      
      .empty {
        text-align: center;
        padding: 60px 20px;
        color: ${colors.textSecondary};
      }
    `;
  }
  
  // 获取模板
  getTemplate() {
    if (!this.data || !this.data.summary_result || !Array.isArray(this.data.summary_result)) {
      return this.getEmptyTemplate();
    }
    
    const summaryResult = this.data.summary_result;
    
    return `
      <div class="container">
        <div class="card">
          ${summaryResult.map((item, index) => this.renderQuestionItem(item, index)).join('')}
        </div>
      </div>
    `;
  }
  
  // 渲染单个问题项
  renderQuestionItem(item, index) {
    const questionName = item.question_name || '';
    const answers = item.answers || [];
    
    if (answers.length === 0) {
      return `
        <div class="question-item">
          <div class="question-header no-details">
            <span class="question-name">${this.escapeHtml(questionName)}</span>
          </div>
        </div>
      `;
    }
    
    // 检查是否有 context 或 reasoning_process
    const hasDetails = answers.some(answer => 
      (answer.context && answer.context.length > 0) || 
      (answer.reasoning_process && answer.reasoning_process.trim())
    );
    
    const isExpanded = this.expandedQuestions.has(index);
    
    return `
      <div class="question-item">
        <div class="question-header ${hasDetails ? 'has-details' : 'no-details'}" 
             data-question-index="${index}">
          <span class="question-name">${this.escapeHtml(questionName)}</span>
          ${hasDetails ? `<span class="collapse-icon ${!isExpanded ? 'collapsed' : ''}">▲</span>` : ''}
        </div>
        ${hasDetails ? this.renderQuestionDetails(answers, isExpanded) : this.renderSimpleContent(answers)}
      </div>
    `;
  }
  
  // 渲染简单内容（无 context 和 reasoning_process）
  renderSimpleContent(answers) {
    return `
      <div class="question-content">
        ${answers.map(answer => `
          <div class="answer-content">${this.escapeHtml(answer.content || '').replace(/\n/g, '<br>')}</div>
        `).join('')}
      </div>
    `;
  }
  
  // 渲染详细内容（有 context 或 reasoning_process）
  renderQuestionDetails(answers, isExpanded) {
    if (!isExpanded) {
      return '<div class="question-content collapsed"></div>';
    }
    
    return `
      <div class="question-content">
        ${answers.map((answer) => {
          let html = '';
          
          // 答案内容
          if (answer.content) {
            html += `<div class="answer-content">${this.escapeHtml(answer.content).replace(/\n/g, '<br>')}</div>`;
          }
          
          // 上下文
          if (answer.context && answer.context.length > 0) {
            html += '<div class="context-section">';
            html += '<div class="context-title">上下文</div>';
            html += answer.context.map(ctx => {
              const timeStr = ctx.begin_time ? this.formatTime(ctx.begin_time) : '';
              const speakerName = ctx.speaker_name || (ctx.speaker_type === 'customer' ? '客户' : '销售');
              return `
                <div class="context-item">
                  ${timeStr || speakerName ? `
                    <div class="context-meta">
                      ${timeStr ? `<span>${timeStr}</span>` : ''}
                      ${speakerName ? `<span class="speaker-type">${this.escapeHtml(speakerName)}</span>` : ''}
                    </div>
                  ` : ''}
                  <div class="context-text">${this.escapeHtml(ctx.content || '').replace(/\n/g, '<br>')}</div>
                </div>
              `;
            }).join('');
            html += '</div>';
          }
          
          // 推理过程
          if (answer.reasoning_process && answer.reasoning_process.trim()) {
            html += '<div class="reasoning-section">';
            html += '<div class="reasoning-title">推理</div>';
            html += `<div class="reasoning-content">${this.escapeHtml(answer.reasoning_process).replace(/\n/g, '<br>')}</div>`;
            html += '</div>';
          }
          
          return html;
        }).join('')}
      </div>
    `;
  }
  
  // 格式化时间戳
  formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  getEmptyTemplate() {
    return `
      <style>${this.getStyles()}</style>
      <div class="container">
        <div class="card">
          <div class="empty">暂无数据</div>
        </div>
      </div>
    `;
  }
  
  // 绑定事件
  attachEventListeners() {
    this.shadow.addEventListener('click', this.handleClick.bind(this));
  }
  
  // 移除事件
  removeEventListeners() {
    this.shadow.removeEventListener('click', this.handleClick.bind(this));
  }
  
  // 处理点击事件
  handleClick(e) {
    const questionHeader = e.target.closest('.question-header.has-details');
    if (questionHeader) {
      const index = parseInt(questionHeader.dataset.questionIndex);
      this.toggleQuestion(index);
    }
  }
  
  // 切换问题展开/折叠
  toggleQuestion(index) {
    if (this.expandedQuestions.has(index)) {
      this.expandedQuestions.delete(index);
      this.dispatchEvent(new CustomEvent('section-collapse', { 
        detail: { questionIndex: index },
        bubbles: true,
        composed: true
      }));
    } else {
      this.expandedQuestions.add(index);
      this.dispatchEvent(new CustomEvent('section-expand', { 
        detail: { questionIndex: index },
        bubbles: true,
        composed: true
      }));
    }
    this.render();
  }
  
  // 更新样式
  updateStyles() {
    const styleEl = this.shadow.querySelector('style');
    if (styleEl) {
      styleEl.textContent = this.getStyles();
    }
  }
  
  // 公共方法：更新数据
  updateData(data) {
    this.data = data;
    this.expandedQuestions.clear(); // 清空展开状态
    this.render();
  }
  
  // 工具方法：转义 HTML
  escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }
}

// 注册自定义元素
customElements.define('megaview-conversation-summary', MegaviewConversationSummary);

export default MegaviewConversationSummary;

