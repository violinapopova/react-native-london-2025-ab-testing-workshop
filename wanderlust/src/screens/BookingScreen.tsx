// BookingScreen: Detail screen for a destination with premium CTA badge
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Destination } from '../types';
import { useExperiments } from '../context/ExperimentContext';
import { useTranslation } from '../i18n/useTranslation';
import PremiumBadge from '../components/PremiumBadge';

type RootStackParamList = {
  Booking: { destination: Destination };
};

type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BookingScreen: React.FC = () => {
  const route = useRoute<BookingScreenRouteProp>();
  const navigation = useNavigation();
  const { destination } = route.params;
  const { exp, track } = useExperiments();
  const { t } = useTranslation();

  const handleBook = () => {
    track('booking_initiated', {
      destination_id: destination.id,
      premium_badge: exp.premium_badge,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            source={typeof destination.image === 'string' 
              ? { uri: destination.image } 
              : destination.image}
            style={styles.image}
            contentFit="cover"
          />
          <View style={styles.overlay} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.badgeContainer}>
            <PremiumBadge />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{destination.title}</Text>
          <Text style={styles.subtitle}>{destination.subtitle}</Text>
          {destination.description && (
            <Text style={styles.description}>{destination.description}</Text>
          )}
          {destination.price && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Starting from</Text>
              <Text style={styles.price}>{destination.price}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: exp.swipe_cta_color }]}
          onPress={handleBook}
        >
          <Text style={styles.bookButtonText}>
            {exp.swipe_cta_text === 'Book Now'
              ? t('book_now')
              : t('reserve_spot')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backText: {
    fontSize: 24,
    color: '#333',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  bookButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
