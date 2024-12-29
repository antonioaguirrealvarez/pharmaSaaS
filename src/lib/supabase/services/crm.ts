import { supabase } from '../../supabase';
import { createModuleLogger } from '../../logger';
import type { Database } from '../../../types/supabase';
import { pharmaciesService } from './pharmacies';

const logger = createModuleLogger('crm-service');

type Customer = Database['public']['Tables']['customers']['Row'];

export const customersService = {
  async getAll() {
    try {
      const pharmacy = await pharmaciesService.getCurrentPharmacy();

      if (!pharmacy) {
        throw new Error('No pharmacy found for current user');
      }

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('pharmacy_id', pharmacy.id);

      if (error) throw error;
      return { data };
    } catch (error) {
      logger.error('Failed to get customers', { error });
      throw error;
    }
  },

  async create(data: Omit<Customer, 'id' | 'pharmacy_id'>) {
    try {
      const pharmacy = await pharmaciesService.getCurrentPharmacy();

      if (!pharmacy) {
        throw new Error('No pharmacy found for current user');
      }

      const { data: customer, error } = await supabase
        .from('customers')
        .insert([{ ...data, pharmacy_id: pharmacy.id }])
        .select()
        .single();

      if (error) throw error;
      return customer;
    } catch (error) {
      logger.error('Failed to create customer', { error });
      throw error;
    }
  }
};