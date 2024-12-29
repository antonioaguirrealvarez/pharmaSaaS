import React from 'react';
import { useTranslations } from '../../lib/translations';

export default function LanguageTest() {
  const { t, language, setLanguage, formatDate, formatCurrency } = useTranslations();
  const testDate = new Date();
  const testAmount = 1234.56;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Language Test</h1>

      <div className="space-y-6">
        <div className="space-x-4">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded ${
              language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('es')}
            className={`px-4 py-2 rounded ${
              language === 'es' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Español
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Common Translations</h3>
            <ul className="space-y-2">
              <li>Login: {t('auth.login')}</li>
              <li>Register: {t('auth.register')}</li>
              <li>Email: {t('auth.email')}</li>
              <li>Password: {t('auth.password')}</li>
            </ul>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Date & Currency Formatting</h3>
            <ul className="space-y-2">
              <li>Date: {formatDate(testDate)}</li>
              <li>Currency: {formatCurrency(testAmount)}</li>
            </ul>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Navigation</h3>
            <ul className="space-y-2">
              <li>Dashboard: {t('nav.dashboard')}</li>
              <li>Inventory: {t('nav.inventory')}</li>
              <li>Customers: {t('nav.customers')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}