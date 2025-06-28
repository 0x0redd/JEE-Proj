-- Migration to drop the old 'name' column
-- This should be run after V1__Update_Admin_Table.sql

-- Drop the old name column if it exists
-- This will fail if the column doesn't exist, but that's expected
ALTER TABLE admins DROP COLUMN name; 