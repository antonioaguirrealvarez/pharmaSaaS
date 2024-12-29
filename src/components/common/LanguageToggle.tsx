import React from 'react';
import { Globe } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export default function LanguageToggle() {
  const { settings, updateSettings } = useSettings();

  return (
    <button
      onClick={() => updateSettings({ language: settings.language === 'en' ? 'es' : 'en' })}
      className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center space-x-1"
      title={settings.language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
    >
      <Globe className="h-5 w-5" />
      <span className="text-sm font-medium">{settings.language.toUpperCase()}</span>
    </button>
  );
}