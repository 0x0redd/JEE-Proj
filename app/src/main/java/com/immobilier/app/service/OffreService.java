package com.immobilier.app.service;

import com.immobilier.app.dto.OffreDto;
import com.immobilier.app.entity.Admin;
import com.immobilier.app.entity.Offre;
import com.immobilier.app.repository.AdminRepository;
import com.immobilier.app.repository.OffreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class OffreService {

    private final OffreRepository offreRepository;
    private final AdminRepository adminRepository;
    private final Path uploadDir = Paths.get("uploads/photos");

    public OffreDto createOffre(OffreDto offreDto) {
        Admin currentAdmin = getCurrentAdmin();
        Offre offre = mapToEntity(offreDto);
        offre.setAdmin(currentAdmin);
        return OffreDto.fromEntity(offreRepository.save(offre));
    }

    public Page<OffreDto> getAllOffres(
            Offre.TypeBien typeBien,
            BigDecimal prixMin,
            BigDecimal prixMax,
            Integer surfaceMin,
            Integer surfaceMax,
            String ville,
            String quartier,
            String searchKeyword,
            Pageable pageable
    ) {
        return offreRepository.findAllWithFilters(
                typeBien, prixMin, prixMax, surfaceMin, surfaceMax,
                ville, quartier, searchKeyword, pageable
        ).map(OffreDto::fromEntity);
    }

    public OffreDto getOffreById(Long id) {
        return OffreDto.fromEntity(findOffreById(id));
    }

    public OffreDto updateOffre(Long id, OffreDto offreDto) {
        Offre existingOffre = findOffreById(id);
        Offre updatedOffre = mapToEntity(offreDto);
        updatedOffre.setId(id);
        updatedOffre.setAdmin(existingOffre.getAdmin());
        updatedOffre.setPhotos(existingOffre.getPhotos());
        return OffreDto.fromEntity(offreRepository.save(updatedOffre));
    }

    public void deleteOffre(Long id) {
        Offre offre = findOffreById(id);
        // Delete associated photos
        for (String photoUrl : offre.getPhotos()) {
            try {
                Files.deleteIfExists(Paths.get(photoUrl));
            } catch (IOException e) {
                // Log error but continue with deletion
            }
        }
        offreRepository.deleteById(id);
    }

    public List<String> uploadPhotos(Long id, List<MultipartFile> files) {
        Offre offre = findOffreById(id);
        List<String> photoUrls = new ArrayList<>();

        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            for (MultipartFile file : files) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadDir.resolve(fileName);
                Files.copy(file.getInputStream(), filePath);
                photoUrls.add(filePath.toString());
            }

            offre.getPhotos().addAll(photoUrls);
            offreRepository.save(offre);
            return photoUrls;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload photos", e);
        }
    }

    private Offre findOffreById(Long id) {
        return offreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Offre not found with id: " + id));
    }

    private Admin getCurrentAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return adminRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Admin not found"));
    }

    private Offre mapToEntity(OffreDto dto) {
        return Offre.builder()
                .nomProprietaire(dto.getNomProprietaire())
                .prenomProprietaire(dto.getPrenomProprietaire())
                .telephoneProprietaire(dto.getTelephoneProprietaire())
                .adresseBien(dto.getAdresseBien())
                .surface(dto.getSurface())
                .etage(dto.getEtage())
                .typeBien(dto.getTypeBien())
                .prixPropose(dto.getPrixPropose())
                .localisationVille(dto.getLocalisationVille())
                .localisationQuartier(dto.getLocalisationQuartier())
                .descriptionBien(dto.getDescriptionBien())
                .nbChambresOffre(dto.getNbChambresOffre())
                .statutOffre(dto.getStatutOffre())
                .build();
    }
} 