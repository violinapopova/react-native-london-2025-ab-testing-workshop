// Banner: Optional promotional banner (e.g., summer promo for fr locale)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useExperiments } from '../context/ExperimentContext';
import { useTranslation } from '../i18n/useTranslation';

interface BannerProps {
  onDismiss?: () => void;
}

const Banner: React.FC<BannerProps> = ({ onDismiss }) => {
  const { exp, locale, track } = useExperiments();
  const { t } = useTranslation();

  // Show banner only if locale is fr and flag is enabled
  if (locale !== 'fr' || !exp.show_summer_promo_fr) {
    return null;
  }

  const handlePress = () => {
    track('banner_clicked', {
      locale,
      banner_type: 'summer_promo',
    });
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
