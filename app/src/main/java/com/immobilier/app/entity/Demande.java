package com.immobilier.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "demandes")
public class Demande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomClient;

    @Column(nullable = false)
    private String prenomClient;

    @Column(nullable = false)
    private String telephoneClient;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeDemande typeDemande;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeBien typeBien;

    private Double surfaceDemandee;
    private Integer nbChambres;
    private Integer etageSouhaite;
    private Double prixSouhaite;
    private String localisationSouhaitee;

    @Column(columnDefinition = "TEXT")
    private String notesSupplementaires;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TypeDemande {
        ACHAT,
        LOCATION
    }

    public enum TypeBien {
        APPARTEMENT,
        VILLA,
        BUREAUX,
        COMMERCE,
        TERRAIN
    }
} 