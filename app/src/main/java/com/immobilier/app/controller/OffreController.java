package com.immobilier.app.controller;

import com.immobilier.app.dto.OffreDto;
import com.immobilier.app.entity.Offre;
import com.immobilier.app.service.OffreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/offres")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OffreController {

    private final OffreService offreService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OffreDto> createOffre(@Valid @RequestBody OffreDto offreDto) {
        return ResponseEntity.ok(offreService.createOffre(offreDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OffreDto>> getAllOffres(
            @RequestParam(required = false) Offre.TypeBien typeBien,
            @RequestParam(required = false) BigDecimal prixMin,
            @RequestParam(required = false) BigDecimal prixMax,
            @RequestParam(required = false) Integer surfaceMin,
            @RequestParam(required = false) Integer surfaceMax,
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) String quartier,
            @RequestParam(required = false) String searchKeyword,
            Pageable pageable
    ) {
        return ResponseEntity.ok(offreService.getAllOffres(
                typeBien, prixMin, prixMax, surfaceMin, surfaceMax,
                ville, quartier, searchKeyword, pageable
        ));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OffreDto> getOffreById(@PathVariable Long id) {
        return ResponseEntity.ok(offreService.getOffreById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OffreDto> updateOffre(
            @PathVariable Long id,
            @Valid @RequestBody OffreDto offreDto
    ) {
        return ResponseEntity.ok(offreService.updateOffre(id, offreDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOffre(@PathVariable Long id) {
        offreService.deleteOffre(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/photos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> uploadPhotos(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files
    ) {
        return ResponseEntity.ok(offreService.uploadPhotos(id, files));
    }
} 