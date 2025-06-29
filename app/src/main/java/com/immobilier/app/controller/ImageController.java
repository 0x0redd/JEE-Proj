package com.immobilier.app.controller;

import com.immobilier.app.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ImageController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("image") MultipartFile image) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate file
            if (image.isEmpty()) {
                response.put("error", "Please select a file to upload");
                return ResponseEntity.badRequest().body(response);
            }

            // Store file and get URL
            String imageUrl = fileStorageService.storeFile(image);
            
            response.put("success", true);
            response.put("imageUrl", imageUrl);
            response.put("message", "Image uploaded successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (IOException e) {
            response.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteImage(@RequestParam("imageUrl") String imageUrl) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            fileStorageService.deleteFile(imageUrl);
            response.put("success", true);
            response.put("message", "Image deleted successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("error", "Failed to delete image: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/exists")
    public ResponseEntity<Map<String, Object>> checkImageExists(@RequestParam("imageUrl") String imageUrl) {
        Map<String, Object> response = new HashMap<>();
        
        boolean exists = fileStorageService.fileExists(imageUrl);
        response.put("exists", exists);
        response.put("imageUrl", imageUrl);
        
        return ResponseEntity.ok(response);
    }
} 