# Build Stage
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Install fontconfig and freetype for Apache PDFBox graphics rendering in minimal containers
RUN apk add --no-cache fontconfig freetype ttf-dejavu
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

# Production-tuned JVM flags for Render Free Tier (512MB RAM):
# -XX:+UseG1GC: Low-latency garbage collection
# -XX:MaxRAMPercentage=70.0: Guarantees Java heap won't exceed container cgroups memory limit
# -XX:+ExitOnOutOfMemoryError: Fails fast rather than hanging indefinitely
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=70.0", "-XX:+ExitOnOutOfMemoryError", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
