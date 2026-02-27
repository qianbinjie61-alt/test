# 备忘录与月度记账（Java + MySQL）

这是一个可部署到服务器并共享使用的应用：
- 备忘录：新增、查看、删除
- 月度记账：按月记录收入/支出、查看汇总、删除记录

后端使用 **Java Spring Boot REST API**，持久化使用 **MySQL**。

## 技术栈
- Java 17
- Spring Boot 3
- Spring JDBC
- MySQL 8+
- 前端：HTML/CSS/JavaScript（静态资源由 Spring Boot 提供）

## 1. 准备 MySQL
先创建数据库：

```sql
CREATE DATABASE memo_finance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

应用启动时会自动执行 `src/main/resources/schema.sql` 创建表。

## 2. 配置数据库连接（环境变量）

```bash
export MYSQL_URL='jdbc:mysql://127.0.0.1:3306/memo_finance?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai'
export MYSQL_USERNAME='root'
export MYSQL_PASSWORD='root'
```

## 3. 启动

```bash
mvn spring-boot:run
```

默认端口 `3000`，可通过 `PORT` 环境变量覆盖。

打开：`http://127.0.0.1:3000`

## API 概览
- `GET /api/health`
- `GET /api/memos`
- `POST /api/memos`
- `DELETE /api/memos/{id}`
- `GET /api/records?month=YYYY-MM`
- `POST /api/records`
- `DELETE /api/records/{id}`

## 部署建议
- 使用 `mvn clean package` 构建后通过 `java -jar target/*.jar` 运行。
- 用 Nginx 反向代理。
- 用 systemd / supervisor / pm2(非必须) 做进程守护。
- 定期备份 MySQL 数据库。
