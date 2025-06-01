package com.immobilier.app.repository;

import com.immobilier.app.entity.BienImmobilier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BienImmobilierRepository extends JpaRepository<BienImmobilier, Long> {
}