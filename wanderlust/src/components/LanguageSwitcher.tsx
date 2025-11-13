import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useExperiments } from '../context/ExperimentContext';
import { useTranslation } from '../i18n/useTranslation';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const LanguageSwitcher: React.FC = () => {
  const { locale, changeLocale } = useExperiments();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode !== locale) {
      await changeLocale(languageCode);
    }
    setModalVisible(false);
  };

  const renderLanguageItem = ({ item }: { item: typeof LANGUAGES[0] }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        item.code === locale && styles.languageItemActive,
      ]}
      onPress={() => handleLanguageSelect(item.code)}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <Text
        style={[
          styles.languageName,
          item.code === locale && styles.languageNameActive,
        ]}
      >
        {item.name}
      </Text>
      {item.code === locale && (
        <Icon name="check" size={20} color="#FF6B6B" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flag}>{currentLanguage.flag}</Text>
        <Text style={styles.buttonText}>{currentLanguage.code.toUpperCase()}</Text>
        <Icon name="arrow-drop-down" size={20} color="#333" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('select_language')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={LANGUAGES}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              style={styles.languageList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  flag: {
    fontSize: 18,
    marginRight: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '80%',
    maxWidth: 300,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageItemActive: {
    backgroundColor: '#fff5f5',
  },
  languageName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  languageNameActive: {
    fontWeight: '600',
    color: '#FF6B6B',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
});

export default LanguageSwitcher;
