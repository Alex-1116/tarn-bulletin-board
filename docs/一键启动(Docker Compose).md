# Tarn Kanban Board

这是一个基于 React + Python + MySQL 的看板任务管理系统。

## 技术栈

- **前端**: React, TypeScript, Vite, TailwindCSS, Shadcn UI, @dnd-kit
- **后端**: Python, FastAPI, SQLAlchemy
- **数据库**: MySQL 8.0
- **部署**: Docker Compose

## 快速启动 (推荐)

使用 Docker Compose 可以一键启动所有服务（前端、后端、数据库）。

### 前置要求

1.  **安装 Docker Desktop**: 请访问 [Docker 官网](https://www.docker.com/products/docker-desktop/) 下载并安装 Docker Desktop for Mac。
2.  **启动 Docker**: 安装完成后，请确保 Docker Desktop 应用程序正在运行。
3.  **验证安装**: 在终端运行 `docker --version` 确保 Docker 命令可用。

### 启动步骤

1. 在项目根目录下运行：

   > 注意：新版 Docker 推荐使用 `docker compose` (中间有空格) 而不是 `docker-compose`。

```bash
docker compose up
   or
docker compose up --build -d
   or
make up
```

   如果你的 Docker 版本较旧，可能需要使用：
```bash
docker-compose up --build -d
```

2. 访问应用：
   - 前端页面: http://localhost:3001
   - 后端 API 文档: http://localhost:8000/docs

## 本地开发启动

如果你想在本地进行代码开发和调试，可以分别启动各服务。

### 1. 启动数据库

你可以使用 Docker 单独启动 MySQL，或者使用本地安装的 MySQL。

**使用 Docker 启动 MySQL:**

```bash
docker compose up -d db
```

### 2. 启动后端

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动服务 (确保 .env 配置正确指向你的数据库)
uvicorn app.main:app --reload
```

### 3. 启动前端

```bash
cd frontend

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:5173 进行开发预览。
