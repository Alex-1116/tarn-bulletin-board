# Tarn Bulletin Board

这是一个基于 React + TypeScript + Vite + tailwindcss + shadcn/ui + FastAPI + Python + MySQL 构建的全栈看板应用。

## 🚀 快速启动 (Docker)

使用 Docker Compose 可以一键启动所有服务（前端、后端、数据库）。

### 前置要求
1.  **安装 Docker Desktop**: 请访问 [Docker 官网](https://www.docker.com/products/docker-desktop/) 下载并安装 Docker Desktop for Mac。
2.  **启动 Docker**: 安装完成后，请确保 Docker Desktop 应用程序正在运行。
3.  **验证安装**: 在终端运行 `docker --version` 确保 Docker 命令可用。

### 启动命令

你可以直接使用提供的 `docker compose` 或 `Makefile` 命令：

```bash
# Docker Compose
docker compose up

# 或者使用 Docker Compose
docker compose up --build -d

# 或者使用 Makefile
make up
```

启动后将包含以下服务：
- **前端页面**: [http://localhost:3001](http://localhost:3001)
- **后端 API**: [http://localhost:8000](http://localhost:8000)
- **API 文档**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **数据库**: MySQL (端口 3306)

停止服务：
```bash
docker compose down
# 或者
make down
```

---

## 🛠 本地开发设置

如果你想在不使用 Docker 的情况下（数据库除外）本地运行前端和后端，请按照以下步骤操作。

### 前置要求
- Node.js (v18+)
- pnpm
- Python (3.10+)
- MySQL Server (本地运行或通过 Docker 运行)

### 1. 数据库设置

确保你有一个正在运行的 MySQL 数据库。你可以使用 docker 单独启动数据库服务：

```bash
docker compose up -d db
```

### 2. 后端设置

进入 `backend` 目录：

```bash
cd backend
```

创建虚拟环境并激活：
```bash
python -m venv venv
source venv/bin/activate  # Windows 用户使用: venv\Scripts\activate
```

安装依赖：
```bash
pip install -r requirements.txt
```

配置环境变量：
```bash
cp .env.example .env
```
> **注意：** 请更新 `.env` 文件以指向你的本地 MySQL 实例（例如，如果是在本地直接运行 MySQL 而非 Docker，可能需要设置 `MYSQL_SERVER=localhost`）。

运行服务器：
```bash
uvicorn app.main:app --reload
```
API 服务将在 http://localhost:8000 启动。

### 3. 前端设置

进入 `frontend` 目录：

```bash
cd frontend
```

安装依赖：
```bash
pnpm install
```

配置环境变量：
```bash
cp .env.example .env
```

启动开发服务器：
```bash
pnpm dev
```
前端页面将在 http://localhost:5173 (默认 Vite 端口) 或终端显示的端口上可用。

## 📁 项目结构

```
.
├── backend/            # FastAPI 后端
│   ├── app/            # 应用源代码
│   │   ├── api/        # API 接口端点
│   │   ├── core/       # 核心配置与数据库连接
│   │   ├── models/     # 数据库模型
│   │   ├── schemas/    # Pydantic 模式 (Schemas)
│   │   └── main.py     # 程序入口
│   └── requirements.txt
├── frontend/           # React 前端 (Vite)
│   ├── src/
│   │   ├── components/ # UI 组件
│   │   ├── features/   # 功能模块 (如看板 Kanban)
│   │   └── api/        # API 客户端封装
│   └── package.json
├── docs/               # 项目文档
└── docker-compose.yml  # Docker 服务配置
```

## 📚 文档

详细文档请查阅 `docs/` 目录。
