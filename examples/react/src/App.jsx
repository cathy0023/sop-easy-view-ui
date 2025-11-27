import 'megaview-ui';
import { useRef, useEffect, useState } from 'react';

function App() {
  const summaryRef = useRef(null);
  const [collapsible, setCollapsible] = useState(true);
  
  const initialData = {
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
  };
  
  useEffect(() => {
    const element = summaryRef.current;
    
    const handleExpand = (e) => {
      console.log('展开区块：', e.detail.section);
    };
    
    const handleCollapse = (e) => {
      console.log('折叠区块：', e.detail.section);
    };
    
    element?.addEventListener('section-expand', handleExpand);
    element?.addEventListener('section-collapse', handleCollapse);
    
    return () => {
      element?.removeEventListener('section-expand', handleExpand);
      element?.removeEventListener('section-collapse', handleCollapse);
    };
  }, []);
  
  const handleUpdateData = () => {
    const newData = {
      ...initialData,
      title: "更新后的会议 - " + new Date().toLocaleTimeString(),
      summary: "这是更新后的会议内容，展示了组件的动态更新能力。"
    };
    summaryRef.current?.updateData(newData);
  };
  
  const handleToggleCollapsible = () => {
    setCollapsible(!collapsible);
  };
  
  return (
    <div className="container">
      <h1>深维会话纪要组件 - React 示例</h1>
      <p className="subtitle">基于 Web Components 的框架无关可视化组件库</p>
      
      <div className="controls">
        <button onClick={handleUpdateData}>更新数据</button>
        <button onClick={handleToggleCollapsible}>
          {collapsible ? '禁用' : '启用'}折叠功能
        </button>
      </div>
      
      <megaview-conversation-summary
        ref={summaryRef}
        data={JSON.stringify(initialData)}
        collapsible={collapsible ? 'true' : 'false'}
      />
    </div>
  );
}

export default App;

