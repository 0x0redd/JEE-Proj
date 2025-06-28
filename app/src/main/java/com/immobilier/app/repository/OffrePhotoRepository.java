package com.immobilier.app.repository;

import com.immobilier.app.entity.OffrePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OffrePhotoRepository extends JpaRepository<OffrePhoto, Long> {
    
    List<OffrePhoto> findByOffreId(Long offreId);
    
    void deleteByOffreId(Long offreId);
} 