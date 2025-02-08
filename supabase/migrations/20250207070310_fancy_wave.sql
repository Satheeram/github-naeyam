/*
  # Add test accounts

  1. New Data
    - Test patient account
    - Test nurse account
    - Basic profile information for both accounts

  2. Security
    - Uses secure password hashing
    - Maintains RLS policies
*/

-- Insert test accounts into auth.users
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
) ON CONFLICT (id) DO NOTHING;

-- Insert profiles
INSERT INTO profiles (id, role, name) VALUES
('e9dc96f3-6691-4a7c-9d6c-ef3b367ad6f1', 'patient', 'Test Patient'),
('f7dc96f3-6691-4a7c-9d6c-ef3b367ad6f2', 'nurse', 'Test Nurse')
ON CONFLICT (id) DO NOTHING;

-- Insert patient profile
INSERT INTO patient_profiles (
  id,
  date_of_birth,
  gender,
  blood_group,
  emergency_contact_name,
  emergency_contact_phone
) VALUES (
  'e9dc96f3-6691-4a7c-9d6c-ef3b367ad6f1',
  '1990-01-01',
  'male',
  'O+',
  'Emergency Contact',
  '+91 98765 43210'
) ON CONFLICT (id) DO NOTHING;

-- Insert nurse profile
INSERT INTO nurse_profiles (
  id,
  qualification,
  years_of_experience,
  specializations,
  languages_spoken
) VALUES (
  'f7dc96f3-6691-4a7c-9d6c-ef3b367ad6f2',
  'BSc Nursing',
  5,
  ARRAY['General Care', 'Elder Care', 'Post-operative Care'],
  ARRAY['English', 'Tamil', 'Hindi']
) ON CONFLICT (id) DO NOTHING;