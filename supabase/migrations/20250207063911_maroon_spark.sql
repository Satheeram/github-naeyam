/*
  # Patient and Nurse Coordinator System

  1. New Tables
    - profiles
      - Basic user information for both patients and nurses
      - Links to auth.users
      - Includes role, name, phone, address
    
    - patient_profiles
      - Extended patient information
      - Medical history and emergency contacts
      - Links to profiles
    
    - nurse_profiles
      - Professional details for nurses
      - Qualifications and experience
      - Links to profiles
    
    - nurse_service_areas
      - Areas where nurses provide services
      - Pincode-based service availability
    
    - nurse_slots
      - Available time slots for nurses
      - One-hour blocks
      - Status tracking
    
    - bookings
      - Appointment bookings
      - Links patients, nurses, and slots
      - Status tracking

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated access
    - Role-based access control
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('patient', 'nurse')),
  name text NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create patient_profiles table
CREATE TABLE IF NOT EXISTS patient_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  blood_group text,
  emergency_contact_name text,
  emergency_contact_phone text,
  medical_conditions text[],
  allergies text[],
  current_medications text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create nurse_profiles table
CREATE TABLE IF NOT EXISTS nurse_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  qualification text NOT NULL,
  years_of_experience integer NOT NULL,
  specializations text[],
  languages_spoken text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create nurse_service_areas table
CREATE TABLE IF NOT EXISTS nurse_service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id uuid REFERENCES nurse_profiles(id) ON DELETE CASCADE,
  pincode text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(nurse_id, pincode)
);

-- Create nurse_slots table
CREATE TABLE IF NOT EXISTS nurse_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id uuid REFERENCES nurse_profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text NOT NULL CHECK (status IN ('available', 'booked', 'completed', 'cancelled')) DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_slot_time CHECK (end_time > start_time),
  CONSTRAINT one_hour_slot CHECK (EXTRACT(EPOCH FROM end_time::time - start_time::time) = 3600)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patient_profiles(id) ON DELETE CASCADE,
  nurse_id uuid REFERENCES nurse_profiles(id) ON DELETE CASCADE,
  slot_id uuid REFERENCES nurse_slots(id) ON DELETE CASCADE,
  service_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurse_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurse_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurse_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Patient Profiles Policies
CREATE POLICY "Patients can view their own profile"
  ON patient_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Nurses can view patient profiles for their bookings"
  ON patient_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'nurse'
      AND EXISTS (
        SELECT 1 FROM bookings
        WHERE nurse_id = auth.uid()
        AND patient_id = patient_profiles.id
      )
    )
  );

-- Nurse Profiles Policies
CREATE POLICY "Public can view nurse profiles"
  ON nurse_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Nurses can update their own profile"
  ON nurse_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Nurse Service Areas Policies
CREATE POLICY "Public can view service areas"
  ON nurse_service_areas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Nurses can manage their service areas"
  ON nurse_service_areas
  FOR ALL
  TO authenticated
  USING (nurse_id = auth.uid())
  WITH CHECK (nurse_id = auth.uid());

-- Nurse Slots Policies
CREATE POLICY "Public can view available slots"
  ON nurse_slots
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Nurses can manage their slots"
  ON nurse_slots
  FOR ALL
  TO authenticated
  USING (nurse_id = auth.uid())
  WITH CHECK (nurse_id = auth.uid());

-- Bookings Policies
CREATE POLICY "Users can view their bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    patient_id = auth.uid()
    OR nurse_id = auth.uid()
  );

CREATE POLICY "Patients can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    patient_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'patient'
    )
  );

CREATE POLICY "Users can update their bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    patient_id = auth.uid()
    OR nurse_id = auth.uid()
  )
  WITH CHECK (
    patient_id = auth.uid()
    OR nurse_id = auth.uid()
  );

-- Create function to check slot availability
CREATE OR REPLACE FUNCTION check_slot_availability(p_slot_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM nurse_slots 
    WHERE id = p_slot_id 
    AND status = 'available'
  );
END;
$$;

-- Create function to book a slot
CREATE OR REPLACE FUNCTION book_slot(
  p_slot_id uuid,
  p_patient_id uuid,
  p_service_id text,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking_id uuid;
  v_nurse_id uuid;
BEGIN
  -- Get nurse_id from slot
  SELECT nurse_id INTO v_nurse_id
  FROM nurse_slots
  WHERE id = p_slot_id;

  -- Check if slot is available
  IF NOT check_slot_availability(p_slot_id) THEN
    RAISE EXCEPTION 'Slot is not available';
  END IF;

  -- Create booking
  INSERT INTO bookings (
    patient_id,
    nurse_id,
    slot_id,
    service_id,
    notes
  ) VALUES (
    p_patient_id,
    v_nurse_id,
    p_slot_id,
    p_service_id,
    p_notes
  )
  RETURNING id INTO v_booking_id;

  -- Update slot status
  UPDATE nurse_slots
  SET status = 'booked'
  WHERE id = p_slot_id;

  RETURN v_booking_id;
END;
$$;