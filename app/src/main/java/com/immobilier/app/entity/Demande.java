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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "demandes")
public class Demande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nomClient;

    @NotBlank
    @Column(nullable = false)
    private String prenomClient;

    @NotBlank
    @Column(nullable = false)
    private String telephoneClient;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeDemande typeDemande;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeBien typeBien;

    @Positive
    private Integer surfaceDemandee;

    private Integer nbChambres;

    private Integer etageSouhaite;

    @Column(precision = 10, scale = 2)
    private BigDecimal prixSouhaite;

    private String localisationSouhaitee;

    @Column(columnDefinition = "TEXT")
    private String notesSupplementaires;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime dateModification;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    public enum TypeDemande {
        ACHAT,
        LOYER,
        HYPOTHEQUE
    }

    public enum TypeBien {
        MAISON,
        IMMEUBLE,
        VILLA
    }
} 