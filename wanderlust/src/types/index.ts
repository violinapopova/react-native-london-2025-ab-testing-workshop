export interface Destination {
  id: string;
  title: string;
  subtitle: string;
  image: string | number;
  description?: string;
  price?: string;
}

export interface ExperimentConfig {
  swipe_cta_text: 'Book Now' | 'Reserve Spot';
  swipe_cta_color: '#FF5757' | '#4CAF50';
  
  onboarding_steps: number; // 1 | 3
  
  premium_badge: 'pro' | 'elite';
  
  search_placeholder: 'Search destinations...' | 'Where to next?';
  
  // Locale-specific feature flags
  show_local_deals_en: boolean;
  show_local_deals_es: boolean;
  show_local_deals_fr: boolean;
  
  show_summer_promo_fr: boolean;
}

export interface ExperimentContextType {
  exp: ExperimentConfig;
  locale: string;
  isLoading: boolean;
  track: (event: string, props?: Record<string, any>) => void;
  refreshConfig: () => Promise<void>;
  changeLocale: (newLocale: string) => Promise<void>;
  switchVariant: (variant: 'A' | 'B') => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

