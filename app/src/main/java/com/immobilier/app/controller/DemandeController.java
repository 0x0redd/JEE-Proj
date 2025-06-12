package com.immobilier.app.controller;

import com.immobilier.app.dto.DemandeDto;
import com.immobilier.app.entity.Demande;
import com.immobilier.app.service.DemandeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/demandes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DemandeController {

    private final DemandeService demandeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DemandeDto> createDemande(@Valid @RequestBody DemandeDto demandeDto) {
        return ResponseEntity.ok(demandeService.createDemande(demandeDto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DemandeDto>> getAllDemandes(
            @RequestParam(required = false) Demande.TypeDemande typeDemande,
            @RequestParam(required = false) Demande.TypeBien typeBien,
            @RequestParam(required = false) BigDecimal prixMin,
            @RequestParam(required = false) BigDecimal prixMax,
            @RequestParam(required = false) Integer surfaceMin,
            @RequestParam(required = false) Integer surfaceMax,
            @RequestParam(required = false) String searchKeyword,
            Pageable pageable
    ) {
        return ResponseEntity.ok(demandeService.getAllDemandes(
                typeDemande, typeBien, prixMin, prixMax,
                surfaceMin, surfaceMax, searchKeyword, pageable
        ));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DemandeDto> getDemandeById(@PathVariable Long id) {
        return ResponseEntity.ok(demandeService.getDemandeById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DemandeDto> updateDemande(
            @PathVariable Long id,
            @Valid @RequestBody DemandeDto demandeDto
    ) {
        return ResponseEntity.ok(demandeService.updateDemande(id, demandeDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDemande(@PathVariable Long id) {
        demandeService.deleteDemande(id);
        return ResponseEntity.noContent().build();
    }
} 