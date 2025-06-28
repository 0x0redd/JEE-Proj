package com.immobilier.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "admins")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    // Temporary field for database transition
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String phone;
    
    private String address;
    
    private Integer age;
    
    // Computed field for full name
    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    // Method to set name automatically when firstName or lastName changes
    @PrePersist
    @PreUpdate
    public void setNameFromFirstAndLast() {
        this.name = this.firstName + " " + this.lastName;
    }
} 