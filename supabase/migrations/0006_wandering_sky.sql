/*
  # Add pharmacy registration system

  1. New Tables
    - `pharmacy_registrations`
      - Tracks pharmacy registration requests
      - Includes verification status and approval workflow
      - Links to users and pharmacies tables

  2. Changes
    - Add verification fields to pharmacies table
    - Add registration workflow status

  3. Security
    - Enable RLS
    - Add policies for registration management
*/

-- Add verification fields to pharmacies
ALTER TABLE pharmacies
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_date timestamptz,
ADD COLUMN IF NOT EXISTS verification_document text;

-- Create pharmacy registrations table
CREATE TABLE IF NOT EXISTS pharmacy_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacies(id),
  requester_id uuid REFERENCES auth.users(id) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  business_license text NOT NULL,
  tax_id text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  notes text,
  reviewed_by uuid REFERENCES auth.users(id),
  review_date timestamptz,
  review_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pharmacy_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own registrations"
  ON pharmacy_registrations
  FOR SELECT
  TO authenticated
  USING (requester_id = auth.uid());

CREATE POLICY "Users can create registrations"
  ON pharmacy_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Admins can view all registrations"
  ON pharmacy_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update registrations"
  ON pharmacy_registrations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER pharmacy_registrations_updated_at
  BEFORE UPDATE ON pharmacy_registrations
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();