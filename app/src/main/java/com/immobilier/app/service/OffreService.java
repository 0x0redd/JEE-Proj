package com.immobilier.app.service;

import com.immobilier.app.dto.OffreDto;
import com.immobilier.app.entity.Offre;
import com.immobilier.app.entity.Offre.TypeBien;
import com.immobilier.app.entity.OffrePhoto;
import com.immobilier.app.repository.OffreRepository;
import com.immobilier.app.repository.OffrePhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OffreService {
    private final OffreRepository offreRepository;
    private final OffrePhotoRepository offrePhotoRepository;
    
    // Directory to store uploaded images
    private static final String UPLOAD_DIR = "../front/public/images/offers";

    public String uploadImage(MultipartFile image) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = image.getOriginalFilename();
        String fileExtension = originalFilename != null ? 
            originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String filename = UUID.randomUUID().toString() + fileExtension;
        
        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(image.getInputStream(), filePath);
        
        // Return the URL path (relative to public folder)
        return "/images/offers/" + filename;
    }

    public Page<OffreDto> findAllWithFilters(
            TypeBien typeBien,
            Double prixMin,
            Double prixMax,
            Double surfaceMin,
            Double surfaceMax,
            String ville,
            String quartier,
            String searchKeyword,
            Pageable pageable) {
        return offreRepository.findAllWithFilters(
                typeBien, prixMin, prixMax, surfaceMin, surfaceMax,
                ville, quartier, searchKeyword, pageable)
                .map(OffreDto::fromEntity);
    }

    public Optional<OffreDto> findById(Long id) {
        return offreRepository.findById(id)
                .map(OffreDto::fromEntity);
    }

    public OffreDto create(OffreDto dto) {
        // Create the offer first
        Offre offre = Offre.builder()
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
                .statutOffre(dto.getStatutOffre() != null ? dto.getStatutOffre() : Offre.StatutOffre.DISPONIBLE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Offre savedOffre = offreRepository.save(offre);

        // Temporarily disabled photo saving until database migration is applied
        /*
        // Save photos to the separate table
        if (dto.getPhotos() != null && !dto.getPhotos().isEmpty()) {
            for (String photoUrl : dto.getPhotos()) {
                OffrePhoto photo = OffrePhoto.builder()
                        .offre(savedOffre)
                        .photoUrl(photoUrl)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                offrePhotoRepository.save(photo);
            }
        }
        */

        return OffreDto.fromEntity(savedOffre);
    }

    public Optional<OffreDto> update(Long id, OffreDto dto) {
        return offreRepository.findById(id)
                .map(existingOffre -> {
                    Offre updatedOffre = Offre.builder()
                            .id(id)
                            .admin(existingOffre.getAdmin())
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
                            .createdAt(existingOffre.getCreatedAt())
                            .updatedAt(LocalDateTime.now())
                            .build();

                    return OffreDto.fromEntity(offreRepository.save(updatedOffre));
                });
    }

    public void delete(Long id) {
        try {
            // Check if the offer exists first
            if (!offreRepository.existsById(id)) {
                throw new RuntimeException("Offer with ID " + id + " not found");
            }
            
            // Temporarily disabled photo deletion until database migration is applied
            /*
            // Delete photos first
            offrePhotoRepository.deleteByOffreId(id);
            */
            
            // Then delete the offer
            offreRepository.deleteById(id);
            
            System.out.println("Successfully deleted offer with ID: " + id);
        } catch (Exception e) {
            System.err.println("Error deleting offer with ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete offer: " + e.getMessage(), e);
        }
    }

    public Optional<OffreDto> addPhotos(Long id, List<MultipartFile> photos) {
        // Temporarily disabled until database migration is applied
        return offreRepository.findById(id)
                .map(offre -> OffreDto.fromEntity(offre));
        
        /*
        return offreRepository.findById(id)
                .map(offre -> {
                    // Add new photo URLs to the separate table
                    for (MultipartFile photo : photos) {
                        try {
                            String photoUrl = uploadImage(photo);
                            OffrePhoto offrePhoto = OffrePhoto.builder()
                                    .offre(offre)
                                    .photoUrl(photoUrl)
                                    .createdAt(LocalDateTime.now())
                                    .updatedAt(LocalDateTime.now())
                                    .build();
                            offrePhotoRepository.save(offrePhoto);
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to upload photo", e);
                        }
                    }
                    return OffreDto.fromEntity(offre);
                });
        */
    }

    public List<Offre> findAll() {
        return offreRepository.findAll();
    }
} 