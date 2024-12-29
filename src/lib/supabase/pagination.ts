import { SupabaseClient } from '@supabase/supabase-js';
import { PaginationParams, PaginatedResponse } from '../pagination/types';
import { calculatePaginationMetadata } from '../pagination/utils';

export async function paginateQuery<T = any>(
  query: ReturnType<SupabaseClient['from']>,
  params: PaginationParams
): Promise<PaginatedResponse<T>> {
  // Get total count
  const { count: totalItems } = await query
    .select('*', { count: 'exact', head: true });

  // Apply sorting
  if (params.sortBy) {
    query = query.order(params.sortBy, {
      ascending: params.sortDirection === 'asc'
    });
  }

  // Apply pagination
  const from = (params.page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;
  
  const { data, error } = await query
    .select('*')
    .range(from, to);

  if (error) throw error;

  return {
    data: data as T[],
    metadata: calculatePaginationMetadata(totalItems || 0, params)
  };
}