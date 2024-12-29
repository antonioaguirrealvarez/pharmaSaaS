import React from 'react';
import ProductList from './ProductList';

export default function InventoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inventory Management</h1>
      <div className="mt-6">
        <ProductList />
      </div>
    </div>
  );
}