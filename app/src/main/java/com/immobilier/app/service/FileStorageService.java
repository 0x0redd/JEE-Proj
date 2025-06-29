package com.immobilier.app.service;

import com.immobilier.app.config.FileStorageConfig;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final FileStorageConfig fileStorageConfig;

    public FileStorageService(FileStorageConfig fileStorageConfig) {
        this.fileStorageConfig = fileStorageConfig;
    }

    public String storeFile(MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Get file extension
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Generate unique filename
        String filename = UUID.randomUUID().toString() + fileExtension;

        // Create upload directory if it doesn't exist
        Path uploadPath = fileStorageConfig.getUploadPath();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Create subdirectories for better organization (by year/month)
        java.time.LocalDate now = java.time.LocalDate.now();
        Path yearMonthPath = uploadPath.resolve(String.valueOf(now.getYear()))
                .resolve(String.format("%02d", now.getMonthValue()));
        
        if (!Files.exists(yearMonthPath)) {
            Files.createDirectories(yearMonthPath);
        }

        // Save file
        Path targetPath = yearMonthPath.resolve(filename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Return the URL path for frontend access
        return fileStorageConfig.getUploadPathString() + "/" + 
               now.getYear() + "/" + 
               String.format("%02d", now.getMonthValue()) + "/" + 
               filename;
    }

    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl != null && fileUrl.startsWith(fileStorageConfig.getUploadPathString())) {
                String relativePath = fileUrl.substring(fileStorageConfig.getUploadPathString().length());
                Path filePath = fileStorageConfig.getUploadPath().resolve(relativePath.substring(1));
                
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
            }
        } catch (IOException e) {
            // Log error but don't throw exception for file deletion failures
            System.err.println("Failed to delete file: " + fileUrl + " - " + e.getMessage());
        }
    }

    public boolean fileExists(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith(fileStorageConfig.getUploadPathString())) {
            return false;
        }
        
        String relativePath = fileUrl.substring(fileStorageConfig.getUploadPathString().length());
        Path filePath = fileStorageConfig.getUploadPath().resolve(relativePath.substring(1));
        return Files.exists(filePath);
    }
} 