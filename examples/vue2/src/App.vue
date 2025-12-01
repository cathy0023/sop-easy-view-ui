<template>
  <div class="container">
    <h1>深维 UI 组件库 - Vue 2 示例</h1>
    <p class="subtitle">基于 Web Components 的框架无关可视化组件库</p>

    <!-- Tab 容器组件 -->
    <TabContainer />
  </div>
</template>

<script>
// Vue2 主应用组件 - 深维 UI 组件库 Vue 2 示例的入口
// 主要功能：
// 1. 显示应用标题和描述
// 2. 托管 TabContainer 组件来展示不同的组件示例
import TabContainer from './components/TabContainer.vue';

export default {
  name: 'App',
  components: {
    TabContainer
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
}
</style>


