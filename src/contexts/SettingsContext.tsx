import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../lib/api/client';
import { useAuth } from './AuthContext';
import { createModuleLogger } from '../lib/logger';

const logger = createModuleLogger('settings-context');

interface Settings {
  theme: 'light' | 'dark';
  language: 'en' | 'es';
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    language: 'en'
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const { data, error } = await apiClient.getSupabase()
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setSettings({
          theme: data.theme,
          language: data.language
        });
      }
    } catch (error) {
      logger.error('Failed to load settings', { error });
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      const { error } = await apiClient.getSupabase()
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          theme: updatedSettings.theme,
          language: updatedSettings.language
        });

      if (error) throw error;
      setSettings(updatedSettings);
    } catch (error) {
      logger.error('Failed to update settings', { error });
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}