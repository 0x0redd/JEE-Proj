package com.immobilier.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "offres")
public class Offre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomProprietaire;

    @Column(nullable = false)
    private String prenomProprietaire;

    @Column(nullable = false)
    private String telephoneProprietaire;

    @Column(nullable = false)
    private String adresseBien;

    private Double surface;
    private Integer etage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeBien typeBien;

    @Column(nullable = false)
    private Double prixPropose;

    @Column(nullable = false)
    private String localisationVille;

    @Column(nullable = false)
    private String localisationQuartier;

    @Column(columnDefinition = "TEXT")
    private String descriptionBien;

    private Integer nbChambresOffre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutOffre statutOffre;

    @OneToMany(mappedBy = "offre", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OffrePhoto> photos;

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

    public enum TypeBien {
        APPARTEMENT,
        VILLA,
        BUREAUX,
        COMMERCE,
        TERRAIN
    }

    public enum StatutOffre {
        DISPONIBLE,
        RESERVE,
        VENDU
    }
} 