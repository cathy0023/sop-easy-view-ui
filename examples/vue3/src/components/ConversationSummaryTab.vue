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

<script setup>
import "megaview-ui";
import { ref, onMounted, watch } from "vue";

// 会话纪要组件引用
const summaryRef = ref(null);

// 会话数据
const conversationData = ref({});

// 初始化数据
onMounted(() => {
  console.log("ConversationSummaryTab mounted");
  console.log("Component ref:", summaryRef.value);
  if (summaryRef.value) {
    setTimeout(() => {
      console.log("Component data:", summaryRef.value.data);
      conversationData.value = {
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
      console.log("Component data:", summaryRef.value.data);
    }, 1000);
  }
});

// 监听数据变化，更新组件
watch(conversationData, (newData) => {
  console.log('ConversationSummaryTab data changed:', newData);
  if (summaryRef.value) {
    // 深拷贝去掉响应式包装，传递普通对象给组件
    summaryRef.value.setData(newData);
  }
}, { deep: true });

// 更新数据处理函数
const handleUpdateData = () => {
  console.log("handleUpdateData called in ConversationSummaryTab, updating conversationData");
  conversationData.value = {
    ...conversationData.value,
    summary_result: [
      ...conversationData.value.summary_result,
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
  console.log("conversationData updated:", conversationData.value);
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


.conversation-summary-wrapper::part(container) {
  background: transparent;
  padding: 0px;
}

.conversation-summary-wrapper::part(card) {
  background: transparent;
  padding: 8px;
}

</style>


