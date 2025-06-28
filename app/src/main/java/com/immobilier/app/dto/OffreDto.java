package com.immobilier.app.dto;

import com.immobilier.app.entity.Offre;
import com.immobilier.app.entity.Offre.TypeBien;
import com.immobilier.app.entity.Offre.StatutOffre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OffreDto {
    private Long id;
    private String nomProprietaire;
    private String prenomProprietaire;
    private String telephoneProprietaire;
    private String adresseBien;
    private Double surface;
    private Integer etage;
    private TypeBien typeBien;
    private Double prixPropose;
    private String localisationVille;
    private String localisationQuartier;
    private String descriptionBien;
    private Integer nbChambresOffre;
    private StatutOffre statutOffre;
    private List<String> photos;
    private LocalDateTime createdAt;

    public static OffreDto fromEntity(Offre offre) {
        // Temporarily disable photo loading to prevent database errors
        // while migrations are being applied
        List<String> photoUrls = List.of();
        
        // TODO: Re-enable this once the offre_photos table is properly created
        /*
        List<String> photoUrls = offre.getPhotos() != null ? 
            offre.getPhotos().stream()
                .map(photo -> photo.getPhotoUrl())
                .collect(Collectors.toList()) : 
            List.of();
        */
            
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
                .statutOffre(offre.getStatutOffre())
                .photos(photoUrls)
                .createdAt(offre.getCreatedAt())
                .build();
    }
} 