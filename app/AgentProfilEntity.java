package com.immobilier.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "agents_profils")
public class AgentProfil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    private LocalDate dateEmbauche;
    private String specialisation;
    private LocalDateTime dateCreation = LocalDateTime.now();
    private LocalDateTime dateModification;
}