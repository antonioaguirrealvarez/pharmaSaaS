import { createModuleLogger } from '../logger';
import { create } from 'zustand';

const logger = createModuleLogger('translations');

export type Language = 'en' | 'es';

interface TranslationStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<TranslationStore>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language })
}));

// Common translations used throughout the app
export const translations = {
  en: {
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    
    // Navigation
    'nav.inventory': 'Inventory',
    'nav.customers': 'Customers',
    'nav.dashboard': 'Dashboard',
    
    // Customers
    'customers.title': 'Customers',
    'customers.add': 'Add Customer',
    'customers.name': 'Name',
    'customers.email': 'Email',
    'customers.phone': 'Phone',
    'customers.insurance': 'Insurance',
    'customers.noCustomers': 'No customers',
    'customers.addFirst': 'Get started by adding your first customer.',
    
    // Inventory
    'inventory.title': 'Inventory',
    'inventory.add': 'Add Product',
    'inventory.name': 'Name',
    'inventory.sku': 'SKU',
    'inventory.stock': 'Stock',
    'inventory.price': 'Price',
    'inventory.noProducts': 'No products',
    'inventory.addFirst': 'Get started by adding your first product.',
    'inventory.lowStock': 'Low stock alert! Current stock is below minimum threshold.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close'
  },
  es: {
    // Auth
    'auth.login': 'Iniciar sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.fullName': 'Nombre completo',
    
    // Navigation
    'nav.inventory': 'Inventario',
    'nav.customers': 'Clientes',
    'nav.dashboard': 'Panel',
    
    // Customers
    'customers.title': 'Clientes',
    'customers.add': 'Añadir Cliente',
    'customers.name': 'Nombre',
    'customers.email': 'Correo',
    'customers.phone': 'Teléfono',
    'customers.insurance': 'Seguro',
    'customers.noCustomers': 'No hay clientes',
    'customers.addFirst': 'Empiece añadiendo su primer cliente.',
    
    // Inventory
    'inventory.title': 'Inventario',
    'inventory.add': 'Añadir Producto',
    'inventory.name': 'Nombre',
    'inventory.sku': 'SKU',
    'inventory.stock': 'Stock',
    'inventory.price': 'Precio',
    'inventory.noProducts': 'No hay productos',
    'inventory.addFirst': 'Empiece añadiendo su primer producto.',
    'inventory.lowStock': '¡Alerta de stock bajo! El stock actual está por debajo del mínimo.',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Se produjo un error',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar'
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

// React hook for translations
export function useTranslations() {
  const { language } = useLanguageStore();
  
  return {
    t: (key: TranslationKey) => translations[language][key] || key,
    language,
    setLanguage: useLanguageStore.getState().setLanguage,
    // Helper for formatting dates according to locale
    formatDate: (date: Date) => {
      return date.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES');
    },
    // Helper for formatting currency according to locale
    formatCurrency: (amount: number) => {
      return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'es-ES', {
        style: 'currency',
        currency: language === 'en' ? 'USD' : 'EUR'
      }).format(amount);
    }
  };
}