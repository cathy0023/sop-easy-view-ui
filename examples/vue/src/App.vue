<template>
  <div class="container">
    <h1>深维会话纪要组件 - Vue 示例</h1>
    <p class="subtitle">基于 Web Components 的框架无关可视化组件库</p>
    
    <div class="controls">
      <button @click="handleUpdateData">更新数据</button>
      <button @click="toggleCollapsible">
        {{ collapsible ? '禁用' : '启用' }}折叠功能
      </button>
    </div>
    
    <megaview-conversation-summary
      ref="summaryRef"
      :data="dataJson"
      :collapsible="collapsible ? 'true' : 'false'"
      @section-expand="handleExpand"
      @section-collapse="handleCollapse"
    />
  </div>
</template>

<script setup>
import 'megaview-ui';
import { ref, computed } from 'vue';

const summaryRef = ref(null);
const collapsible = ref(true);

const conversationData = ref({
  title: "产品需求讨论会议",
  date: "2024-01-15 14:00",
  duration: "45分钟",
  participants: ["张三", "李四", "王五", "赵六"],
  summary: "本次会议主要讨论了新产品的核心功能需求，确定了产品定位和目标用户群体。团队就技术实现方案进行了深入探讨，明确了开发优先级和时间节点。",
  keyPoints: [
    "确定产品核心功能为企业数据可视化展示",
    "目标用户为中大型企业客户",
    "采用 Web Components 技术实现组件库",
    "预计开发周期3个月，分三个迭代完成"
  ],
  actionItems: [
    {
      task: "完成产品原型设计",
      assignee: "张三",
      deadline: "2024-01-20"
    },
    {
      task: "准备技术方案文档",
      assignee: "李四",
      deadline: "2024-01-22"
    },
    {
      task: "进行市场调研",
      assignee: "王五",
      deadline: "2024-01-25"
    }
  ],
  tags: ["产品", "需求讨论", "高优先级"]
});

const dataJson = computed(() => JSON.stringify(conversationData.value));

const handleUpdateData = () => {
  conversationData.value = {
    ...conversationData.value,
    title: "更新后的会议 - " + new Date().toLocaleTimeString(),
    summary: "这是更新后的会议内容，展示了组件的动态更新能力。"
  };
};

const toggleCollapsible = () => {
  collapsible.value = !collapsible.value;
};

const handleExpand = (event) => {
  console.log('展开区块：', event.detail.section);
};

const handleCollapse = (event) => {
  console.log('折叠区块：', event.detail.section);
};
</script>

