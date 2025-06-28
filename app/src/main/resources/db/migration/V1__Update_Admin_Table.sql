-- Migration to update admin table structure
-- This migration handles the transition from 'name' to 'first_name' and 'last_name'

-- Add new columns (these will fail if they already exist, but that's okay)
ALTER TABLE admins ADD COLUMN first_name VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE admins ADD COLUMN last_name VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE admins ADD COLUMN address VARCHAR(500);
ALTER TABLE admins ADD COLUMN age INT;

-- Update existing data to split name into first_name and last_name
-- This will only work if the name column still exists
UPDATE admins SET 
    first_name = CASE 
        WHEN name IS NOT NULL AND name != '' THEN 
            CASE 
                WHEN LOCATE(' ', name) > 0 THEN SUBSTRING(name, 1, LOCATE(' ', name) - 1)
                ELSE name
            END
        ELSE 'Admin'
    END,
    last_name = CASE 
        WHEN name IS NOT NULL AND name != '' THEN 
            CASE 
                WHEN LOCATE(' ', name) > 0 THEN SUBSTRING(name, LOCATE(' ', name) + 1)
                ELSE 'User'
            END
        ELSE 'User'
    END
WHERE (first_name = '' OR last_name = '') AND name IS NOT NULL;

-- Drop the old name column if it exists
-- Note: This will fail if the column doesn't exist, but that's okay
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'admins' 
     AND COLUMN_NAME = 'name') > 0,
    'ALTER TABLE admins DROP COLUMN name',
    'SELECT "name column does not exist" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt; 