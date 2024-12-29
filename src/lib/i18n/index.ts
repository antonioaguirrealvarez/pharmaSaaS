import { createModuleLogger } from '../logger';

const logger = createModuleLogger('i18n');

type Locale = 'en' | 'es';
type TranslationKey = string;
type TranslationValues = Record<string, string | number>;

interface Translation {
  [key: string]: string;
}

interface LocaleConfig {
  name: string;
  dateFormat: string;
  currencyFormat: {
    currency: string;
    locale: string;
  };
}

const localeConfigs: Record<Locale, LocaleConfig> = {
  en: {
    name: 'English',
    dateFormat: 'MM/DD/YYYY',
    currencyFormat: {
      currency: 'USD',
      locale: 'en-US'
    }
  },
  es: {
    name: 'Español',
    dateFormat: 'DD/MM/YYYY',
    currencyFormat: {
      currency: 'EUR',
      locale: 'es-ES'
    }
  }
};

class I18nService {
  private static instance: I18nService;
  private currentLocale: Locale = 'en';
  private translations: Record<Locale, Translation> = {
    en: {},
    es: {}
  };

  private constructor() {
    // Load initial translations
    this.loadTranslations();
  }

  public static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  private async loadTranslations() {
    try {
      // Load translations from your source
      // Example: API, JSON files, etc.
      this.translations = {
        en: {
          'welcome': 'Welcome',
          'login': 'Login',
          // ... more translations
        },
        es: {
          'welcome': 'Bienvenido',
          'login': 'Iniciar sesión',
          // ... more translations
        }
      };
    } catch (error) {
      logger.error('Failed to load translations', { error });
    }
  }

  public setLocale(locale: Locale) {
    this.currentLocale = locale;
    logger.info('Locale changed', { locale });
  }

  public getLocale(): Locale {
    return this.currentLocale;
  }

  public getLocaleConfig(): LocaleConfig {
    return localeConfigs[this.currentLocale];
  }

  public translate(
    key: TranslationKey,
    values?: TranslationValues
  ): string {
    let translation = this.translations[this.currentLocale][key] || key;

    if (values) {
      Object.entries(values).forEach(([key, value]) => {
        translation = translation.replace(`{${key}}`, String(value));
      });
    }

    return translation;
  }

  public formatDate(date: Date): string {
    return date.toLocaleDateString(localeConfigs[this.currentLocale].locale);
  }

  public formatCurrency(amount: number): string {
    const config = localeConfigs[this.currentLocale].currencyFormat;
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency
    }).format(amount);
  }
}

export const i18n = I18nService.getInstance();

// React hook for translations
export function useTranslation() {
  return {
    t: (key: TranslationKey, values?: TranslationValues) => 
      i18n.translate(key, values),
    locale: i18n.getLocale(),
    setLocale: (locale: Locale) => i18n.setLocale(locale),
    formatDate: (date: Date) => i18n.formatDate(date),
    formatCurrency: (amount: number) => i18n.formatCurrency(amount)
  };
}