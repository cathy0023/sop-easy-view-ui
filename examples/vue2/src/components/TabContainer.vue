<template>
  <div class="tab-container">
    <!-- Tab 导航 -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Tab 内容 -->
    <div class="tab-content">
      <!-- 会话纪要组件 -->
      <div v-show="activeTab === 'conversation-summary'" class="tab-panel">
        <ConversationSummaryTab />
      </div>

      <!-- 预留的其他组件 tab -->
      <div v-show="activeTab === 'component-2'" class="tab-panel">
        <Component2Tab />
      </div>

      <div v-show="activeTab === 'component-3'" class="tab-panel">
        <Component3Tab />
      </div>
    </div>
  </div>
</template>

<script>
// Tab 容器组件 - 管理多个组件示例的展示
// 设计思想：
// 1. 使用 data 函数来定义响应式状态
// 2. 提供统一的 tab 导航界面
// 3. 通过 v-show 指令来控制显示对应的组件内容
// 4. 支持扩展更多的组件示例
import ConversationSummaryTab from './ConversationSummaryTab.vue';
import Component2Tab from './Component2Tab.vue';
import Component3Tab from './Component3Tab.vue';

export default {
  name: 'TabContainer',
  components: {
    ConversationSummaryTab,
    Component2Tab,
    Component3Tab
  },
  data() {
    return {
      // 当前激活的 tab
      activeTab: 'conversation-summary',

      // Tab 配置
      tabs: [
        { id: 'conversation-summary', name: '会话纪要' },
        { id: 'component-2', name: '组件 2' },
        { id: 'component-3', name: '组件 3' }
      ]
    };
  }
};
</script>

<style scoped>
.tab-container {
  /* Tab 容器样式 */
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.tab-button {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background-color: #f5f5f5;
}

.tab-button.active {
  border-bottom-color: #007bff;
  color: #007bff;
  font-weight: bold;
}

.tab-content {
  min-height: 400px;
}

.tab-panel {
  padding: 20px 0;
}
</style>


