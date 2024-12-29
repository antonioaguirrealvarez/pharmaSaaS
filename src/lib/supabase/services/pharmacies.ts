import { supabase } from '../../supabase';
import { createModuleLogger } from '../../logger';
import type { Database } from '../../../types/supabase';

const logger = createModuleLogger('pharmacies-service');

type Pharmacy = Database['public']['Tables']['pharmacies']['Row'];

export const pharmaciesService = {
  async getCurrentPharmacy() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: userPharmacy, error: userError } = await supabase
        .from('users') 
        .select('pharmacy_id')
        .eq('id', user.id)
        .maybeSingle();

      if (userError || !userPharmacy) {
        console.error('No pharmacy found for user');
        return null;
      }

      if (!userPharmacy.pharmacy_id) return null;

      const { data: pharmacy, error: pharmacyError } = await supabase
        .from('pharmacies')
        .select('*')
        .eq('id', userPharmacy.pharmacy_id)
        .single();

      if (pharmacyError) {
        console.error('Error fetching pharmacy', pharmacyError);
        return null;
      }

      return pharmacy;
    } catch (error) {
      logger.error('Failed to get current pharmacy', { error });
      return null;
    }
  },

  async create(data: Omit<Pharmacy, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data: pharmacy, error } = await supabase
        .from('pharmacies')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return pharmacy;
    } catch (error) {
      logger.error('Failed to create pharmacy', { error });
      throw error;
    }
  }
};