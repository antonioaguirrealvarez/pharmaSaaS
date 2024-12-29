/*
  # Create inventory and product management tables

  1. New Tables
    - `products`
      - Basic product information
      - Stock tracking
      - Pricing
    - `suppliers`
      - Supplier information
    - `stock_movements`
      - Track all stock changes
      - Support for different movement types

  2. Security
    - Enable RLS on all tables
    - Policies for pharmacy-specific access
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  name text NOT NULL,
  sku text,
  barcode text,
  description text,
  category text,
  unit_price decimal(10,2) NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0,
  minimum_stock integer NOT NULL DEFAULT 0,
  maximum_stock integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  tax_id text,
  payment_terms text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stock movements table
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  movement_type text NOT NULL CHECK (movement_type IN ('purchase', 'sale', 'adjustment', 'return')),
  quantity integer NOT NULL,
  unit_price decimal(10,2),
  supplier_id uuid REFERENCES suppliers(id),
  notes text,
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view products from their pharmacy"
  ON products
  FOR SELECT
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can modify products from their pharmacy"
  ON products
  FOR ALL
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );

-- Similar policies for suppliers and stock_movements
CREATE POLICY "Users can view suppliers from their pharmacy"
  ON suppliers
  FOR SELECT
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can modify suppliers from their pharmacy"
  ON suppliers
  FOR ALL
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can view stock movements from their pharmacy"
  ON stock_movements
  FOR SELECT
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create stock movements for their pharmacy"
  ON stock_movements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    pharmacy_id IN (
      SELECT id FROM pharmacies WHERE owner_id = auth.uid()
      UNION
      SELECT pharmacy_id FROM users WHERE id = auth.uid()
    )
  );