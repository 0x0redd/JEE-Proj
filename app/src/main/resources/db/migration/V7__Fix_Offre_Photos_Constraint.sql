-- Migration to fix the foreign key constraint issue in offre_photos table
-- This ensures that photos are automatically deleted when their parent offer is deleted

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE offre_photos DROP FOREIGN KEY FKpq0h6ati81flbgybfbxve9aui;

-- Step 2: Recreate the foreign key constraint with CASCADE DELETE
ALTER TABLE offre_photos 
ADD CONSTRAINT FK_offre_photos_offre_id 
FOREIGN KEY (offre_id) REFERENCES offres(id) ON DELETE CASCADE;

-- Step 3: Verify the constraint is properly set
-- This will show the constraint details
SHOW CREATE TABLE offre_photos; 