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
- Docker / Docker Compose（可选）

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

## 3. 本地启动（非 Docker）

```bash
mvn spring-boot:run
```

默认端口 `3000`，可通过 `PORT` 环境变量覆盖。

打开：`http://127.0.0.1:3000`

## Docker 打包与运行

### 方式 A：只打应用镜像

```bash
docker build -t memo-finance-app:latest .
```

运行容器（连接你已有的 MySQL）：

```bash
docker run --rm -p 3000:3000 \
  -e MYSQL_URL='jdbc:mysql://<mysql-host>:3306/memo_finance?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai' \
  -e MYSQL_USERNAME='root' \
  -e MYSQL_PASSWORD='root' \
  memo-finance-app:latest
```

### 方式 B：一键起应用 + MySQL（推荐）

项目已提供 `docker-compose.yml`：

```bash
docker compose up -d --build
```

查看日志：

```bash
docker compose logs -f app
```

停止并清理：

```bash
docker compose down
```

> MySQL 数据会保存在 `mysql-data` volume 中，重启容器后仍保留。

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
- 或直接使用 Docker 镜像部署。
- 用 Nginx 反向代理。
- 用 systemd / supervisor 做进程守护。
- 定期备份 MySQL 数据库。
