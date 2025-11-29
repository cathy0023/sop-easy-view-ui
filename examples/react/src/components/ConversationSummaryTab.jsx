import { useRef, useEffect, useState } from 'react';
import 'megaview-ui';

// 会话纪要组件 - 展示会话总结信息的组件
// 设计思想：
// 1. 使用 useRef 获取 Web Components 的引用
// 2. 通过 useState 管理会话数据状态
// 3. 在 useEffect 中初始化数据和事件监听
// 4. 提供更新数据功能来演示动态更新能力
// 5. 使用相同的测试数据结构确保与 Vue3 版本的一致性
const ConversationSummaryTab = () => {
  // 会话纪要组件的引用，用于直接操作 Web Components
  const summaryRef = useRef(null);

  // 会话数据状态 - 使用与 Vue3 版本完全相同的数据结构
  const [conversationData, setConversationData] = useState({});

  // 组件挂载时的初始化逻辑
  useEffect(() => {
    console.log("ConversationSummaryTab mounted");
    console.log("Component ref:", summaryRef.current);

    if (summaryRef.current) {
      // 延迟设置数据，确保组件完全初始化
      setTimeout(() => {
        console.log("Component data:", summaryRef.current.data);

        // 初始化会话数据 - 与 Vue3 版本完全相同
        const initialData = {
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

        setConversationData(initialData);
        console.log("Component data after set:", summaryRef.current.data);
      }, 1000);
    }
  }, []);

  // 监听数据变化，更新组件
  useEffect(() => {
    console.log('ConversationSummaryTab data changed:', conversationData);
    if (summaryRef.current && Object.keys(conversationData).length > 0) {
      // 深拷贝去掉响应式包装，传递普通对象给组件
      summaryRef.current.setData(JSON.parse(JSON.stringify(conversationData)));
    }
  }, [conversationData]);

  // 更新数据处理函数 - 添加新的测试数据项
  const handleUpdateData = () => {
    console.log("handleUpdateData called in ConversationSummaryTab, updating conversationData");

    setConversationData(prevData => ({
      ...prevData,
      summary_result: [
        ...prevData.summary_result,
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
    }));

    console.log("conversationData updated:", conversationData);
  };

  return (
    <div className="conversation-summary-tab">
      {/* 控制按钮区域 */}
      <div className="controls">
        <button onClick={handleUpdateData}>更新数据</button>
      </div>

      {/* 会话纪要 Web Components */}
      <megaview-conversation-summary
        ref={summaryRef}
        height="600px"
      />
    </div>
  );
};

export default ConversationSummaryTab;
