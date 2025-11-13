import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import DestinationCard from '../components/DestinationCard';
import { Destination } from '../types';
import { mockDestinations } from '../utils/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/mockData';
import { useExperiments } from '../context/ExperimentContextPostHog';
import { useTranslation } from '../i18n/useTranslation';


const ExploreScreen: React.FC = () => {
  const { track } = useExperiments();
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedDestinations, setSavedDestinations] = useState<string[]>([]);

  useEffect(() => {
    loadDestinations();
    loadSavedDestinations();
  }, []);

  const loadDestinations = () => {
    setDestinations(mockDestinations);
  };

  const loadSavedDestinations = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_DESTINATIONS);
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        setSavedDestinations(parsed);
      }
    } catch (error) {
      console.error('Error loading saved destinations:', error);
    }
  };

  const handleSwipeRight = async (destination: Destination) => {
    if (savedDestinations.includes(destination.id)) {
      console.log('Destination already saved:', destination.id);
      setCurrentIndex((currentIndex + 1) % destinations.length);
      return;
    }

    // Save destination
    try {
      const updated = [...savedDestinations, destination.id];
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_DESTINATIONS,
        JSON.stringify(updated)
      );
      setSavedDestinations(updated);
      console.log('Destination saved successfully:', destination.id, 'Total saved:', updated.length);
      track('destination_saved', {
        destination_id: destination.id,
      });
    } catch (error) {
      console.error('Error saving destination:', error);
    }

    // Move to next card (loop infinitely)
    setCurrentIndex((currentIndex + 1) % destinations.length);
  };

  const handleSwipeLeft = (destination: Destination) => {
    setCurrentIndex((currentIndex + 1) % destinations.length);
  };

  // Get visible cards (show 3 at a time for stacking effect)
  // Handle wrapping around for infinite loop
  const getVisibleCards = () => {
    const cards: Destination[] = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % destinations.length;
      cards.push(destinations[index]);
    }
    return cards;
  };
  
  const visibleCards = getVisibleCards();

  if (destinations.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('explore')}</Text>
      </View>
      <View style={styles.cardsContainer}>
        {visibleCards.map((destination, index) => (
          <DestinationCard
            key={`${destination.id}-${currentIndex}-${index}`}
            destination={destination}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            index={index}
          />
        ))}
      </View>
      <View style={styles.hints}>
        <Text style={styles.hintText}>{t('swipe_to_save')}</Text>
        <Text style={styles.hintText}>{t('swipe_to_dislike')}</Text>
      </View>
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
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  hints: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
    color: '#999',
    marginVertical: 2,
  },
});

export default ExploreScreen;
