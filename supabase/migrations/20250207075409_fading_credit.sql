/*
  # Clear User Accounts

  This migration:
  1. Safely removes the trigger temporarily
  2. Clears auth.users table and related profiles
  3. Restores the trigger
  4. Preserves service_areas table and its data
*/

-- First, safely handle the trigger
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
  END IF;
END $$;

-- Clear auth.users table (this will cascade to profiles due to foreign key)
TRUNCATE auth.users CASCADE;

-- Re-enable the trigger if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
  END IF;
END $$;