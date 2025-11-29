<template>
  <div class="container">
    <h1>深维会话纪要组件 - Vue 示例</h1>
    <p class="subtitle">基于 Web Components 的框架无关可视化组件库</p>

    <div class="controls">
      <button @click="handleUpdateData">更新数据</button>
    </div>

    <megaview-conversation-summary
      ref="summaryRef"
      height="600px"
    />
  </div>
</template>

<script setup>
import "megaview-ui";
import { ref, computed, onMounted, watch } from "vue";

const summaryRef = ref(null);

const conversationData = ref({});

onMounted(() => {
  console.log("Vue data:", conversationData.value);
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
  console.log('Watch data:', newData);
  if (summaryRef.value) {
    // 深拷贝去掉响应式包装，传递普通对象给组件
    summaryRef.value.updateData(newData);
  }
}, { deep: true });

const handleUpdateData = () => {
  console.log("handleUpdateData called, updating conversationData");
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
