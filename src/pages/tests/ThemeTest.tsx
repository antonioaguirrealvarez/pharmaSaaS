import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeTest() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Theme Test</h1>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span>Current Theme: {theme}</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Light/Dark Mode Demo</h3>
            <p className="text-gray-600 dark:text-gray-300">
              This box demonstrates the theme system. It will change appearance based on the current theme.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
              Primary Background
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
              Secondary Background
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Text Colors:</p>
            <p className="text-gray-900 dark:text-white">Primary Text</p>
            <p className="text-gray-600 dark:text-gray-300">Secondary Text</p>
            <p className="text-blue-600 dark:text-blue-400">Accent Text</p>
          </div>
        </div>
      </div>
    </div>
  );
}