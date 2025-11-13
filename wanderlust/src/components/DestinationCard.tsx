import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useExperiments } from '../context/ExperimentContextPostHog';
import { Destination } from '../types';
import { useTranslation } from '../i18n/useTranslation';
import PremiumBadge from './PremiumBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const SWIPE_THRESHOLD = 100;

interface DestinationCardProps {
  destination: Destination;
  onSwipeRight: (destination: Destination) => void;
  onSwipeLeft: (destination: Destination) => void;
  index: number;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSwipeRight,
  onSwipeLeft,
  index,
}) => {
  const { exp, track } = useExperiments();
  const { t } = useTranslation();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      // Slight rotation based on swipe
      const rotation = event.translationX / 20;
      scale.value = 1 - Math.abs(event.translationX) / 1000;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        if (event.translationX > 0) {
          // Swipe right = save
          translateX.value = withSpring(SCREEN_WIDTH * 2);
          runOnJS(onSwipeRight)(destination);
          runOnJS(track)('swipe_save', {
            destination_id: destination.id,
            variant: exp.swipe_cta_text,
          });
        } else {
          // Swipe left = dislike
          translateX.value = withSpring(-SCREEN_WIDTH * 2);
          runOnJS(onSwipeLeft)(destination);
          runOnJS(track)('swipe_dislike', {
            destination_id: destination.id,
          });
        }
      } else {
        // Spring back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = translateX.value / 20;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
        { scale: scale.value },
      ],
    } as const;
  });

  const handleCtaPress = () => {
    track('cta_clicked', {
      destination_id: destination.id,
      cta_text: exp.swipe_cta_text,
      cta_color: exp.swipe_cta_color,
    });
    onSwipeRight(destination);
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.card,
          animatedStyle,
          { zIndex: 10 - index },
        ]}
      >
        <Image
          source={typeof destination.image === 'string' 
            ? { uri: destination.image } 
            : destination.image}
          style={styles.image}
          placeholder={{
            blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.',
          }}
          placeholderContentFit="cover"
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          recyclingKey={destination.id}
        />
        <View style={styles.overlay} />
        <View style={styles.content}>
          <PremiumBadge />
          <Text style={styles.title}>{destination.title}</Text>
          <Text style={styles.subtitle}>{destination.subtitle}</Text>
          {destination.description && (
            <Text style={styles.description}>{destination.description}</Text>
          )}
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: exp.swipe_cta_color }]}
            onPress={handleCtaPress}
          >
            <Text style={styles.ctaText}>
              {exp.swipe_cta_text === 'Book Now'
                ? t('book_now')
                : t('reserve_spot')}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 500,
    borderRadius: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 7, 121, 0.5)',
    borderRadius: 20,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
    opacity: 0.9,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
    opacity: 0.8,
  },
  ctaButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DestinationCard;
