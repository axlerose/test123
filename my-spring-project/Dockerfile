# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17-jammy AS builder

WORKDIR /app

# Copy pom.xml and download dependencies first to leverage Docker cache
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Package the application
# The JAR name will be based on pom.xml's artifactId and version.
# Assuming it's my-spring-project-0.0.1-SNAPSHOT.jar for now.
# If your pom.xml produces a different name, adjust the COPY command in the next stage.
RUN mvn package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the JAR from the builder stage
# IMPORTANT: Replace 'my-spring-project-0.0.1-SNAPSHOT.jar' if your artifactId/version is different.
# A more robust way could be to use a wildcard or fixed name in pom.xml build finalName.
COPY --from=builder /app/target/my-spring-project-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Set the entrypoint to run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
