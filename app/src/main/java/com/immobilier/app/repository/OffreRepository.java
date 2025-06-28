package com.immobilier.app.repository;

import com.immobilier.app.entity.Offre;
import com.immobilier.app.entity.Offre.TypeBien;
import com.immobilier.app.entity.Offre.StatutOffre;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OffreRepository extends JpaRepository<Offre, Long> {
    @Query("SELECT o FROM Offre o WHERE " +
           "(:typeBien IS NULL OR o.typeBien = :typeBien) AND " +
           "(:prixMin IS NULL OR o.prixPropose >= :prixMin) AND " +
           "(:prixMax IS NULL OR o.prixPropose <= :prixMax) AND " +
           "(:surfaceMin IS NULL OR o.surface >= :surfaceMin) AND " +
           "(:surfaceMax IS NULL OR o.surface <= :surfaceMax) AND " +
           "(:ville IS NULL OR o.localisationVille = :ville) AND " +
           "(:quartier IS NULL OR o.localisationQuartier = :quartier) AND " +
           "(:searchKeyword IS NULL OR " +
           "LOWER(o.nomProprietaire) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
           "LOWER(o.prenomProprietaire) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
           "LOWER(o.adresseBien) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
           "LOWER(o.descriptionBien) LIKE LOWER(CONCAT('%', :searchKeyword, '%')))")
    Page<Offre> findAllWithFilters(
        @Param("typeBien") TypeBien typeBien,
        @Param("prixMin") Double prixMin,
        @Param("prixMax") Double prixMax,
        @Param("surfaceMin") Double surfaceMin,
        @Param("surfaceMax") Double surfaceMax,
        @Param("ville") String ville,
        @Param("quartier") String quartier,
        @Param("searchKeyword") String searchKeyword,
        Pageable pageable
    );
} 