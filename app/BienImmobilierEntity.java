package com.immobilier.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "biens_immobiliers")
public class BienImmobilier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;
    
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyType typeBien;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyStatus statut = PropertyStatus.A_VENDRE;

    private BigDecimal prix;
    private String adresseRue;
    private String adresseVille;
    private String adresseCodePostal;
    private String adressePays = "France";
    private String localisationDetails;
    private Integer surfaceHabitable;
    private Integer nombrePieces;
    private Integer nombreChambres;
    private Integer etage;
    private Boolean presenceAscenseur = false;
    private Boolean balconTerrasse = false;
    private Boolean jardin = false;
    private Boolean parkingGarage = false;
    private Integer anneeConstruction;
    private String dpe;

    @ManyToOne
    @JoinColumn(name = "agent_responsable_id")
    private AgentProfil agentResponsable;

    private LocalDateTime dateAjout = LocalDateTime.now();
    private LocalDateTime dateModification;
}