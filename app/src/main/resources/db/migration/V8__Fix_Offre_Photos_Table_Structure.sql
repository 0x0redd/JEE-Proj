-- Migration to fix the offre_photos table structure
-- This ensures the table has all required columns for the JPA entity

-- Step 1: Check if the table exists and has the correct structure
-- If the table exists but is missing the id column, we need to recreate it

-- Step 2: Drop the existing table if it exists (this will also drop any data)
DROP TABLE IF EXISTS offre_photos;

-- Step 3: Create the correct offre_photos table with all required columns
CREATE TABLE offre_photos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    offre_id BIGINT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (offre_id) REFERENCES offres(id) ON DELETE CASCADE
);

-- Step 4: Add indexes for better performance
CREATE INDEX idx_offre_photos_offre_id ON offre_photos(offre_id);
CREATE INDEX idx_offre_photos_created_at ON offre_photos(created_at);

-- Step 5: Insert some sample photo data for existing offers
INSERT INTO offre_photos (offre_id, photo_url, created_at, updated_at) VALUES
(1, 'http://localhost:3000/offers/sample1.jpg', NOW(), NOW()),
(1, 'http://localhost:3000/offers/sample2.jpg', NOW(), NOW()),
(2, 'http://localhost:3000/offers/sample3.jpg', NOW(), NOW()),
(3, 'http://localhost:3000/offers/sample4.jpg', NOW(), NOW()),
(4, 'http://localhost:3000/offers/sample5.jpg', NOW(), NOW()),
(5, 'http://localhost:3000/offers/sample6.jpg', NOW(), NOW()); 