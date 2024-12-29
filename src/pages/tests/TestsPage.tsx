import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import AuthTest from './AuthTest';
import CRUDTest from './CRUDTest';
import ThemeTest from './ThemeTest';
import LanguageTest from './LanguageTest';
import RoleTest from './RoleTest';
import LoggerTest from './LoggerTest';

export default function TestsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8">
          <Link
            to="/tests/auth"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Auth Test
          </Link>
          <Link
            to="/tests/crud"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            CRUD Test
          </Link>
          <Link
            to="/tests/theme"
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Theme Test
          </Link>
          <Link
            to="/tests/language"
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Language Test
          </Link>
          <Link
            to="/tests/role"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Role Test
          </Link>
          <Link
            to="/tests/logger"
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Logger Test
          </Link>
        </div>

        <Routes>
          <Route path="auth" element={<AuthTest />} />
          <Route path="crud" element={<CRUDTest />} />
          <Route path="theme" element={<ThemeTest />} />
          <Route path="language" element={<LanguageTest />} />
          <Route path="role" element={<RoleTest />} />
          <Route path="logger" element={<LoggerTest />} />
        </Routes>
      </div>
    </div>
  );
}