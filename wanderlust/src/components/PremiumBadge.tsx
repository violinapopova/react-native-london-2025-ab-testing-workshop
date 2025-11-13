import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useExperiments } from '../context/ExperimentContext';
import { useTranslation } from '../i18n/useTranslation';

const PremiumBadge: React.FC = () => {
  const { exp } = useExperiments();
  const { t } = useTranslation();
  
  // Get badge text based on experiment variant
  const badgeText = exp.premium_badge === 'pro' 
    ? t('pro') 
    : t('elite');

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{badgeText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default PremiumBadge;
