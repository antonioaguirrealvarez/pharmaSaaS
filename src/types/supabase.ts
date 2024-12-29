export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          created_at: string
          updated_at: string
          role: 'admin' | 'staff' | 'pharmacist'
          pharmacy_id: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          created_at?: string
          updated_at?: string
          role?: 'admin' | 'staff' | 'pharmacist'
          pharmacy_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          created_at?: string
          updated_at?: string
          role?: 'admin' | 'staff' | 'pharmacist'
          pharmacy_id?: string | null
        }
      }
      pharmacies: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          license_number: string
          created_at: string
          updated_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          license_number: string
          created_at?: string
          updated_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          license_number?: string
          created_at?: string
          updated_at?: string
          owner_id?: string
        }
      }
    }
  }
}