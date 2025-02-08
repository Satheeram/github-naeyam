/*
  # Fix Auth Users Setup

  1. Changes
    - Create test accounts in auth.users table
    - Ensure proper role metadata
    - Set confirmed email status
    - Set proper encrypted passwords

  2. Security
    - Use proper password encryption
    - Set proper user metadata
*/

-- Create test accounts in auth.users if they don't exist
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token
) VALUES
-- Test Patient
(
  'e9dc96f3-6691-4a7c-9d6c-ef3b367ad6f1',
  '00000000-0000-0000-0000-000000000000',
  'test.patient@example.com',
  crypt('test123456', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"patient"}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  ''
),
-- Test Nurse
(
  'f7dc96f3-6691-4a7c-9d6c-ef3b367ad6f2',
  '00000000-0000-0000-0000-000000000000',
  'test.nurse@example.com',
  crypt('test123456', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"nurse"}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  ''
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  updated_at = now();