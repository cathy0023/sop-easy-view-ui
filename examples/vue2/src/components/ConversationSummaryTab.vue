<template>
  <div class="conversation-summary-tab">
    <div class="controls">
      <button @click="handleUpdateData">更新数据</button>
    </div>

    <megaview-conversation-summary
      ref="summaryRef"
      height="600px"
      class="conversation-summary-wrapper"
    />
  </div>
</template>

<script>
// 会话纪要组件 - 展示会话总结信息的组件
// 设计思想：
// 1. 使用 $refs 获取 Web Components 的引用
// 2. 通过 data 函数管理会话数据状态
// 3. 在 mounted 生命周期钩子中初始化数据和事件监听
// 4. 提供更新数据功能来演示动态更新能力
// 5. 使用相同的测试数据结构确保与 Vue3/React 版本的一致性
import "@megaview/easy-view";

export default {
  name: 'ConversationSummaryTab',
  data() {
    return {
      // 会话数据
      conversationData: {}
    };
  },
  mounted() {
    // 组件挂载时的初始化逻辑
    console.log("ConversationSummaryTab mounted");
    console.log("Component ref:", this.$refs.summaryRef);

    if (this.$refs.summaryRef) {
      // 延迟设置数据，确保组件完全初始化
      setTimeout(() => {
        console.log("Component data:", this.$refs.summaryRef.data);

        // 初始化会话数据 - 与 Vue3/React 版本完全相同
        this.conversationData = {
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
                      end_time: 1763207700,
                      content:
                        "哈喽哈喽，我是雅思官方认证的助教老师 Cicy (可以叫我 小站-刘亦菲[呲牙] ) 你叫什么名字鸭~~~~",
                      speaker_id: 539147,
                      speaker_type: "user",
                      speaker_name: "",
                      order: 0,
                    },
                  ],
                  reasoning_process:
                    "客户未在对话中提出任何异议，且销售也未针对任何异议进行回应或处理。",
                },
              ],
            },
            {
              instruction_id: 4267,
              name: "会话总结",
              question_name: "会话总结",
              answer_desc: "请用一段话总结本次会话沟通的内容",
              create_at: "2025-11-25 07:02:51",
              answers: [
                {
                  content:
                    "本次对话为销售与客户的初次接触，销售进行了自我介绍并亲切问候客户，但客户尚未提供任何个人信息或具体诉求，双方未深入讨论关于雅思学习、考试计划或相关背景信息。",
                  context: [],
                  reasoning_process: "",
                },
              ],
            },
            {
              instruction_id: 4266,
              name: "客户档案",
              question_name: "客户档案",
              answer_desc: "生成客户档案",
              create_at: "2025-11-25 07:02:51",
              answers: [
                {
                  content: "学生基本信息：未提及\n家庭情况：未提及\n诉求：未提及",
                  context: [],
                  reasoning_process: "",
                },
              ],
            },
          ],
        };

        console.log("Component data after set:", this.$refs.summaryRef.data);
      }, 1000);
    }
  },
  watch: {
    // 监听数据变化，更新组件
    conversationData: {
      handler(newData) {
        console.log('ConversationSummaryTab data changed:', newData);
        if (this.$refs.summaryRef) {
          // 深拷贝去掉响应式包装，传递普通对象给组件
          this.$refs.summaryRef.setData(JSON.parse(JSON.stringify(newData)));
        }
      },
      deep: true
    }
  },
  methods: {
    // 更新数据处理函数 - 添加新的测试数据项
    handleUpdateData() {
      console.log("handleUpdateData called in ConversationSummaryTab, updating conversationData");

      this.conversationData = {
        ...this.conversationData,
        summary_result: [
          ...this.conversationData.summary_result,
          {
            instruction_id: 999,
            name: "测试",
            question_name: "测试问题 - " + new Date().toLocaleTimeString(),
            answer_desc: "测试描述",
            create_at: new Date().toISOString(),
            answers: [
              {
                content: "这是测试答案内容",
                context: [],
                reasoning_process: "",
              },
            ],
          },
        ],
      };

      console.log("conversationData updated:", this.conversationData);
    }
  }
};
</script>

<style scoped>
.conversation-summary-tab {
  /* 会话纪要 tab 的特定样式 */
}

.controls {
  margin-bottom: 20px;
}

.controls button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.controls button:hover {
  background-color: #0056b3;
}

.conversation-summary-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px;
}
</style>

