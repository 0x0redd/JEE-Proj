package com.immobilier.app.service;

import com.immobilier.app.dto.DemandeDto;
import com.immobilier.app.entity.Admin;
import com.immobilier.app.entity.Demande;
import com.immobilier.app.repository.AdminRepository;
import com.immobilier.app.repository.DemandeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class DemandeService {

    private final DemandeRepository demandeRepository;
    private final AdminRepository adminRepository;

    public DemandeDto createDemande(DemandeDto demandeDto) {
        Admin currentAdmin = getCurrentAdmin();
        Demande demande = mapToEntity(demandeDto);
        demande.setAdmin(currentAdmin);
        return DemandeDto.fromEntity(demandeRepository.save(demande));
    }

    public Page<DemandeDto> getAllDemandes(
            Demande.TypeDemande typeDemande,
            Demande.TypeBien typeBien,
            BigDecimal prixMin,
            BigDecimal prixMax,
            Integer surfaceMin,
            Integer surfaceMax,
            String searchKeyword,
            Pageable pageable
    ) {
        return demandeRepository.findAllWithFilters(
                typeDemande, typeBien, prixMin, prixMax,
                surfaceMin, surfaceMax, searchKeyword, pageable
        ).map(DemandeDto::fromEntity);
    }

    public DemandeDto getDemandeById(Long id) {
        return DemandeDto.fromEntity(findDemandeById(id));
    }

    public DemandeDto updateDemande(Long id, DemandeDto demandeDto) {
        Demande existingDemande = findDemandeById(id);
        Demande updatedDemande = mapToEntity(demandeDto);
        updatedDemande.setId(id);
        updatedDemande.setAdmin(existingDemande.getAdmin());
        return DemandeDto.fromEntity(demandeRepository.save(updatedDemande));
    }

    public void deleteDemande(Long id) {
        if (!demandeRepository.existsById(id)) {
            throw new EntityNotFoundException("Demande not found with id: " + id);
        }
        demandeRepository.deleteById(id);
    }

    private Demande findDemandeById(Long id) {
        return demandeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Demande not found with id: " + id));
    }

    private Admin getCurrentAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return adminRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Admin not found"));
    }

    private Demande mapToEntity(DemandeDto dto) {
        return Demande.builder()
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
                .build();
    }
} 