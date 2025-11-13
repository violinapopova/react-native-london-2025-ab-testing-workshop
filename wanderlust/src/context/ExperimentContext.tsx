// Local A/B testing with AsyncStorage
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { ExperimentConfig, ExperimentContextType } from '../types';
import { STORAGE_KEYS } from '../utils/mockData';
import { updateLocale } from '../i18n/i18n';

// Variant A (default)
const DEFAULT_EXPERIMENTS_A: ExperimentConfig = {
  swipe_cta_text: 'Book Now',
  swipe_cta_color: '#FF5757',
  onboarding_steps: 1,
  premium_badge: 'pro',
  search_placeholder: 'Search destinations...',
  // Locale-based features (enabled for demo)
  show_local_deals_en: false,
  show_local_deals_es: false, // Spanish locale demo
  show_local_deals_fr: false,
  show_summer_promo_fr: false, // French locale demo
};

// Variant B (alternative)
const DEFAULT_EXPERIMENTS_B: ExperimentConfig = {
  swipe_cta_text: 'Reserve Spot',
  swipe_cta_color: '#4CAF50',
  onboarding_steps: 3,
  premium_badge: 'elite',
  search_placeholder: 'Where to next?',
  // Locale-based features (enabled for demo)
  show_local_deals_en: false,
  show_local_deals_es: false, // Spanish locale demo
  show_local_deals_fr: false,
  show_summer_promo_fr: false, // French locale demo
};

const DEFAULT_EXPERIMENTS = DEFAULT_EXPERIMENTS_A;

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

interface ExperimentProviderProps {
  children: ReactNode;
}

export const ExperimentProvider: React.FC<ExperimentProviderProps> = ({ children }) => {
  const [exp, setExp] = useState<ExperimentConfig>(DEFAULT_EXPERIMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<string>('en');

  // Initialize config from AsyncStorage
  useEffect(() => {
    initializeConfig();
    detectLocale().catch((error) => {
      console.error('Error detecting locale:', error);
    });
  }, []);

  const detectLocale = async () => {
    // First check if user has saved a locale preference
    try {
      const savedLocale = await AsyncStorage.getItem(STORAGE_KEYS.APP_LOCALE);
      if (savedLocale) {
        const supportedLocales = ['en', 'es', 'fr'];
        if (supportedLocales.includes(savedLocale)) {
          setLocale(savedLocale);
          updateLocale(savedLocale);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading saved locale:', error);
    }

    // Fallback to device locale
    const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
    const supportedLocales = ['en', 'es', 'fr'];
    const detectedLocale = supportedLocales.includes(deviceLanguage) ? deviceLanguage : 'en';
    setLocale(detectedLocale);
    updateLocale(detectedLocale);
  };

  const changeLocale = async (newLocale: string) => {
    const supportedLocales = ['en', 'es', 'fr'];
    if (!supportedLocales.includes(newLocale)) {
      console.warn('Unsupported locale:', newLocale);
      return;
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_LOCALE, newLocale);
      setLocale(newLocale);
      updateLocale(newLocale);
      track('locale_changed', {
        new_locale: newLocale,
      });
    } catch (error) {
      console.error('Error saving locale:', error);
    }
  };

  const initializeConfig = async () => {
    // Load from AsyncStorage or use defaults
    console.log('[Config] Loading from AsyncStorage');
    await loadStoredExperiments();
  };

  const saveExperiments = async (experiments: ExperimentConfig) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AB_EXPERIMENTS, JSON.stringify(experiments));
    } catch (error) {
      console.error('Error saving experiments:', error);
    }
  };

  const loadStoredExperiments = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.AB_EXPERIMENTS);
      if (stored) {
        const experiments = JSON.parse(stored) as ExperimentConfig;
        setExp(experiments);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading stored experiments:', error);
      setIsLoading(false);
    }
  };

  const refreshConfig = async () => {
    setIsLoading(true);
    await loadStoredExperiments();
  };

  const resetToDefaults = async () => {
    try {
      // Clear stored experiments and reset to current defaults
      await AsyncStorage.removeItem(STORAGE_KEYS.AB_EXPERIMENTS);
      setExp(DEFAULT_EXPERIMENTS_A);
      await saveExperiments(DEFAULT_EXPERIMENTS_A);
      console.log('[Experiments] Reset to default values');
      track('experiments_reset_to_defaults', {
        experiments: DEFAULT_EXPERIMENTS_A,
      });
    } catch (error) {
      console.error('Error resetting to defaults:', error);
    }
  };

  // This simulates what PostHog/Firebase does internally
  const switchVariant = async (variant: 'A' | 'B') => {
    const newExperiments = variant === 'A' ? DEFAULT_EXPERIMENTS_A : DEFAULT_EXPERIMENTS_B;
    try {
      setExp(newExperiments);
      await saveExperiments(newExperiments);
      track('variant_switched', {
        variant,
        experiments: newExperiments,
      });
      console.log(`[Experiments] Switched to Variant ${variant}`);
    } catch (error) {
      console.error('Error switching variant:', error);
    }
  };

  // Analytics tracking function (console logging only)
  const track = (event: string, props?: Record<string, any>) => {
    const analyticsData = {
      ...props,
      locale,
      experiments: exp,
      timestamp: new Date().toISOString(),
    };

    console.log('[Analytics]', JSON.stringify({ event, props: analyticsData }, null, 2));
  };

  return (
    <ExperimentContext.Provider
      value={{
        exp,
        locale,
        isLoading,
        track,
        refreshConfig,
        changeLocale,
        switchVariant,
        resetToDefaults,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};

export const useExperiments = (): ExperimentContextType => {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperiments must be used within ExperimentProvider');
  }
  return context;
};

