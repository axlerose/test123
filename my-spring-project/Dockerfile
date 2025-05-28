# Stage 1: Build the application
FROM maven:3-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies first to leverage Docker cache
COPY pom.xml .
# Using 'verify' phase with 'dependency:go-offline' is often more robust
RUN mvn verify dependency:go-offline --fail-never

# Copy the rest of the source code
COPY src ./src

# Package the application
RUN mvn package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the JAR from the builder stage
# IMPORTANT: Ensure 'my-spring-project-0.0.1-SNAPSHOT.jar' matches your artifactId/version.
COPY --from=builder /app/target/my-spring-project-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Set the entrypoint to run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
