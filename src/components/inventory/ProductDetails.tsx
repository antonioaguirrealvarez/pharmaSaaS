import React from 'react';
import { Package, BarChart2, Tag, AlertTriangle } from 'lucide-react';
import type { Database } from '../../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetails({ product, onClose }: ProductDetailsProps) {
  const isLowStock = product.stock_quantity <= product.minimum_stock;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
              </div>
            </div>

            {isLowStock && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-3" />
                  <span className="text-yellow-700 dark:text-yellow-500">
                    Low stock alert! Current stock is below minimum threshold.
                  </span>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <BarChart2 className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Stock Levels</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Current Stock:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{product.stock_quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Minimum Stock:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{product.minimum_stock}</span>
                  </div>
                  {product.maximum_stock && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Maximum Stock:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{product.maximum_stock}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Pricing</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Unit Price:</span>
                    <span className="font-medium text-gray-900 dark:text-white">€{product.unit_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Category:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{product.category || 'Uncategorized'}</span>
                  </div>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}