import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import InventoryPage from './inventory/InventoryPage';
import CustomersPage from './customers/CustomersPage';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<InventoryPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Routes>
    </DashboardLayout>
  );
}