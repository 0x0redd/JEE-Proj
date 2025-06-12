package com.immobilier.app.dto;

import com.immobilier.app.entity.Offre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OffreDto {
    private Long id;
    private String nomProprietaire;
    private String prenomProprietaire;
    private String telephoneProprietaire;
    private String adresseBien;
    private Integer surface;
    private Integer etage;
    private Offre.TypeBien typeBien;
    private BigDecimal prixPropose;
    private String localisationVille;
    private String localisationQuartier;
    private String descriptionBien;
    private Integer nbChambresOffre;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    private Offre.StatutOffre statutOffre;
    private List<String> photos;
    private AdminDto admin;

    public static OffreDto fromEntity(Offre offre) {
        return OffreDto.builder()
                .id(offre.getId())
                .nomProprietaire(offre.getNomProprietaire())
                .prenomProprietaire(offre.getPrenomProprietaire())
                .telephoneProprietaire(offre.getTelephoneProprietaire())
                .adresseBien(offre.getAdresseBien())
                .surface(offre.getSurface())
                .etage(offre.getEtage())
                .typeBien(offre.getTypeBien())
                .prixPropose(offre.getPrixPropose())
                .localisationVille(offre.getLocalisationVille())
                .localisationQuartier(offre.getLocalisationQuartier())
                .descriptionBien(offre.getDescriptionBien())
                .nbChambresOffre(offre.getNbChambresOffre())
                .dateCreation(offre.getDateCreation())
                .dateModification(offre.getDateModification())
                .statutOffre(offre.getStatutOffre())
                .photos(offre.getPhotos())
                .admin(AdminDto.fromEntity(offre.getAdmin()))
                .build();
    }
} 