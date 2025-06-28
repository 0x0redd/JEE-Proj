package com.immobilier.app.controller;

import com.immobilier.app.dto.AuthResponse;
import com.immobilier.app.dto.RegisterRequest;
import com.immobilier.app.entity.Admin;
import com.immobilier.app.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/auth/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            logger.info("Login attempt for email: {}", request.getEmail());
            
            if (request.getEmail() == null || request.getPassword() == null) {
                logger.warn("Login failed: Email or password is null");
                return ResponseEntity.badRequest().body(AuthResponse.error("Email and password are required"));
            }
            
            return adminService.findByEmail(request.getEmail())
                    .map(admin -> {
                        logger.info("Found admin with email: {}", admin.getEmail());
                        if (admin.getPassword().equals(request.getPassword())) {
                            logger.info("Password match successful for admin: {}", admin.getEmail());
                            return ResponseEntity.ok(new AuthResponse(
                                admin.getId(),
                                admin.getFullName(),
                                admin.getEmail(),
                                admin.getPhone()
                            ));
                        } else {
                            logger.warn("Password mismatch for admin: {}", admin.getEmail());
                            return ResponseEntity.badRequest().body(AuthResponse.error("Invalid credentials"));
                        }
                    })
                    .orElseGet(() -> {
                        logger.warn("No admin found with email: {}", request.getEmail());
                        return ResponseEntity.badRequest().body(AuthResponse.error("Invalid credentials"));
                    });
        } catch (Exception e) {
            logger.error("Login failed with error: ", e);
            return ResponseEntity.badRequest().body(AuthResponse.error("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/auth/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            logger.info("Registration attempt for email: {}", request.getEmail());
            
            // Validation
            if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("First name is required"));
            }
            
            if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Last name is required"));
            }
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Email is required"));
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Password is required"));
            }
            
            if (request.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Password must be at least 6 characters long"));
            }
            
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Passwords do not match"));
            }
            
            // Check if email already exists
            if (adminService.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(AuthResponse.error("Email already exists"));
            }
            
            // Create admin entity
            Admin admin = Admin.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .name(request.getFirstName() + " " + request.getLastName())
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .phone(request.getPhone() != null ? request.getPhone() : "")
                    .address(request.getAddress())
                    .age(request.getAge())
                    .build();
            
            Admin createdAdmin = adminService.createAdmin(admin);
            logger.info("Admin created successfully with ID: {}", createdAdmin.getId());
            
            return ResponseEntity.ok(new AuthResponse(
                createdAdmin.getId(),
                createdAdmin.getFullName(),
                createdAdmin.getEmail(),
                createdAdmin.getPhone()
            ));
        } catch (Exception e) {
            logger.error("Registration failed with error: ", e);
            return ResponseEntity.badRequest().body(AuthResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/auth/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> getProfile(@RequestParam String email) {
        return adminService.findByEmail(email)
                .map(admin -> ResponseEntity.ok(new AuthResponse(
                    admin.getId(),
                    admin.getFullName(),
                    admin.getEmail(),
                    admin.getPhone()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/auth/profile", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> updateProfile(@RequestParam String email, @RequestBody Admin admin) {
        return adminService.findByEmail(email)
                .map(existingAdmin -> {
                    admin.setId(existingAdmin.getId());
                    Admin updatedAdmin = adminService.updateAdmin(existingAdmin.getId(), admin);
                    return ResponseEntity.ok(new AuthResponse(
                        updatedAdmin.getId(),
                        updatedAdmin.getFullName(),
                        updatedAdmin.getEmail(),
                        updatedAdmin.getPhone()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok().build();
    }
}

class LoginRequest {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
} 