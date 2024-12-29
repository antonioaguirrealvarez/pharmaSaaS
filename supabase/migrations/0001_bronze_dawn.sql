/*
  # Initial Schema Setup for PharmaSaaS

  1. New Tables
    - `users`: Stores user information and authentication details
      - `id` (uuid, primary key): Unique identifier
      - `email` (text): User's email address
      - `full_name` (text): User's full name
      - `role` (enum): User role (admin, staff, pharmacist)
      - `pharmacy_id` (uuid): Reference to pharmacy
      - `created_at` (timestamp): Record creation timestamp
      - `updated_at` (timestamp): Record update timestamp

    - `pharmacies`: Stores pharmacy information
      - `id` (uuid, primary key): Unique identifier
      - `name` (text): Pharmacy name
      - `address` (text): Physical address
      - `phone` (text): Contact number
      - `license_number` (text): Pharmacy license
      - `owner_id` (uuid): Reference to owner user
      - `created_at` (timestamp): Record creation timestamp
      - `updated_at` (timestamp): Record update timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Set up role-based access control
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'staff', 'pharmacist')),
  pharmacy_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pharmacies table
CREATE TABLE IF NOT EXISTS pharmacies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  license_number text UNIQUE NOT NULL,
  owner_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint to users table
ALTER TABLE users
ADD CONSTRAINT fk_pharmacy
FOREIGN KEY (pharmacy_id)
REFERENCES pharmacies(id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM pharmacies
      WHERE pharmacies.id = users.pharmacy_id
      AND pharmacies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policies for pharmacies table
CREATE POLICY "Users can view associated pharmacy"
  ON pharmacies
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    id IN (
      SELECT pharmacy_id
      FROM users
      WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "Owners can update their pharmacy"
  ON pharmacies
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Create function to handle user updates
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER pharmacies_updated_at
  BEFORE UPDATE ON pharmacies
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();