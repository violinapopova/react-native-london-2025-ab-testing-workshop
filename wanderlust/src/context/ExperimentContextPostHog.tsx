// PostHog A/B testing integration
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { usePostHog } from 'posthog-react-native';
import { ExperimentConfig, ExperimentContextType } from '../types';
import { STORAGE_KEYS } from '../utils/mockData';
import { updateLocale } from '../i18n/i18n';

// Experiment keys in PostHog
const EXPERIMENTS = {
  CTA_VARIANT: 'wanderlust-cta-variant',
  ONBOARDING_FLOW: 'wanderlust-onboarding-flow',
  PREMIUM_BADGE: 'wanderlust-premium-badge',
  SEARCH_PLACEHOLDER: 'wanderlust-search-placeholder',
  LOCAL_DEALS_EN: 'wanderlust-local-deals-en',
  LOCAL_DEALS_ES: 'wanderlust-local-deals-es',
  LOCAL_DEALS_FR: 'wanderlust-local-deals-fr',
  SUMMER_PROMO_FR: 'wanderlust-summer-promo-fr',
};

// Default configuration (fallback)
const DEFAULT_EXPERIMENTS: ExperimentConfig = {
  swipe_cta_text: 'Book Now',
  swipe_cta_color: '#FF5757',
  onboarding_steps: 1,
  premium_badge: 'pro',
  search_placeholder: 'Search destinations...',
  show_local_deals_en: false,
  show_local_deals_es: true,
  show_local_deals_fr: false,
  show_summer_promo_fr: true,
};

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

interface ExperimentProviderProps {
  children: ReactNode;
}

