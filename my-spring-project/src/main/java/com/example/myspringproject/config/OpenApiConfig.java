package com.example.myspringproject.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI(@Value("${springdoc.version:1.0.0}") String appVersion) {
        final String securitySchemeName = "bearerAuth"; // Or "keycloakScheme"
        // You can also make the server URL dynamic if needed, e.g., for different environments
        // Server server = new Server().url("http://localhost:8080").description("Development server");

        return new OpenAPI()
            .info(new Info().title("Choir Management API")
                .version(appVersion) // Version from properties or default
                .description("API for managing choir repertoire and rehearsals. " +
                             "This API is secured using Keycloak JWT Bearer tokens.")
                .license(new License().name("MIT License").url("https://opensource.org/licenses/MIT")))
            // .addServersItem(server) // Uncomment if you want to specify server URL
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(
                new Components()
                    .addSecuritySchemes(securitySchemeName,
                        new SecurityScheme()
                            .name(securitySchemeName)
                            .type(SecurityScheme.Type.HTTP)
                            .scheme("bearer")
                            .bearerFormat("JWT")
                            .description("Enter JWT Bearer token **only**")
                    )
            );
    }
}
