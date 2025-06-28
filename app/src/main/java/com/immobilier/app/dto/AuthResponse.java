package com.immobilier.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String message;
    private boolean success;

    public AuthResponse(Long id, String name, String email, String phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.success = true;
    }

    public static AuthResponse error(String message) {
        AuthResponse response = new AuthResponse();
        response.setMessage(message);
        response.setSuccess(false);
        return response;
    }
} 