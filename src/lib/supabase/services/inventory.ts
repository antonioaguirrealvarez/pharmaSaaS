import { supabase } from '../../supabase';
import { createModuleLogger } from '../../logger';
import type { Database } from '../../../types/supabase';
import { pharmaciesService } from './pharmacies';

const logger = createModuleLogger('inventory-service');

type Product = Database['public']['Tables']['products']['Row'];

export const productsService = {
  async getAll() {
    try {
      const pharmacy = await pharmaciesService.getCurrentPharmacy();

      if (!pharmacy) {
        throw new Error('No pharmacy found for current user');
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('pharmacy_id', pharmacy.id);

      if (error) throw error;
      return { data };
    } catch (error) {
      logger.error('Failed to get products', { error });
      throw error;
    }
  },

  async create(data: Omit<Product, 'id' | 'pharmacy_id'>) {
    try {
      const pharmacy = await pharmaciesService.getCurrentPharmacy();

      if (!pharmacy) {
        throw new Error('No pharmacy found for current user');
      }

      const { data: product, error } = await supabase
        .from('products')
        .insert([{ ...data, pharmacy_id: pharmacy.id }])
        .select()
        .single();

      if (error) throw error;
      return product;
    } catch (error) {
      logger.error('Failed to create product', { error });
      throw error;
    }
  }
};