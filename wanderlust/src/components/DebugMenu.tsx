import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useExperiments } from '../context/ExperimentContext';
import { useTranslation } from '../i18n/useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/mockData';

interface DebugMenuProps {
  visible: boolean;
  onClose: () => void;
  currentVariant: 'A' | 'B';
}

const DebugMenu: React.FC<DebugMenuProps> = ({ visible, onClose, currentVariant }) => {
  const { refreshConfig, isLoading, switchVariant, resetToDefaults } = useExperiments();
  const { t } = useTranslation();

  const handleRefreshConfig = async () => {
    await refreshConfig();
    onClose();
    Alert.alert(
      t('config_refreshed'),
      '',
      [{ text: 'OK' }]
    );
  };

  const handleSwitchVariant = async () => {
    const newVariant = currentVariant === 'A' ? 'B' : 'A';
    await switchVariant(newVariant);
    onClose();
    Alert.alert(
      `Switched to Variant ${newVariant}`,
      `Now using: ${newVariant === 'B' ? '3-step onboarding, Reserve Spot CTA, Elite badge, Green color' : '1-step onboarding, Book Now CTA, Pro badge, Red color'}`,
      [{ text: 'OK' }]
    );
  };

  const handleResetExperiments = async () => {
    await resetToDefaults();
    onClose();
    Alert.alert(
      'Experiments Reset',
      'All experiments have been reset to default values (Variant A).',
      [{ text: 'OK' }]
    );
  };

  const handleResetOnboarding = async () => {
    onClose();
    Alert.alert(
      'Reset Onboarding',
      'This will reset onboarding and restart the app. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
              Alert.alert(
                'Onboarding Reset',
                'Please restart the app to see onboarding again.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('Error resetting onboarding:', error);
              Alert.alert('Error', 'Failed to reset onboarding');
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.debugMenu}>
          <View style={styles.debugMenuHeader}>
            <Text style={styles.debugMenuTitle}>Debug Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.debugMenuItem}
            onPress={handleRefreshConfig}
            disabled={isLoading}
          >
            <Icon name="refresh" size={20} color="#666" />
            <Text style={styles.debugMenuItemText}>
              {t('refresh_config')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.debugMenuItem}
            onPress={handleSwitchVariant}
          >
            <Icon name="science" size={20} color="#34C759" />
            <Text style={styles.debugMenuItemText}>
              Switch to Variant {currentVariant === 'A' ? 'B' : 'A'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.debugMenuItem}
            onPress={handleResetExperiments}
          >
            <Icon name="settings-backup-restore" size={20} color="#FF9500" />
            <Text style={styles.debugMenuItemText}>
              Reset Experiments to Defaults
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.debugMenuItem}
            onPress={handleResetOnboarding}
          >
            <Icon name="restart-alt" size={20} color="#FF3B30" />
            <Text style={styles.debugMenuItemText}>
              Reset Onboarding
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  debugMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  debugMenuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  debugMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  debugMenuItemText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});

export default DebugMenu;