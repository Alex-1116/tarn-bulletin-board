# 后端设计文档 (Backend Design Document)

## 1. 技术栈 (Tech Stack)
- **Language**: Python 3.11+
- **Framework**: FastAPI (高性能, 自动生成 Swagger 文档, 类型安全)
- **ORM**: SQLAlchemy (Async support)
- **Database Driver**: asyncpg (for PostgreSQL) or aiomysql (for MySQL) - *本项目使用 MySQL*
- **Data Validation**: Pydantic v2
- **Migration**: Alembic
- **Server**: Uvicorn

## 2. 目录结构 (Directory Structure)
```
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   └── tasks.py  # 任务相关路由
│   │   │   └── api.py        # 路由汇总
│   ├── core/
│   │   ├── config.py         # 环境变量配置
│   │   └── database.py       # 数据库连接 session
│   ├── models/
│   │   ├── base.py
│   │   └── task.py           # SQLAlchemy 模型
│   ├── schemas/
│   │   └── task.py           # Pydantic 模型 (Request/Response)
│   ├── services/
│   │   └── task_service.py   # 业务逻辑 (CRUD, Reordering)
│   └── main.py               # 应用入口
├── alembic/                  # 数据库迁移脚本
├── alembic.ini
├── requirements.txt
├── Dockerfile
└── start.sh
```

## 3. API 接口设计 (API Endpoints)

### 3.1 任务 (Tasks)
| Method | Path | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/tasks` | 获取所有任务列表 | - | `List[TaskResponse]` |
| **POST** | `/api/v1/tasks` | 创建新任务 | `TaskCreate` | `TaskResponse` |
| **GET** | `/api/v1/tasks/{id}` | 获取任务详情 | - | `TaskResponse` |
| **PATCH** | `/api/v1/tasks/{id}` | 更新任务 (内容/状态/位置) | `TaskUpdate` | `TaskResponse` |
| **DELETE** | `/api/v1/tasks/{id}` | 删除任务 | - | `204 No Content` |

### 3.2 特殊逻辑
- **排序 (Reordering)**:
  - 当任务在列内移动或跨列移动时，需要更新 `position` 字段。
  - 简单实现：使用浮点数索引或简单的整数索引（需要处理冲突或重排）。
  - 本项目建议使用 `Lexorank` 算法思想或简单的间隔整数（如 1000, 2000...）以便插入，或者每次拖拽更新受影响的卡片位置。
  - **简化方案**：前端发送拖拽后的 `prev_id` 或 `next_id`，或者直接发送该列所有任务的新顺序 ID 列表，后端批量更新。

## 4. 业务逻辑 (Business Logic)
- **状态校验**: `status` 必须是 `todo`, `doing`, `done` 之一。
- **位置管理**: 
  - 新创建的任务默认添加到该状态列表的末尾。
  - 更新位置时，确保并发安全性（可选，视复杂度而定）。

## 5. Docker 配置
- 使用 multi-stage build 减小镜像体积。
- 启动命令: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- 等待 MySQL 就绪后再启动 (使用 wait-for-it 或类似脚本)。