export const ExperimentProvider: React.FC<ExperimentProviderProps> = ({ children }) => {
  const [exp, setExp] = useState<ExperimentConfig>(DEFAULT_EXPERIMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<string>('en');
  const [isPostHogReady, setIsPostHogReady] = useState(false);
  
  let postHog: any = null;
  
  // Safely get PostHog hook with error handling
  try {
    postHog = usePostHog();
  } catch (error) {
    console.warn('[PostHog] Navigation context not ready, postponing initialization:', error.message);
  }

  // Load experiments when PostHog is ready
  useEffect(() => {
    if (postHog && !isPostHogReady) {
      console.log('[PostHog] PostHog instance ready, initializing...');
      setIsPostHogReady(true);
      
      // Small delay to ensure navigation is fully ready
      setTimeout(() => {
        loadExperiments();
        detectLocale().catch((error) => {
          console.error('Error detecting locale:', error);
        });
      }, 100);
    } else if (!postHog && !isPostHogReady) {
      // Use defaults if PostHog is not available
      console.log('[PostHog] Not available, using defaults');
      setIsLoading(false);
    }
  }, [postHog, isPostHogReady]);

  const detectLocale = async () => {
    // First check if user has saved a locale preference
    try {
      const savedLocale = await AsyncStorage.getItem(STORAGE_KEYS.APP_LOCALE);
      if (savedLocale) {
        const supportedLocales = ['en', 'es', 'fr'];
        if (supportedLocales.includes(savedLocale)) {
          setLocale(savedLocale);
          updateLocale(savedLocale);
          // Set user property in PostHog
          if (postHog) {
            postHog.identify(undefined, { locale: savedLocale });
          }
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
    
    // Set user property in PostHog
    if (postHog) {
      postHog.identify(undefined, { locale: detectedLocale });
    }
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
      
      // Update PostHog user properties
      if (postHog) {
        postHog.identify(undefined, { locale: newLocale });
      }
      
      track('locale_changed', {
        new_locale: newLocale,
      });
    } catch (error) {
      console.error('Error saving locale:', error);
    }
  };

  const loadExperiments = async () => {
    try {
      console.log('[PostHog] Loading experiments...');
      
      // Wait for PostHog to be ready and reload feature flags
      if (postHog) {
        await postHog.reloadFeatureFlags();
      }
      
      // Get actual feature flags from PostHog with payloads
      const ctaVariant = postHog?.getFeatureFlag(EXPERIMENTS.CTA_VARIANT) as any;
      const onboardingVariant = postHog?.getFeatureFlag(EXPERIMENTS.ONBOARDING_FLOW) as any;
      const badgeVariant = postHog?.getFeatureFlag(EXPERIMENTS.PREMIUM_BADGE) as any;
      const searchVariant = postHog?.getFeatureFlag(EXPERIMENTS.SEARCH_PLACEHOLDER) as any;
      
      const experiments: ExperimentConfig = {
        // CTA experiment - get from PostHog payload
        swipe_cta_text: ctaVariant?.text || 'Book Now',
        swipe_cta_color: ctaVariant?.color || '#FF5757',
        
        // Onboarding experiment
        onboarding_steps: onboardingVariant?.steps || 1,
        
        // Premium badge experiment
        premium_badge: badgeVariant?.badge || 'pro',
        
        // Search placeholder experiment
        search_placeholder: searchVariant?.placeholder || 'Search destinations...',
        
        // Locale-based feature flags (boolean flags don't need payloads)
        show_local_deals_en: postHog?.getFeatureFlag(EXPERIMENTS.LOCAL_DEALS_EN) === true,
        show_local_deals_es: postHog?.getFeatureFlag(EXPERIMENTS.LOCAL_DEALS_ES) === true || true, // Default enabled for demo
        show_local_deals_fr: postHog?.getFeatureFlag(EXPERIMENTS.LOCAL_DEALS_FR) === true,
        show_summer_promo_fr: postHog?.getFeatureFlag(EXPERIMENTS.SUMMER_PROMO_FR) === true || true, // Default enabled for demo
      };

      setExp(experiments);
      console.log('[PostHog] Experiments loaded:', experiments);
      
      // Track experiment assignment (only if PostHog is available)
      if (postHog) {
        postHog.capture('experiments_loaded', {
          source: 'posthog',
          cta_variant: experiments.swipe_cta_text,
          onboarding_steps: experiments.onboarding_steps,
          premium_badge: experiments.premium_badge,
          search_placeholder: experiments.search_placeholder,
        });
      }
      
    } catch (error) {
      console.error('Error loading experiments from PostHog:', error);
      // Fallback to defaults
      setExp(DEFAULT_EXPERIMENTS);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshConfig = async () => {
    if (!postHog) return;
    
    setIsLoading(true);
    try {
      console.log('[PostHog] Refreshing config...');
      // Reload feature flags from PostHog
      await postHog.reloadFeatureFlags();
      await loadExperiments();
    } catch (error) {
      console.error('Error refreshing PostHog config:', error);
      setIsLoading(false);
    }
  };

  const resetToDefaults = async () => {
    try {
      console.log('[PostHog] Resetting to defaults...');
      
      // Clear any local storage that might affect experiments
      await AsyncStorage.removeItem(STORAGE_KEYS.AB_EXPERIMENTS);
      
      // Reset to defaults
      setExp(DEFAULT_EXPERIMENTS);
      
      track('experiments_reset_to_defaults', {
        source: 'posthog',
      });
    } catch (error) {
      console.error('Error resetting PostHog experiments:', error);
    }
  };

  const switchVariant = async (variant: 'A' | 'B') => {
    // In a real PostHog setup, you wouldn't manually switch variants
    // This is for demo purposes only
    console.log(`[PostHog Demo] Simulating switch to Variant ${variant}`);
    
    const newExperiments: ExperimentConfig = variant === 'A' ? {
      swipe_cta_text: 'Book Now',
      swipe_cta_color: '#FF5757',
      onboarding_steps: 1,
      premium_badge: 'pro',
      search_placeholder: 'Search destinations...',
      show_local_deals_en: false,
      show_local_deals_es: true,
      show_local_deals_fr: false,
      show_summer_promo_fr: true,
    } : {
      swipe_cta_text: 'Reserve Spot',
      swipe_cta_color: '#4CAF50',
      onboarding_steps: 3,
      premium_badge: 'elite',
      search_placeholder: 'Where to next?',
      show_local_deals_en: false,
      show_local_deals_es: true,
      show_local_deals_fr: false,
      show_summer_promo_fr: true,
    };

    setExp(newExperiments);
    
    track('variant_switched', {
      variant,
      source: 'manual_override',
      experiments: newExperiments,
    });
    
    console.log(`[PostHog Demo] Switched to Variant ${variant}`);
  };

  // Analytics tracking function using PostHog
  const track = (event: string, props?: Record<string, any>) => {
    const analyticsData = {
      ...props,
      locale,
      timestamp: new Date().toISOString(),
    };

    if (postHog) {
      postHog.capture(event, analyticsData);
      console.log('[PostHog] Event tracked:', event, analyticsData);
    } else {
      console.log('[PostHog] Not available, logging locally:', event, analyticsData);
    }
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