// LocalDealsScreen: List of local deals (shown only for es locale when flag enabled)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useExperiments } from '../context/ExperimentContext';
import { useTranslation } from '../i18n/useTranslation';

interface LocalDeal {
  id: string;
  title: string;
  discount: string;
  description: string;
}

const mockDeals: LocalDeal[] = [
  {
    id: '1',
    title: 'Madrid Tapas Tour',
    discount: '50%',
    description: 'Experience authentic Spanish tapas in the heart of Madrid',
  },
  {
    id: '2',
    title: 'Barcelona Flamenco Show',
    discount: '30%',
    description: 'Enjoy a traditional flamenco performance with dinner',
  },
  {
    id: '3',
    title: 'Seville Cathedral Tour',
    discount: '25%',
    description: 'Skip-the-line access to the magnificent Seville Cathedral',
  },
  {
    id: '4',
    title: 'Valencia Paella Cooking Class',
    discount: '40%',
    description: 'Learn to cook authentic paella from local chefs',
  },
  {
    id: '5',
    title: 'Granada Alhambra Express',
    discount: '35%',
    description: 'Fast-track entry to the stunning Alhambra palace',
  },
];

const LocalDealsScreen: React.FC = () => {
  const { track, locale } = useExperiments();
  const { t } = useTranslation();

  const handleDealPress = (deal: LocalDeal) => {
    track('local_deal_clicked', {
      deal_id: deal.id,
      locale,
    });
  };

  const renderDeal = ({ item }: { item: LocalDeal }) => (
    <TouchableOpacity
      style={styles.dealCard}
      onPress={() => handleDealPress(item)}
    >
      <View style={styles.dealHeader}>
        <Text style={styles.dealTitle}>{item.title}</Text>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{item.discount}</Text>
        </View>
      </View>
      <Text style={styles.dealDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('local_deals_title')}</Text>
        <Text style={styles.headerSubtitle}>{t('local_deals_subtitle')}</Text>
      </View>
      <FlatList
        data={mockDeals}
        renderItem={renderDeal}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 16,
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  discountBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dealDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default LocalDealsScreen;
