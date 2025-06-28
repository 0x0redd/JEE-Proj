package com.immobilier.app.controller;

import com.immobilier.app.dto.DemandeDto;
import com.immobilier.app.entity.Demande.TypeDemande;
import com.immobilier.app.entity.Demande.TypeBien;
import com.immobilier.app.service.DemandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/demandes")
@RequiredArgsConstructor
public class DemandeController {
    private final DemandeService demandeService;

    @GetMapping
    public ResponseEntity<Page<DemandeDto>> getAllDemandes(
            @RequestParam(required = false) TypeDemande typeDemande,
            @RequestParam(required = false) TypeBien typeBien,
            @RequestParam(required = false) Double prixMin,
            @RequestParam(required = false) Double prixMax,
            @RequestParam(required = false) Double surfaceMin,
            @RequestParam(required = false) Double surfaceMax,
            @RequestParam(required = false) String searchKeyword,
            Pageable pageable) {
        return ResponseEntity.ok(demandeService.findAllWithFilters(
                typeDemande, typeBien, prixMin, prixMax,
                surfaceMin, surfaceMax, searchKeyword, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DemandeDto> getDemandeById(@PathVariable Long id) {
        return demandeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DemandeDto> createDemande(@RequestBody DemandeDto demandeDto) {
        return ResponseEntity.ok(demandeService.create(demandeDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DemandeDto> updateDemande(
            @PathVariable Long id,
            @RequestBody DemandeDto demandeDto) {
        return demandeService.update(id, demandeDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemande(@PathVariable Long id) {
        demandeService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<java.util.List<DemandeDto>> getAllDemandesSimple() {
        return ResponseEntity.ok(demandeService.findAll());
    }
} 