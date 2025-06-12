package com.immobilier.app.repository;

import com.immobilier.app.entity.Demande;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
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
            "LOWER(d.telephoneClient) LIKE LOWER(CONCAT('%', :searchKeyword, '%')))")
    Page<Demande> findAllWithFilters(
            @Param("typeDemande") Demande.TypeDemande typeDemande,
            @Param("typeBien") Demande.TypeBien typeBien,
            @Param("prixMin") BigDecimal prixMin,
            @Param("prixMax") BigDecimal prixMax,
            @Param("surfaceMin") Integer surfaceMin,
            @Param("surfaceMax") Integer surfaceMax,
            @Param("searchKeyword") String searchKeyword,
            Pageable pageable
    );

    long countByTypeBien(Demande.TypeBien typeBien);
} 