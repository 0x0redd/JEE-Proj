package com.immobilier.app.config;

import com.immobilier.app.entity.Admin;
import com.immobilier.app.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;

    @Override
    public void run(String... args) {
        // Check if default admin already exists
        if (adminRepository.findByEmail("admin@example.com").isEmpty()) {
            Admin defaultAdmin = Admin.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .name("Admin User")
                    .email("admin@example.com")
                    .password("admin")
                    .phone("0612345678")
                    .build();
            
            adminRepository.save(defaultAdmin);
            System.out.println("Default admin user created successfully!");
        }
    }
} 