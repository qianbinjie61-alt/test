# syntax=docker/dockerfile:1

FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/target/memo-finance-app-1.0.0.jar /app/app.jar

EXPOSE 3000

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
