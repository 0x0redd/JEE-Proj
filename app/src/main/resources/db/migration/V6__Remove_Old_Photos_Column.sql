-- Remove the old photos column from offres table if it exists
-- This is needed because we're moving to a separate offre_photos table

-- First, drop the collection table if it exists (from the old @ElementCollection)
DROP TABLE IF EXISTS offres_photos;

-- Note: The photos column in the offres table will be handled by Hibernate
-- when we update the entity mapping 