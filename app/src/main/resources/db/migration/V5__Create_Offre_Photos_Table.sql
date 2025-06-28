-- Migration to create the new offre_photos table structure
-- This handles the transition from @ElementCollection to @OneToMany relationship

-- Step 1: Drop any existing tables with conflicting names
DROP TABLE IF EXISTS offre_photos;
DROP TABLE IF EXISTS offres_photos;

-- Step 2: Create the new offre_photos table
CREATE TABLE offre_photos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    offre_id BIGINT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (offre_id) REFERENCES offres(id) ON DELETE CASCADE
);

-- Step 3: Add index for better performance
CREATE INDEX idx_offre_photos_offre_id ON offre_photos(offre_id);

-- Step 4: Add index on created_at for sorting
CREATE INDEX idx_offre_photos_created_at ON offre_photos(created_at); 