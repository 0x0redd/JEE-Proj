package com.immobilier.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig implements WebMvcConfigurer {

    @Value("${app.file.upload-dir:../front/public/uploads}")
    private String uploadDir;

    @Value("${app.file.upload-path:/uploads}")
    private String uploadPath;

    public Path getUploadPath() {
        return Paths.get(uploadDir);
    }

    public String getUploadDir() {
        return uploadDir;
    }

    public String getUploadPathString() {
        return uploadPath;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files statically
        registry.addResourceHandler(uploadPath + "/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
} 