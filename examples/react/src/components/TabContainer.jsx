import { useState } from 'react';
import ConversationSummaryTab from './ConversationSummaryTab';
import Component2Tab from './Component2Tab';
import Component3Tab from './Component3Tab';

// Tab 容器组件 - 管理多个组件示例的展示
// 设计思想：
// 1. 使用状态管理来控制当前激活的 tab
// 2. 提供统一的 tab 导航界面
// 3. 通过条件渲染来显示对应的组件内容
// 4. 支持扩展更多的组件示例
const TabContainer = () => {
  // 当前激活的 tab 状态
  const [activeTab, setActiveTab] = useState('conversation-summary');

  // Tab 配置数据 - 定义所有可用的 tab
  const tabs = [
    { id: 'conversation-summary', name: '会话纪要' },
    { id: 'component-2', name: '组件 2' },
    { id: 'component-3', name: '组件 3' }
  ];

  return (
    <div className="tab-container">
      {/* Tab 导航区域 */}
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab 内容区域 */}
      <div className="tab-content">
        {/* 会话纪要组件 */}
        {activeTab === 'conversation-summary' && (
          <div className="tab-panel">
            <ConversationSummaryTab />
          </div>
        )}

        {/* 预留的其他组件 tab */}
        {activeTab === 'component-2' && (
          <div className="tab-panel">
            <Component2Tab />
          </div>
        )}

        {activeTab === 'component-3' && (
          <div className="tab-panel">
            <Component3Tab />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabContainer;
