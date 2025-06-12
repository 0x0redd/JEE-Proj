package com.immobilier.app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "offres")
public class Offre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nomProprietaire;

    @NotBlank
    @Column(nullable = false)
    private String prenomProprietaire;

    @NotBlank
    @Column(nullable = false)
    private String telephoneProprietaire;

    @NotBlank
    @Column(nullable = false)
    private String adresseBien;

    @Positive
    @Column(nullable = false)
    private Integer surface;

    private Integer etage;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeBien typeBien;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prixPropose;

    @NotBlank
    @Column(nullable = false)
    private String localisationVille;

    private String localisationQuartier;

    @Column(columnDefinition = "TEXT")
    private String descriptionBien;

    private Integer nbChambresOffre;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime dateModification;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutOffre statutOffre = StatutOffre.DISPONIBLE;

    @ElementCollection
    @CollectionTable(name = "offre_photos", joinColumns = @JoinColumn(name = "offre_id"))
    @Column(name = "photo_url")
    private List<String> photos = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    public enum TypeBien {
        MAISON,
        IMMEUBLE,
        VILLA
    }

    public enum StatutOffre {
        DISPONIBLE,
        EN_COURS,
        VENDU_LOUE,
        RETIRE
    }
} 