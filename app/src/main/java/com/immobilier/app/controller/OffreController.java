package com.immobilier.app.controller;

import com.immobilier.app.dto.OffreDto;
import com.immobilier.app.entity.Offre;
import com.immobilier.app.entity.Offre.TypeBien;
import com.immobilier.app.service.OffreService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/offres")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class OffreController {
    private final OffreService offreService;

    @GetMapping
    public ResponseEntity<Page<OffreDto>> getAllOffres(
            @RequestParam(required = false) TypeBien typeBien,
            @RequestParam(required = false) Double prixMin,
            @RequestParam(required = false) Double prixMax,
            @RequestParam(required = false) Double surfaceMin,
            @RequestParam(required = false) Double surfaceMax,
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) String quartier,
            @RequestParam(required = false) String searchKeyword,
            Pageable pageable) {
        return ResponseEntity.ok(offreService.findAllWithFilters(
                typeBien, prixMin, prixMax, surfaceMin, surfaceMax,
                ville, quartier, searchKeyword, pageable));
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<OffreDto>> getPaginatedOffres(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) TypeBien typeBien,
            @RequestParam(required = false) Double prixMin,
            @RequestParam(required = false) Double prixMax,
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) String quartier,
            @RequestParam(required = false) String searchKeyword) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(offreService.findAllWithFilters(
                typeBien, prixMin, prixMax, null, null,
                ville, quartier, searchKeyword, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OffreDto> getOffreById(@PathVariable Long id) {
        return offreService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OffreDto> createOffre(@RequestBody OffreDto offreDto) {
        return ResponseEntity.ok(offreService.create(offreDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OffreDto> updateOffre(
            @PathVariable Long id,
            @RequestBody OffreDto offreDto) {
        return offreService.update(id, offreDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffre(@PathVariable Long id) {
        try {
            offreService.delete(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            System.err.println("Error in delete endpoint: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Unexpected error in delete endpoint: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile image) {
        try {
            String imageUrl = offreService.uploadImage(image);
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/photos")
    public ResponseEntity<OffreDto> uploadPhotos(
            @PathVariable Long id,
            @RequestParam("photos") List<MultipartFile> photos) {
        return offreService.addPhotos(id, photos)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public List<OffreDto> getAllOffersSimple() {
        return offreService.findAll().stream().map(OffreDto::fromEntity).toList();
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("OffreController is working!");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OffreDto> updateOffreStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusRequest) {
        try {
            String statusString = statusRequest.get("statutOffre");
            if (statusString == null) {
                return ResponseEntity.badRequest().build();
            }
            
            Offre.StatutOffre newStatus = Offre.StatutOffre.valueOf(statusString);
            return offreService.updateStatus(id, newStatus)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

