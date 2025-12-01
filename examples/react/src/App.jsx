import '@megaview/easy-view';
import { useRef, useEffect, useState } from 'react';
import TabContainer from './components/TabContainer';

// React 主应用组件 - 深维 UI 组件库 React 示例的入口
// 主要功能：
// 1. 显示应用标题和描述
// 2. 托管 TabContainer 组件来展示不同的组件示例
function App() {
  return (
    <div className="container">
      <h1>深维 UI 组件库 - React 示例</h1>
      <p className="subtitle">基于 Web Components 的框架无关可视化组件库</p>

      {/* Tab 容器组件 */}
      <TabContainer />
    </div>
  );
}

export default App;

