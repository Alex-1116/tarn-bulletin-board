# 前端设计文档 (Frontend Design Document)

## 1. 技术栈 (Tech Stack)
- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Component Library**: Shadcn-UI (based on Radix UI)
- **State Management**: Zustand (轻量级全局状态管理) + React Query (服务端状态/数据获取)
- **Drag & Drop**: @dnd-kit/core (现代化、无障碍友好的拖拽库)
- **HTTP Client**: Axios
- **Icons**: Lucide-React

## 2. 目录结构 (Directory Structure)
```
frontend/
├── public/
├── src/
│   ├── api/                # API 请求定义
│   │   ├── client.ts       # Axios 实例
│   │   └── tasks.ts        # 任务相关接口
│   ├── components/         # 公共组件
│   │   ├── ui/             # Shadcn UI 组件 (Button, Dialog, etc.)
│   │   └── layout/         # 布局组件 (Header, MainLayout)
│   ├── features/           # 业务功能模块
│   │   └── kanban/
│   │       ├── components/ # 看板专用组件 (Board, Column, TaskCard)
│   │       ├── hooks/      # 看板逻辑 Hooks (useTaskDrag, useTaskQuery)
│   │       └── store/      # 看板状态 Store (optional)
│   ├── lib/                # 工具函数 (utils.ts)
│   ├── types/              # TypeScript 类型定义
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 3. 核心功能模块 (Core Features)

### 3.1 看板视图 (Kanban Board)
- **布局**: 包含三个固定列：Todo (待办), Doing (进行中), Done (已完成)。
- **交互**:
  - 支持任务卡片在列之间拖拽 (Drag & Drop)。
  - 支持列内任务排序 (Reorder)。

### 3.2 任务管理 (Task Management)
- **创建**: 点击 "Add Task" 按钮弹出对话框或行内输入。
- **编辑**: 点击卡片查看详情并编辑 (标题, 描述)。
- **删除**: 确认后删除任务。
- **状态流转**: 拖拽自动更新状态。

## 4. 数据交互与状态 (Data & State)

### 4.1 React Query
- 使用 `useQuery` 获取任务列表。
- 使用 `useMutation` 处理创建、更新、删除操作。
- 实现 **乐观更新 (Optimistic Updates)**：拖拽时立即更新 UI，后台异步同步数据，失败则回滚，保证流畅体验。

### 4.2 类型定义 (Types)
```typescript
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  position?: number;
}
```

## 5. UI 设计规范 (UI Design)
- **配色**: 使用 Tailwind 默认色板，结合 Shadcn 的 Zinc/Slate 风格，保持简洁现代。
- **卡片**: 白色背景，轻微阴影，圆角。
- **响应式**: 移动端适配（可能转为垂直堆叠或水平滚动）。
