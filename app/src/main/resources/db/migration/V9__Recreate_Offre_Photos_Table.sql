-- Migration to properly recreate the offre_photos table
-- This will drop the existing table and create it with the correct structure

-- Step 1: Drop the existing table completely
DROP TABLE IF EXISTS offre_photos;

-- Step 2: Create the correct offre_photos table with all required columns
CREATE TABLE offre_photos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    offre_id BIGINT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (offre_id) REFERENCES offres(id) ON DELETE CASCADE
);

-- Step 3: Add indexes for better performance
CREATE INDEX idx_offre_photos_offre_id ON offre_photos(offre_id);
CREATE INDEX idx_offre_photos_created_at ON offre_photos(created_at);

-- Step 4: Insert some sample photo data for existing offers (optional)
-- This will help test the functionality
INSERT INTO offre_photos (offre_id, photo_url, created_at, updated_at) VALUES
(1, 'http://localhost:3000/offers/sample1.jpg', NOW(), NOW()),
(1, 'http://localhost:3000/offers/sample2.jpg', NOW(), NOW()),
(2, 'http://localhost:3000/offers/sample3.jpg', NOW(), NOW()),
(3, 'http://localhost:3000/offers/sample4.jpg', NOW(), NOW()),
(4, 'http://localhost:3000/offers/sample5.jpg', NOW(), NOW()),
(5, 'http://localhost:3000/offers/sample6.jpg', NOW(), NOW()); 