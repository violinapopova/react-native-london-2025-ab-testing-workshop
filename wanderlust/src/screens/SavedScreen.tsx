import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/mockData';
import { mockDestinations } from '../utils/mockData';
import { Destination } from '../types';
import { useExperiments } from '../context/ExperimentContext';
import { useTranslation } from '../i18n/useTranslation';

const SavedScreen: React.FC = () => {
  const { track } = useExperiments();
  const { t } = useTranslation();
  const [savedDestinations, setSavedDestinations] = useState<Destination[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSavedDestinations();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSavedDestinations();
    }, [])
  );

  const loadSavedDestinations = async () => {
    try {
      const savedIds = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_DESTINATIONS);
      if (savedIds) {
        const ids = JSON.parse(savedIds) as string[];
        const destinations = mockDestinations.filter((d) => ids.includes(d.id));
        setSavedDestinations(destinations);
      }
    } catch (error) {
      console.error('Error loading saved destinations:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSavedDestinations();
    setRefreshing(false);
  };

  const handleRemove = async (destinationId: string) => {
    try {
      const savedIds = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_DESTINATIONS);
      if (savedIds) {
        const ids = JSON.parse(savedIds) as string[];
        const updated = ids.filter((id) => id !== destinationId);
        await AsyncStorage.setItem(
          STORAGE_KEYS.SAVED_DESTINATIONS,
          JSON.stringify(updated)
        );
        track('destination_removed', {
          destination_id: destinationId,
        });
        await loadSavedDestinations();
      }
    } catch (error) {
      console.error('Error removing destination:', error);
    }
  };

  const renderDestination = ({ item }: { item: Destination }) => (
    <View style={styles.card}>
      <Image
        source={typeof item.image === 'string' 
          ? { uri: item.image } 
          : item.image}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleRemove(item.id)}
          style={styles.removeButton}
        >
          <Text style={styles.removeText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (savedDestinations.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('saved_destinations')}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('no_saved')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('saved_destinations')}</Text>
      </View>
      <FlatList
        data={savedDestinations}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 24,
    color: '#666',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default SavedScreen;
