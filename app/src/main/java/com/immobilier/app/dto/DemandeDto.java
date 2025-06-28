package com.immobilier.app.dto;

import com.immobilier.app.entity.Demande;
import com.immobilier.app.entity.Demande.TypeDemande;
import com.immobilier.app.entity.Demande.TypeBien;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemandeDto {
    private Long id;
    private String nomClient;
    private String prenomClient;
    private String telephoneClient;
    private TypeDemande typeDemande;
    private TypeBien typeBien;
    private Double surfaceDemandee;
    private Integer nbChambres;
    private Integer etageSouhaite;
    private Double prixSouhaite;
    private String localisationSouhaitee;
    private String notesSupplementaires;
    private LocalDateTime createdAt;

    public static DemandeDto fromEntity(Demande demande) {
        return DemandeDto.builder()
                .id(demande.getId())
                .nomClient(demande.getNomClient())
                .prenomClient(demande.getPrenomClient())
                .telephoneClient(demande.getTelephoneClient())
                .typeDemande(demande.getTypeDemande())
                .typeBien(demande.getTypeBien())
                .surfaceDemandee(demande.getSurfaceDemandee())
                .nbChambres(demande.getNbChambres())
                .etageSouhaite(demande.getEtageSouhaite())
                .prixSouhaite(demande.getPrixSouhaite())
                .localisationSouhaitee(demande.getLocalisationSouhaitee())
                .notesSupplementaires(demande.getNotesSupplementaires())
                .createdAt(demande.getCreatedAt())
                .build();
    }
} 