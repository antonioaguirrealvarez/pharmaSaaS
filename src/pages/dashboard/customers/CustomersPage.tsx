import React from 'react';
import CustomerList from './CustomerList';

export default function CustomersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Customer Management</h1>
      <div className="mt-6">
        <CustomerList />
      </div>
    </div>
  );
}