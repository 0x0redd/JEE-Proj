package com.immobilier.app.service;

import com.immobilier.app.dto.DemandeDto;
import com.immobilier.app.entity.Demande;
import com.immobilier.app.entity.Demande.TypeDemande;
import com.immobilier.app.entity.Demande.TypeBien;
import com.immobilier.app.repository.DemandeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DemandeService {
    private final DemandeRepository demandeRepository;

    public Page<DemandeDto> findAllWithFilters(
            TypeDemande typeDemande,
            TypeBien typeBien,
            Double prixMin,
            Double prixMax,
            Double surfaceMin,
            Double surfaceMax,
            String searchKeyword,
            Pageable pageable) {
        return demandeRepository.findAllWithFilters(
                typeDemande, typeBien, prixMin, prixMax,
                surfaceMin, surfaceMax, searchKeyword, pageable)
                .map(DemandeDto::fromEntity);
    }

    public Optional<DemandeDto> findById(Long id) {
        return demandeRepository.findById(id)
                .map(DemandeDto::fromEntity);
    }

    public DemandeDto create(DemandeDto dto) {
        Demande demande = Demande.builder()
                .nomClient(dto.getNomClient())
                .prenomClient(dto.getPrenomClient())
                .telephoneClient(dto.getTelephoneClient())
                .typeDemande(dto.getTypeDemande())
                .typeBien(dto.getTypeBien())
                .surfaceDemandee(dto.getSurfaceDemandee())
                .nbChambres(dto.getNbChambres())
                .etageSouhaite(dto.getEtageSouhaite())
                .prixSouhaite(dto.getPrixSouhaite())
                .localisationSouhaitee(dto.getLocalisationSouhaitee())
                .notesSupplementaires(dto.getNotesSupplementaires())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return DemandeDto.fromEntity(demandeRepository.save(demande));
    }

    public Optional<DemandeDto> update(Long id, DemandeDto dto) {
        return demandeRepository.findById(id)
                .map(existingDemande -> {
                    Demande updatedDemande = Demande.builder()
                            .id(id)
                            .admin(existingDemande.getAdmin())
                            .nomClient(dto.getNomClient())
                            .prenomClient(dto.getPrenomClient())
                            .telephoneClient(dto.getTelephoneClient())
                            .typeDemande(dto.getTypeDemande())
                            .typeBien(dto.getTypeBien())
                            .surfaceDemandee(dto.getSurfaceDemandee())
                            .nbChambres(dto.getNbChambres())
                            .etageSouhaite(dto.getEtageSouhaite())
                            .prixSouhaite(dto.getPrixSouhaite())
                            .localisationSouhaitee(dto.getLocalisationSouhaitee())
                            .notesSupplementaires(dto.getNotesSupplementaires())
                            .createdAt(existingDemande.getCreatedAt())
                            .updatedAt(LocalDateTime.now())
                            .build();

                    return DemandeDto.fromEntity(demandeRepository.save(updatedDemande));
                });
    }

    public void delete(Long id) {
        demandeRepository.deleteById(id);
    }

    public java.util.List<DemandeDto> findAll() {
        return demandeRepository.findAll().stream().map(DemandeDto::fromEntity).toList();
    }
} 