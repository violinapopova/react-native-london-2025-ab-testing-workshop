import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useExperiments } from '../context/ExperimentContext';
import { useTranslation } from '../i18n/useTranslation';
import { mockDestinations } from '../utils/mockData';
import { Destination } from '../types';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { exp, track } = useExperiments();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Get placeholder from experiment config
  const placeholder =
    exp.search_placeholder === 'Search destinations...'
      ? t('search_placeholder')
      : t('search_placeholder_alt');

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const query = searchQuery.toLowerCase();
    return mockDestinations.filter(
      (dest) =>
        dest.title.toLowerCase().includes(query) ||
        dest.subtitle.toLowerCase().includes(query) ||
        dest.description?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      track('search_query', {
        query: text,
        results_count: filteredDestinations.length,
      });
    }
  };

  const handleDestinationPress = (destination: Destination) => {
    track('search_result_clicked', {
      destination_id: destination.id,
      query: searchQuery,
    });
    navigation.navigate('Booking', { destination });
  };

  const handleSubmit = () => {
    track('search_submitted', {
      query: searchQuery,
      results_count: filteredDestinations.length,
    });
  };

  const renderDestination = ({ item }: { item: Destination }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleDestinationPress(item)}
    >
      <Image
        source={typeof item.image === 'string' 
          ? { uri: item.image } 
          : item.image}
        style={styles.resultImage}
        contentFit="cover"
      />
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearchChange}
          onSubmitEditing={handleSubmit}
          autoFocus
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      {searchQuery.trim() ? (
        filteredDestinations.length > 0 ? (
          <FlatList
            data={filteredDestinations}
            renderItem={renderDestination}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No results found</Text>
          </View>
        )
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Start typing to search...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 12,
  },
  closeButton: {
    paddingVertical: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultImage: {
    width: 80,
    height: 80,
  },
  resultContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default SearchScreen;