[1mdiff --git a/src/components/conversation-summary/conversation-summary.styles.ts b/src/components/conversation-summary/conversation-summary.styles.ts[m
[1mindex 32e1b17..c1a8adf 100644[m
[1m--- a/src/components/conversation-summary/conversation-summary.styles.ts[m
[1m+++ b/src/components/conversation-summary/conversation-summary.styles.ts[m
[36m@@ -22,6 +22,8 @@[m [mexport const conversationSummaryStyles = css`[m
     font-size: 14px;[m
     line-height: 1.6;[m
     color: var(--megaview-color-text, var(--megaview-conversation-text, #333333));[m
[32m+[m[32m    /* 将滚动移到根组件上，避免在某些场景下出现双滚动条或无法滚动的问题 */[m
[32m+[m[32m    overflow-y: auto;[m
   }[m
 [m
   :host([hidden]) {[m
[36m@@ -29,17 +31,13 @@[m [mexport const conversationSummaryStyles = css`[m
   }[m
 [m
   .container {[m
[31m-    background: var(--megaview-color-bg, var(--megaview-conversation-bg, #f5f5f5));[m
[31m-    padding: 20px;[m
     height: 100%;[m
     box-sizing: border-box;[m
   }[m
 [m
   .card {[m
[31m-    height: calc(100% - 48px);[m
[31m-    overflow-y: auto;[m
[32m+[m[32m    /* 移除 overflow-y: auto，将滚动控制权交给根组件 */[m
     background: var(--megaview-color-surface, var(--megaview-conversation-card-bg, #ffffff));[m
[31m-    border: 1px solid var(--megaview-color-border, var(--megaview-conversation-border, #e0e0e0));[m
     border-radius: 8px;[m
     padding: 24px;[m
     margin-bottom: 16px;[m
