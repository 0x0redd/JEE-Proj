package com.immobilier.app.dto;

import com.immobilier.app.entity.Demande;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DemandeDto {
    private Long id;
    private String nomClient;
    private String prenomClient;
    private String telephoneClient;
    private Demande.TypeDemande typeDemande;
    private Demande.TypeBien typeBien;
    private Integer surfaceDemandee;
    private Integer nbChambres;
    private Integer etageSouhaite;
    private BigDecimal prixSouhaite;
    private String localisationSouhaitee;
    private String notesSupplementaires;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    private AdminDto admin;

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
                .dateCreation(demande.getDateCreation())
                .dateModification(demande.getDateModification())
                .admin(AdminDto.fromEntity(demande.getAdmin()))
                .build();
    }
} 