<template>
  <div class="component-2-tab">
    <div class="placeholder">
      <h3>组件 2</h3>
      <p>这里将展示第二个组件的示例</p>
      <p class="description">
        这个组件目前是占位符，后续可以在这里集成其他 Megaview UI 组件
      </p>
    </div>
  </div>
</template>

<script>
// Component2Tab 组件 - 第二个组件的占位符
// 目前这个组件还没有具体的实现，后续可以在这里添加实际的组件逻辑
export default {
  name: 'Component2Tab'
};
</script>

<style scoped>
.component-2-tab {
  /* 组件2 tab 的特定样式 */
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  color: #666;
  background-color: #fafafa;
}

.placeholder h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
}

.placeholder p {
  margin: 5px 0;
  text-align: center;
}

.description {
  font-size: 14px;
  color: #888;
  max-width: 400px;
}
</style>
