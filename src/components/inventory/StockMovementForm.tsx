import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Database } from '../../types/supabase';

type StockMovement = Database['public']['Tables']['stock_movements']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Supplier = Database['public']['Tables']['suppliers']['Row'];

const stockMovementSchema = z.object({
  product_id: z.string().uuid(),
  movement_type: z.enum(['purchase', 'sale', 'adjustment', 'return']),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unit_price: z.number().min(0, 'Price must be non-negative').optional(),
  supplier_id: z.string().uuid().optional(),
  notes: z.string().optional()
});

type StockMovementFormData = z.infer<typeof stockMovementSchema>;

interface StockMovementFormProps {
  products: Product[];
  suppliers: Supplier[];
  onSubmit: (data: StockMovementFormData) => Promise<void>;
  onCancel: () => void;
}

export default function StockMovementForm({ products, suppliers, onSubmit, onCancel }: StockMovementFormProps) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<StockMovementFormData>({
    resolver: zodResolver(stockMovementSchema)
  });

  const movementType = watch('movement_type');
  const showSupplier = movementType === 'purchase' || movementType === 'return';
  const showPrice = movementType === 'purchase' || movementType === 'sale';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Product *
        </label>
        <select
          id="product_id"
          {...register('product_id')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (SKU: {product.sku})
            </option>
          ))}
        </select>
        {errors.product_id && (
          <p className="mt-1 text-sm text-red-600">{errors.product_id.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="movement_type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Movement Type *
        </label>
        <select
          id="movement_type"
          {...register('movement_type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="">Select movement type</option>
          <option value="purchase">Purchase</option>
          <option value="sale">Sale</option>
          <option value="adjustment">Adjustment</option>
          <option value="return">Return</option>
        </select>
        {errors.movement_type && (
          <p className="mt-1 text-sm text-red-600">{errors.movement_type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Quantity *
        </label>
        <input
          type="number"
          id="quantity"
          {...register('quantity', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
        )}
      </div>

      {showPrice && (
        <div>
          <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Unit Price
          </label>
          <input
            type="number"
            step="0.01"
            id="unit_price"
            {...register('unit_price', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.unit_price && (
            <p className="mt-1 text-sm text-red-600">{errors.unit_price.message}</p>
          )}
        </div>
      )}

      {showSupplier && (
        <div>
          <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Supplier
          </label>
          <select
            id="supplier_id"
            {...register('supplier_id')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register('notes')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Record Movement'}
        </button>
      </div>
    </form>
  );
}