package com.immobilier.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "clients_profils")
public class ClientProfil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String nom;

    private String emailContact;
    private String telephoneContact;
    private String adresse;
    private String notes;
    private String criteresRecherche;
    private LocalDateTime dateCreation = LocalDateTime.now();
    private LocalDateTime dateModification;
}