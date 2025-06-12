package com.immobilier.app.service;

import com.immobilier.app.dto.DashboardStatsDto;
import com.immobilier.app.entity.Demande;
import com.immobilier.app.entity.Offre;
import com.immobilier.app.repository.DemandeRepository;
import com.immobilier.app.repository.OffreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final DemandeRepository demandeRepository;
    private final OffreRepository offreRepository;

    public DashboardStatsDto getStatistics() {
        return DashboardStatsDto.builder()
                .nombreTotalDemandes(demandeRepository.count())
                .nombreTotalOffres(offreRepository.count())
                .repartitionTypeBienDemandes(getRepartitionTypeBienDemandes())
                .repartitionTypeBienOffres(getRepartitionTypeBienOffres())
                .moyenneSurfaceDemandee(calculateMoyenneSurfaceDemandee())
                .moyenneSurfaceOfferte(calculateMoyenneSurfaceOfferte())
                .moyennePrixDemande(calculateMoyennePrixDemande())
                .moyennePrixOffert(calculateMoyennePrixOffert())
                .build();
    }

    private Map<Demande.TypeBien, Long> getRepartitionTypeBienDemandes() {
        return Arrays.stream(Demande.TypeBien.values())
                .collect(Collectors.toMap(
                        type -> type,
                        type -> demandeRepository.countByTypeBien(type)
                ));
    }

    private Map<Offre.TypeBien, Long> getRepartitionTypeBienOffres() {
        return Arrays.stream(Offre.TypeBien.values())
                .collect(Collectors.toMap(
                        type -> type,
                        type -> offreRepository.countByTypeBien(type)
                ));
    }

    private Double calculateMoyenneSurfaceDemandee() {
        return demandeRepository.findAll().stream()
                .mapToInt(Demande::getSurfaceDemandee)
                .average()
                .orElse(0.0);
    }

    private Double calculateMoyenneSurfaceOfferte() {
        return offreRepository.findAll().stream()
                .mapToInt(Offre::getSurface)
                .average()
                .orElse(0.0);
    }

    private BigDecimal calculateMoyennePrixDemande() {
        return demandeRepository.findAll().stream()
                .map(Demande::getPrixSouhaite)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(demandeRepository.count()), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateMoyennePrixOffert() {
        return offreRepository.findAll().stream()
                .map(Offre::getPrixPropose)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(offreRepository.count()), 2, RoundingMode.HALF_UP);
    }
} 