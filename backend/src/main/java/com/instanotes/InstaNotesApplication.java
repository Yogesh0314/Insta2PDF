package com.instanotes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application runner for InstaNotes PDF conversion backend.
 *
 * @SpringBootApplication enables:
 * - @Configuration: tags the class as a source of bean definitions for the application context.
 * - @EnableAutoConfiguration: tells Spring Boot to start adding beans based on classpath settings.
 * - @ComponentScan: tells Spring to look for other components, configurations, and services in the com.instanotes package.
 */
@SpringBootApplication
public class InstaNotesApplication {

    public static void main(String[] args) {
        SpringApplication.run(InstaNotesApplication.class, args);
    }
}
