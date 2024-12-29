import { useState, useCallback, useMemo } from 'react';
import { PaginationParams } from './types';

export function usePagination(initialParams: Partial<PaginationParams> = {}) {
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
    ...initialParams
  });

  const setPage = useCallback((page: number) => {
    setParams(prev => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setParams(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const setSorting = useCallback((sortBy: string, sortDirection: 'asc' | 'desc') => {
    setParams(prev => ({ ...prev, sortBy, sortDirection, page: 1 }));
  }, []);

  const setFilters = useCallback((filters: Record<string, any>) => {
    setParams(prev => ({ ...prev, filters, page: 1 }));
  }, []);

  const reset = useCallback(() => {
    setParams({
      page: 1,
      pageSize: 10,
      ...initialParams
    });
  }, [initialParams]);

  return {
    params,
    setPage,
    setPageSize,
    setSorting,
    setFilters,
    reset
  };
}