package com.immobilier.app.dto;

import com.immobilier.app.entity.Admin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDto {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String adresse;
    private String telephone;
    private Integer age;
    private Admin.Role role;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;

    public static AdminDto fromEntity(Admin admin) {
        return AdminDto.builder()
                .id(admin.getId())
                .nom(admin.getNom())
                .prenom(admin.getPrenom())
                .email(admin.getEmail())
                .adresse(admin.getAdresse())
                .telephone(admin.getTelephone())
                .age(admin.getAge())
                .role(admin.getRole())
                .dateCreation(admin.getDateCreation())
                .dateModification(admin.getDateModification())
                .build();
    }
} 