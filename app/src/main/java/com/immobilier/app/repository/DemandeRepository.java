package com.immobilier.app.repository;

import com.immobilier.app.entity.Demande;
import com.immobilier.app.entity.Demande.TypeDemande;
import com.immobilier.app.entity.Demande.TypeBien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DemandeRepository extends JpaRepository<Demande, Long> {
    @Query("SELECT d FROM Demande d WHERE " +
           "(:typeDemande IS NULL OR d.typeDemande = :typeDemande) AND " +
           "(:typeBien IS NULL OR d.typeBien = :typeBien) AND " +
           "(:prixMin IS NULL OR d.prixSouhaite >= :prixMin) AND " +
           "(:prixMax IS NULL OR d.prixSouhaite <= :prixMax) AND " +
           "(:surfaceMin IS NULL OR d.surfaceDemandee >= :surfaceMin) AND " +
           "(:surfaceMax IS NULL OR d.surfaceDemandee <= :surfaceMax) AND " +
           "(:searchKeyword IS NULL OR " +
           "LOWER(d.nomClient) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
           "LOWER(d.prenomClient) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
           "LOWER(d.localisationSouhaitee) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
           "LOWER(d.notesSupplementaires) LIKE LOWER(CONCAT('%', :searchKeyword, '%')))")
    Page<Demande> findAllWithFilters(
        @Param("typeDemande") TypeDemande typeDemande,
        @Param("typeBien") TypeBien typeBien,
        @Param("prixMin") Double prixMin,
        @Param("prixMax") Double prixMax,
        @Param("surfaceMin") Double surfaceMin,
        @Param("surfaceMax") Double surfaceMax,
        @Param("searchKeyword") String searchKeyword,
        Pageable pageable
    );
} 