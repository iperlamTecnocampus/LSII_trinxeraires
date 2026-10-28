# Build
FROM ubuntu:26.04

RUN apt-get update
RUN apt-get install openjdk-21-jdk maven -y

WORKDIR /app

COPY . .

WORKDIR /app/backend

ENTRYPOINT ["mvn", "spring-boot:run", "-f", "pom.xml", "-Pprod"]