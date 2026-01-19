# 数据库设计文档 (Database Design Document)

## 1. 数据库概览
- **Database System**: MySQL 8.0
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci

## 2. E-R 图 (Entity-Relationship)
本项目结构简单，主要核心实体为 **Task (任务)**。
"Columns" (列) 被设计为 Task 的一个状态属性，而非独立实体表，以简化架构。

## 3. 表结构设计 (Schema Design)

### 3.1 `tasks` 表
用于存储看板中的所有任务卡片。

| 字段名 (Field) | 类型 (Type) | 约束 (Constraints) | 描述 (Description) |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | 任务唯一标识 |
| `title` | VARCHAR(255) | NOT NULL | 任务标题 |
| `description` | TEXT | NULL | 任务详细描述 |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'todo' | 任务状态: 'todo', 'doing', 'done' |
| `position` | INT | NOT NULL, DEFAULT 0 | 排序权重，数值越小越靠前 |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 索引 (Indexes)
- `idx_status_position`: `(status, position)` - 用于快速查询各列任务并按顺序排列。

## 4. 初始化数据 (Seed Data)
应用启动时可预置的数据示例：

```sql
INSERT INTO tasks (title, description, status, position) VALUES 
('研究 Shadcn UI', '阅读官方文档并尝试组件', 'done', 100),
('搭建后端框架', '使用 FastAPI 初始化项目结构', 'doing', 100),
('实现拖拽功能', '集成 @dnd-kit', 'todo', 100),
('编写 Dockerfile', '容器化前后端应用', 'todo', 200);
```

## 5. 扩展性考虑
- 如果未来需要支持多看板 (Multiple Boards)，需添加 `boards` 表，并在 `tasks` 表中添加 `board_id` 外键。
- 如果需要支持动态列 (Dynamic Columns)，需添加 `columns` 表，将 `status` 字段替换为 `column_id`。
