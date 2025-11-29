# API 文档

## megaview-conversation-summary

会话纪要展示组件。

### 属性（Attributes）

#### data

- **类型**: `string` (JSON 字符串)
- **必需**: 是
- **说明**: 会话数据

数据结构：

```typescript
{
  conversation_id?: number;        // 会话ID
  summary_status?: number;         // 总结状态
  summary_result: Array<{          // 总结结果数组
    instruction_id: number;        // 指令ID
    name: string;                  // 分类名称（如"销售XXX"、"客户档案"等）
    question_name: string;         // 问题名称
    answer_desc?: string;          // 答案描述
    create_at?: string;            // 创建时间
    answers: Array<{               // 答案数组
      content: string;             // 答案内容
      context?: Array<{            // 上下文数组（可选）
        begin_time?: number;       // 开始时间戳
        end_time?: number;         // 结束时间戳
        content: string;           // 上下文内容
        speaker_id?: number;       // 说话人ID
        speaker_type?: string;     // 说话人类型（user/customer等）
        speaker_name?: string;     // 说话人名称
        order?: number;            // 顺序
      }>;
      reasoning_process?: string;  // 推理过程（可选）
    }>;
  }>;
}
```

**示例**:

```html
<megaview-conversation-summary
  data='{"summary_result":[{"question_name":"销售是否处理了客户的异议","answers":[{"content":"否"}]}]}'>
</megaview-conversation-summary>
```

#### width

- **类型**: `string`
- **默认值**: `'100%'`
- **说明**: 组件宽度，支持任何有效的 CSS 宽度值

**示例**:

```html
<megaview-conversation-summary width="800px" ...></megaview-conversation-summary>
```

#### height

- **类型**: `string`
- **默认值**: `'auto'`
- **说明**: 组件高度，支持任何有效的 CSS 高度值

**示例**:

```html
<megaview-conversation-summary height="600px" ...></megaview-conversation-summary>
```

### 渲染逻辑

组件会根据数据自动判断渲染方式：

1. **简单模式**：如果答案中没有 `context` 和 `reasoning_process`，直接显示 `content` 内容
2. **折叠模式**：如果答案中有 `context` 或 `reasoning_process`，默认折叠，只显示 `question_name`，点击后展开显示完整内容

### 事件（Events）

#### section-expand

当某个问题展开时触发。

**事件详情**:

```typescript
{
  detail: {
    questionIndex: number; // 展开的问题索引
  }
}
```

**监听示例**:

```javascript
element.addEventListener('section-expand', (e) => {
  console.log('展开问题索引:', e.detail.questionIndex);
});
```

#### section-collapse

当某个问题折叠时触发。

**事件详情**:

```typescript
{
  detail: {
    questionIndex: number; // 折叠的问题索引
  }
}
```

**监听示例**:

```javascript
element.addEventListener('section-collapse', (e) => {
  console.log('折叠问题索引:', e.detail.questionIndex);
});
```

### 方法（Methods）

#### updateData(data)

更新组件数据。

**参数**:

- `data`: `Object` - 新的会话数据对象

**示例**:

```javascript
const element = document.querySelector('megaview-conversation-summary');
element.updateData({
  summary_result: [
    {
      question_name: "新问题",
      answers: [{ content: "新答案" }]
    }
  ]
});
```

## 完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <script type="module" src="https://cdn.megaview.com/ui/1.0.0/megaview-ui.es.js"></script>
</head>
<body>
  <div style="padding: 20px;">
    <megaview-conversation-summary
      id="summary"
      width="800px"
      height="600px">
    </megaview-conversation-summary>
  </div>
  
  <script type="module">
    const summary = document.getElementById('summary');
    
    // 设置数据
    const data = {
      conversation_id: 349488961,
      summary_status: 2,
      summary_result: [
        {
          instruction_id: 968,
          name: "销售XXX",
          question_name: "销售是否处理了客户的异议",
          answer_desc: "首先判断客户是否提出异议...",
          create_at: "2025-11-25 07:02:51",
          answers: [
            {
              content: "否",
              context: [
                {
                  begin_time: 1763207700,
                  content: "哈喽哈喽，我是雅思官方认证的助教老师...",
                  speaker_type: "user",
                  speaker_name: ""
                }
              ],
              reasoning_process: "客户未在对话中提出任何异议..."
            }
          ]
        },
        {
          instruction_id: 4267,
          name: "会话总结",
          question_name: "会话总结",
          create_at: "2025-11-25 07:02:51",
          answers: [
            {
              content: "本次对话为销售与客户的初次接触...",
              context: [],
              reasoning_process: ""
            }
          ]
        }
      ]
    };
    
    summary.setAttribute('data', JSON.stringify(data));
    
    // 监听事件
    summary.addEventListener('section-expand', (e) => {
      console.log('展开:', e.detail.questionIndex);
    });
    
    summary.addEventListener('section-collapse', (e) => {
      console.log('折叠:', e.detail.questionIndex);
    });
    
    // 3秒后更新数据
    setTimeout(() => {
      summary.updateData({
        ...data,
        summary_result: [
          ...data.summary_result,
          {
            question_name: "新问题",
            answers: [{ content: "新答案" }]
          }
        ]
      });
    }, 3000);
  </script>
</body>
</html>
```

## 数据格式说明

### 简单答案（无上下文和推理）

当答案中没有 `context` 和 `reasoning_process` 时，组件会直接显示答案内容：

```json
{
  "question_name": "会话总结",
  "answers": [
    {
      "content": "本次对话为销售与客户的初次接触..."
    }
  ]
}
```

### 详细答案（有上下文和推理）

当答案中有 `context` 或 `reasoning_process` 时，组件会默认折叠，点击问题名称展开：

```json
{
  "question_name": "销售是否处理了客户的异议",
  "answers": [
    {
      "content": "否",
      "context": [
        {
          "begin_time": 1763207700,
          "content": "对话内容...",
          "speaker_type": "user"
        }
      ],
      "reasoning_process": "客户未在对话中提出任何异议..."
    }
  ]
}
```

### 上下文格式

`context` 数组中的每个元素包含：

- `begin_time`: Unix 时间戳（秒）
- `end_time`: Unix 时间戳（秒）
- `content`: 对话内容
- `speaker_id`: 说话人ID
- `speaker_type`: 说话人类型（如 "user"、"customer" 等）
- `speaker_name`: 说话人名称
- `order`: 顺序

### 时间显示

组件会自动将时间戳转换为 `HH:MM` 格式显示在上下文内容上方。

## 更多资源

- [集成指南](./integration.md) - 了解如何在 React、Vue、原生 HTML 中集成组件
- [项目结构说明](./structure.md) - 了解项目目录组织方式
- [在线示例](../examples/) - 查看不同框架的集成示例
- [GitHub 仓库](https://github.com/megaview/MegaviewUI)
