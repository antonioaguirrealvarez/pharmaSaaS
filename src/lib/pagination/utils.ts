import { PaginationParams, PaginatedResponse } from './types';

export function calculatePaginationMetadata(
  totalItems: number,
  params: PaginationParams
): PaginatedResponse<any>['metadata'] {
  const totalPages = Math.ceil(totalItems / params.pageSize);
  
  return {
    currentPage: params.page,
    pageSize: params.pageSize,
    totalItems,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPreviousPage: params.page > 1
  };
}

export function getPaginationRange(
  totalPages: number,
  currentPage: number,
  maxPages: number = 5
): number[] {
  const range: number[] = [];
  const halfMax = Math.floor(maxPages / 2);
  
  let start = Math.max(1, currentPage - halfMax);
  let end = Math.min(totalPages, start + maxPages - 1);
  
  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1);
  }
  
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  
  return range;
}