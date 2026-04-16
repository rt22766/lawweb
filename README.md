# FactFlow AI Demo

一个基于 Next.js 的法律案件结构化分析演示项目。

## 本地运行

```bash
npm ci
npm run dev -- --port 3000
```

打开 `http://127.0.0.1:3000`。

## GitHub + Render 免费部署

### 1. 推送到 GitHub

如果当前目录还不是 Git 仓库，先执行：

```bash
git init
git add .
git commit -m "chore: prepare github and render deployment"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

### 2. 在 Render 创建服务

1. 登录 Render，选择 `New +` -> `Blueprint`（推荐）或 `Web Service`。
2. 连接你的 GitHub 仓库。
3. 如果选择 Blueprint，Render 会读取仓库中的 `render.yaml` 自动创建服务。
4. 首次构建完成后，拿到公网地址（如 `https://xxx.onrender.com`）。

### 3. 给测试用户的体验路径

按下面顺序体验：

1. `/register`
2. `/login`
3. `/workspace`
4. 新建案件
5. `/workspace/{caseId}/facts`
6. `/workspace/{caseId}/result`
7. `/workspace/{caseId}/precedents/{precedentId}`
8. 刷新确认数据

## 重要说明（当前版本）

- 账号和案件数据目前存储在本地文件 `.data/*.json`。
- 在 Render 免费实例中，文件系统不是长期持久化存储，服务重启后数据可能重置。
- 如果要长期保留数据，建议改为外部数据库（如 Supabase/Postgres）。
