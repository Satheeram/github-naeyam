/*
  # Service Availability Schema

  1. New Tables
    - `service_areas`
      - `id` (uuid, primary key)
      - `pincode` (text, not null)
      - `service_id` (text, not null)
      - `is_available` (boolean, default true)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `service_areas` table
    - Add policies for:
      - Public read access for availability checks
      - Authenticated admin users for write operations

  3. Functions
    - `check_service_availability`: Function to check if a service is available in a pincode
    - `update_service_area`: Function to update service availability for a pincode
*/

-- Create service areas table
CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pincode text NOT NULL,
  service_id text NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(pincode, service_id)
);

-- Enable RLS
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON service_areas
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin write access"
  ON service_areas
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@naeyam.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@naeyam.com');

-- Create function to check service availability
CREATE OR REPLACE FUNCTION check_service_availability(p_pincode text, p_service_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM service_areas 
    WHERE pincode = p_pincode 
    AND service_id = p_service_id 
    AND is_available = true
  );
END;
$$;

-- Create function to update service area
CREATE OR REPLACE FUNCTION update_service_area(p_pincode text, p_service_id text, p_is_available boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO service_areas (pincode, service_id, is_available)
  VALUES (p_pincode, p_service_id, p_is_available)
  ON CONFLICT (pincode, service_id)
  DO UPDATE SET 
    is_available = p_is_available,
    updated_at = now();
END;
$$;