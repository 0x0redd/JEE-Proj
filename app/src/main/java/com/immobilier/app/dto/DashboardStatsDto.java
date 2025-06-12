package com.immobilier.app.dto;

import com.immobilier.app.entity.Demande;
import com.immobilier.app.entity.Offre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    private Long nombreTotalDemandes;
    private Long nombreTotalOffres;
    private Map<Demande.TypeBien, Long> repartitionTypeBienDemandes;
    private Map<Offre.TypeBien, Long> repartitionTypeBienOffres;
    private Double moyenneSurfaceDemandee;
    private Double moyenneSurfaceOfferte;
    private BigDecimal moyennePrixDemande;
    private BigDecimal moyennePrixOffert;
} 