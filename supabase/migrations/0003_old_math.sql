/*
  # Create CRM and customer management tables

  1. New Tables
    - `customers`
      - Customer information
      - Medical history references
    - `prescriptions`
      - Prescription tracking
      - Link to customers
    - `medical_records`
      - Customer medical history
      - Allergies and conditions

  2. Security
    - Enable RLS on all tables
    - Policies for pharmacy-specific access
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  date_of_birth date,
  address text,
  insurance_provider text,
  insurance_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  customer_id uuid REFERENCES customers(id) NOT NULL,
  prescription_date date NOT NULL,
  doctor_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'completed', 'expired', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  customer_id uuid REFERENCES customers(id) NOT NULL,
  record_type text NOT NULL CHECK (record_type IN ('allergy', 'condition', 'medication', 'note')),
  description text NOT NULL,
  start_date date,
  end_date date,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view customers from their pharmacy"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can modify customers from their pharmacy"
  ON customers
  FOR ALL
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );

-- Similar policies for prescriptions and medical_records
CREATE POLICY "Users can view prescriptions from their pharmacy"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can modify prescriptions from their pharmacy"
  ON prescriptions
  FOR ALL
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can view medical records from their pharmacy"
  ON medical_records
  FOR SELECT
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can modify medical records from their pharmacy"
  ON medical_records
  FOR ALL
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );