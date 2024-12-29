import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { Pill, Package, Users, Sun, Moon, LogOut } from 'lucide-react';
import LanguageToggle from '../../components/common/LanguageToggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { signOut, userData } = useAuth();
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Pill className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">PharmaPro</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard/inventory"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  <Package className="h-5 w-5 mr-1" />
                  Inventory
                </Link>
                <Link
                  to="/dashboard/customers"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  <Users className="h-5 w-5 mr-1" />
                  Customers
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' })}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                {settings.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <LanguageToggle />
              <div className="ml-3 relative flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {userData?.full_name}
                </span>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}