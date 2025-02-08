-- Drop existing tables in correct dependency order
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS nurse_slots CASCADE;
DROP TABLE IF EXISTS nurse_service_areas CASCADE;
DROP TABLE IF EXISTS nurse_profiles CASCADE;
DROP TABLE IF EXISTS patient_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS service_areas CASCADE;

-- Create base tables
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('patient', 'nurse')),
  name text NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create test accounts in auth.users if they don't exist
DO $$ 
BEGIN
  -- Create test patient
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
  ) VALUES (
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
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    raw_app_meta_data = EXCLUDED.raw_app_meta_data,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    updated_at = now();

  -- Create test nurse
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
  ) VALUES (
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

  -- Create test profiles
  INSERT INTO profiles (id, role, name)
  VALUES 
    ('e9dc96f3-6691-4a7c-9d6c-ef3b367ad6f1', 'patient', 'Test Patient'),
    ('f7dc96f3-6691-4a7c-9d6c-ef3b367ad6f2', 'nurse', 'Test Nurse')
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    updated_at = now();
END $$;