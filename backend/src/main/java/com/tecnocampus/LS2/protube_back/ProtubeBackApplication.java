package com.tecnocampus.LS2.protube_back;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@OpenAPIDefinition(
		info = @Info(
				title = "Video Platform REST API",
				version = "1.0",
				description = "API documentation for managing videos, comments, likes, and user interactions."
		)
)
@SpringBootApplication
public class ProtubeBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProtubeBackApplication.class, args);
	}

}
