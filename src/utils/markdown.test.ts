import { expect } from '@open-wc/testing';
import { isMarkdown, renderMarkdown } from './markdown';

/**
 * Markdown 工具函数单元测试
 *
 * 设计说明：
 * - 测试 Markdown 检测函数能否正确识别 Markdown 和普通文本
 * - 测试 Markdown 渲染函数能否正确渲染各种 Markdown 语法
 * - 验证安全性（XSS 防护）
 */

describe('isMarkdown', () => {
  it('应该识别包含标题语法的文本为 Markdown', () => {
    const text = '# 标题\n普通文本';
    expect(isMarkdown(text)).to.be.true;
  });

  it('应该识别包含粗体和列表的文本为 Markdown', () => {
    const text = '**粗体文本**\n- 列表项1\n- 列表项2';
    expect(isMarkdown(text)).to.be.true;
  });

  it('应该识别包含代码块的文本为 Markdown', () => {
    const text = '普通文本\n```javascript\ncode\n```\n更多文本';
    expect(isMarkdown(text)).to.be.true;
  });

  it('应该识别包含链接的文本为 Markdown', () => {
    const text = '普通文本\n[链接文本](https://example.com)\n更多文本';
    expect(isMarkdown(text)).to.be.true;
  });

  it('应该识别包含引用和分隔线的文本为 Markdown', () => {
    const text = '普通文本\n> 引用内容\n---\n更多文本';
    expect(isMarkdown(text)).to.be.true;
  });

  it('应该识别包含多个 Markdown 特征的文本为 Markdown', () => {
    const text = '# 标题\n**粗体**\n- 列表项\n`代码`';
    expect(isMarkdown(text)).to.be.true;
  });

  it('不应该将普通文本识别为 Markdown', () => {
    const text = '这是一个普通的文本内容，不包含任何 Markdown 语法特征。';
    expect(isMarkdown(text)).to.be.false;
  });

  it('不应该将只包含单个特征的文本识别为 Markdown（避免误判）', () => {
    const text = '只有一个 # 符号，不应该被识别为 Markdown';
    expect(isMarkdown(text)).to.be.false;
  });

  it('应该处理空字符串', () => {
    expect(isMarkdown('')).to.be.false;
  });

  it('应该处理空值', () => {
    expect(isMarkdown(null as any)).to.be.false;
    expect(isMarkdown(undefined as any)).to.be.false;
  });
});

describe('renderMarkdown', () => {
  it('应该正确渲染标题', () => {
    const markdown = '# 一级标题\n## 二级标题';
    const html = renderMarkdown(markdown);
    expect(html).to.include('<h1>');
    expect(html).to.include('<h2>');
  });

  it('应该正确渲染粗体和斜体', () => {
    const markdown = '**粗体文本** 和 *斜体文本*';
    const html = renderMarkdown(markdown);
    expect(html).to.include('<strong>');
    expect(html).to.include('<em>');
  });

  it('应该正确渲染无序列表', () => {
    const markdown = '- 列表项1\n- 列表项2\n- 列表项3';
    const html = renderMarkdown(markdown);
    expect(html).to.include('<ul>');
    expect(html).to.include('<li>');
  });

  it('应该正确渲染有序列表', () => {
    const markdown = '1. 第一项\n2. 第二项\n3. 第三项';
    const html = renderMarkdown(markdown);
    expect(html).to.include('<ol>');
    expect(html).to.include('<li>');
  });

  it('应该正确渲染代码块', () => {
    const markdown = '```javascript\nconst x = 1;\n```';
    const html = renderMarkdown(markdown);
    expect(html).to.include('<pre>');
    expect(html).to.include('<code>');
  });

  it('应该正确渲染行内代码', () => {
    const markdown = '这是一个 `行内代码` 示例';
    const html = renderMarkdown(markdown);
    expect(html).to.include('<code>');
  });

  it('应该正确渲染链接', () => {
    const markdown = '[链接文本](https://example.com)';
    const html = renderMarkdown(markdown);
    expect(html).to.include('<a');
    expect(html).to.include('href');
  });

  it('应该正确渲染引用块', () => {
    const markdown = '> 这是一个引用块\n> 可以包含多行内容';
    const html = renderMarkdown(markdown);
    expect(html).to.include('<blockquote>');
  });

  it('应该正确渲染分隔线', () => {
    const markdown = '文本1\n---\n文本2';
    const html = renderMarkdown(markdown);
    expect(html).to.include('<hr');
  });

  it('应该处理空字符串', () => {
    const html = renderMarkdown('');
    expect(html).to.equal('');
  });

  it('应该处理空值', () => {
    expect(renderMarkdown(null as any)).to.equal('');
    expect(renderMarkdown(undefined as any)).to.equal('');
  });

  it('应该清理危险的 HTML 标签（XSS 防护）', () => {
    const markdown = '<script>alert("XSS")</script>普通文本';
    const html = renderMarkdown(markdown);
    expect(html).to.not.include('<script>');
    expect(html).to.not.include('alert');
  });

  it('应该清理危险的事件处理器（XSS 防护）', () => {
    const markdown = '<div onclick="alert(\'XSS\')">内容</div>';
    const html = renderMarkdown(markdown);
    expect(html).to.not.include('onclick');
  });

  it('应该保留安全的 HTML 标签', () => {
    const markdown = '**粗体** 和 *斜体*';
    const html = renderMarkdown(markdown);
    expect(html).to.include('<strong>');
    expect(html).to.include('<em>');
  });

  it('应该正确处理换行符（breaks 选项）', () => {
    const markdown = '第一行\n第二行\n第三行';
    const html = renderMarkdown(markdown);
    expect(html).to.include('<br');
  });
});

