package com.immobilier.app.repository;

import com.immobilier.app.entity.Offre;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface OffreRepository extends JpaRepository<Offre, Long> {
    @Query("SELECT o FROM Offre o WHERE " +
            "(:typeBien IS NULL OR o.typeBien = :typeBien) AND " +
            "(:prixMin IS NULL OR o.prixPropose >= :prixMin) AND " +
            "(:prixMax IS NULL OR o.prixPropose <= :prixMax) AND " +
            "(:surfaceMin IS NULL OR o.surface >= :surfaceMin) AND " +
            "(:surfaceMax IS NULL OR o.surface <= :surfaceMax) AND " +
            "(:ville IS NULL OR LOWER(o.localisationVille) LIKE LOWER(CONCAT('%', :ville, '%'))) AND " +
            "(:quartier IS NULL OR LOWER(o.localisationQuartier) LIKE LOWER(CONCAT('%', :quartier, '%'))) AND " +
            "(:searchKeyword IS NULL OR " +
            "LOWER(o.nomProprietaire) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
            "LOWER(o.prenomProprietaire) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
            "LOWER(o.adresseBien) LIKE LOWER(CONCAT('%', :searchKeyword, '%')))")
    Page<Offre> findAllWithFilters(
            @Param("typeBien") Offre.TypeBien typeBien,
            @Param("prixMin") BigDecimal prixMin,
            @Param("prixMax") BigDecimal prixMax,
            @Param("surfaceMin") Integer surfaceMin,
            @Param("surfaceMax") Integer surfaceMax,
            @Param("ville") String ville,
            @Param("quartier") String quartier,
            @Param("searchKeyword") String searchKeyword,
            Pageable pageable
    );

    long countByTypeBien(Offre.TypeBien typeBien);
} 