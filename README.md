# 备忘录与月度记账（后端持久化版）

这是一个可部署到服务器并支持共享使用的简易应用：
- 备忘录：新增、查看、删除
- 月度记账：记录每月收入/支出、查看当月汇总、删除记录

> 数据持久化在服务器端文件 `data/store.json`，不是浏览器内存或 `localStorage`。

## 运行环境
- Node.js 18+

## 本地启动
```bash
node server.js
```

默认监听：`http://0.0.0.0:3000`

## API 概览
- `GET /api/health`
- `GET /api/memos`
- `POST /api/memos`
- `DELETE /api/memos/:id`
- `GET /api/records?month=YYYY-MM`
- `POST /api/records`
- `DELETE /api/records/:id`

## 部署建议
1. 将项目上传到服务器。
2. 使用 `node server.js` 启动。
3. 建议用 Nginx 反向代理并配置守护进程（如 systemd / pm2）。
4. 定期备份 `data/store.json`。
