import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { createModuleLogger } from '../logger';
import { analytics } from '../analytics';

const logger = createModuleLogger('supabase-crud');

type Table = keyof Database['public']['Tables'];
type Row<T extends Table> = Database['public']['Tables'][T]['Row'];
type Insert<T extends Table> = Database['public']['Tables'][T]['Insert'];
type Update<T extends Table> = Database['public']['Tables'][T]['Update'];

export class SupabaseService<T extends Table> {
  constructor(private table: T) {}

  async getById(id: string): Promise<Row<T> | null> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Failed to get ${this.table} by id`, { id, error });
      throw error;
    }
  }

  async getAll(query?: {
    filters?: Record<string, any>;
    sort?: { column: string; ascending?: boolean };
    limit?: number;
    page?: number;
  }): Promise<{ data: Row<T>[]; count: number }> {
    try {
      let queryBuilder = supabase
        .from(this.table)
        .select('*', { count: 'exact' });

      // Apply filters
      if (query?.filters) {
        Object.entries(query.filters).forEach(([key, value]) => {
          queryBuilder = queryBuilder.eq(key, value);
        });
      }

      // Apply sorting
      if (query?.sort) {
        queryBuilder = queryBuilder.order(
          query.sort.column,
          { ascending: query.sort.ascending ?? true }
        );
      }

      // Apply pagination
      if (query?.limit) {
        queryBuilder = queryBuilder.range(
          ((query.page ?? 0) * query.limit),
          ((query.page ?? 0) * query.limit) + query.limit - 1
        );
      }

      const { data, error, count } = await queryBuilder;

      if (error) throw error;
      return { data: data ?? [], count: count ?? 0 };
    } catch (error) {
      logger.error(`Failed to get ${this.table} list`, { query, error });
      throw error;
    }
  }

  async create(data: Insert<T>): Promise<Row<T>> {
    try {
      const { data: created, error } = await supabase
        .from(this.table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      analytics.track(`${this.table}_created`, {
        id: created.id,
      });

      return created;
    } catch (error) {
      logger.error(`Failed to create ${this.table}`, { data, error });
      throw error;
    }
  }

  async update(id: string, data: Update<T>): Promise<Row<T>> {
    try {
      const { data: updated, error } = await supabase
        .from(this.table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      analytics.track(`${this.table}_updated`, {
        id,
        changes: Object.keys(data),
      });

      return updated;
    } catch (error) {
      logger.error(`Failed to update ${this.table}`, { id, data, error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      analytics.track(`${this.table}_deleted`, { id });
    } catch (error) {
      logger.error(`Failed to delete ${this.table}`, { id, error });
      throw error;
    }
  }
}