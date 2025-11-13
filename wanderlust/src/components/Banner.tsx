// Banner: Optional promotional banner (e.g., summer promo for fr locale)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFeatureFlag, usePostHog } from 'posthog-react-native';
import { useExperiments } from '../context/ExperimentContextPostHog';
import { useTranslation } from '../i18n/useTranslation';

interface BannerProps {
  onDismiss?: () => void;
}

const Banner: React.FC<BannerProps> = ({ onDismiss }) => {
  const { exp, locale, track } = useExperiments();
  const { t } = useTranslation();
  const postHog = usePostHog();
  
  // Method 1: Using our custom experiment context (current approach)
  const showBannerFromContext = locale === 'fr' && exp.show_summer_promo_fr;
  
  // Method 2: Using PostHog useFeatureFlag hook directly (recommended pattern)
  const bannerVariant = useFeatureFlag('summer-promo-banner');
  const showBannerFromPostHog = bannerVariant === 'enabled' || bannerVariant === true;
  
  // For demo purposes, let's use the context method but show both values
  const shouldShowBanner = showBannerFromContext; // Change this to showBannerFromPostHog to use PostHog directly

  if (!shouldShowBanner) {
    return null;
  }

  const handlePress = () => {
    // Track with both methods for comparison
    track('banner_clicked', {
      locale,
      banner_type: 'summer_promo',
      method: 'context',
    });
    
    // Direct PostHog tracking (following the docs pattern)
    postHog?.capture('banner_clicked', {
      locale,
      banner_type: 'summer_promo',
      banner_variant: bannerVariant,
      method: 'posthog_direct',
    });
    
    console.log('Banner clicked - Context method:', showBannerFromContext);
    console.log('Banner clicked - PostHog method:', showBannerFromPostHog);
    console.log('Banner variant from PostHog:', bannerVariant);
  };

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{t('summer_promo')}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <Text style={styles.dismissText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  dismissButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  dismissText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Banner;
