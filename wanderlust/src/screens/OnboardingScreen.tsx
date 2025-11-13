// OnboardingScreen: Conditional 1-step or 3-step onboarding flow
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useExperiments } from '../context/ExperimentContextPostHog';
import { useTranslation } from '../i18n/useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/mockData';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { exp, track } = useExperiments();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const isScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  
  const steps = exp.onboarding_steps === 1 ? 1 : 3;
  const isMultiStep = steps > 1;

  useEffect(() => {
    if (isMultiStep && scrollViewRef.current && !isScrollingRef.current) {
      scrollViewRef.current.scrollTo({ x: currentStep * SCREEN_WIDTH, animated: true });
    }
  }, [currentStep, isMultiStep]);

  const handleScroll = (event: any) => {
    if (!isMultiStep || isProgrammaticScrollRef.current) return;
    
    const offsetX = event.nativeEvent.contentOffset.x;
    const newStep = Math.round(offsetX / SCREEN_WIDTH);
    
    // Only update if step actually changed and is valid
    if (newStep !== currentStep && newStep >= 0 && newStep < steps) {
      setCurrentStep(newStep);
      track('onboarding_step_viewed', {
        step: newStep + 1,
        total_steps: steps,
      });
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    if (!isMultiStep) return;
    
    const offsetX = event.nativeEvent.contentOffset.x;
    const newStep = Math.round(offsetX / SCREEN_WIDTH);
    
    // Ensure step is within valid range (0 to steps-1)
    const validStep = Math.max(0, Math.min(newStep, steps - 1));
    
    // Always update step on momentum scroll end to ensure correct state
    if (validStep !== currentStep) {
      setCurrentStep(validStep);
      track('onboarding_step_viewed', {
        step: validStep + 1,
        total_steps: steps,
      });
    }
    
    // Reset flags after scroll completes
    isScrollingRef.current = false;
    isProgrammaticScrollRef.current = false;
  };

  const handleScrollBeginDrag = () => {
    isScrollingRef.current = true;
    isProgrammaticScrollRef.current = false;
  };

  const handleScrollEndDrag = (event: any) => {
    // Ensure we can detect the final step after drag ends
    if (!isMultiStep) return;
    
    const offsetX = event.nativeEvent.contentOffset.x;
    const newStep = Math.round(offsetX / SCREEN_WIDTH);
    const validStep = Math.max(0, Math.min(newStep, steps - 1));
    
    // Update step immediately on drag end for better responsiveness
    if (validStep !== currentStep) {
      setCurrentStep(validStep);
    }
  };

  const handleNext = () => {
    if (isMultiStep && currentStep < steps - 1) {
      const nextStep = currentStep + 1;
      // Set flag to prevent scroll handler from interfering
      isProgrammaticScrollRef.current = true;
      setCurrentStep(nextStep);
      // Explicitly scroll to next step
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: nextStep * SCREEN_WIDTH, animated: true });
      }
      track('onboarding_step_viewed', {
        step: nextStep + 1,
        total_steps: steps,
      });
      // Reset flag after animation completes (approximately 300ms)
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 350);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    track('onboarding_complete', {
      steps: steps,
      variant: exp.onboarding_steps === 1 ? 'single_step' : 'multi_step',
    });
    onComplete();
  };

  const handleSkip = () => {
    track('onboarding_skipped', {
      step: currentStep + 1,
      total_steps: steps,
    });
    handleComplete();
  };

  const onboardingImages = [
    require('../../assets/images/discover.png'), // Step 1
    require('../../assets/images/bookmark.png'), // Step 2
    require('../../assets/images/travel.png'), // Step 3
  ];

  const renderStep = (stepIndex: number) => {
    const titles = [
      t('onboarding_title_1'),
      t('onboarding_title_2'),
      t('onboarding_title_3'),
    ];
    const descriptions = [
      t('onboarding_desc_1'),
      t('onboarding_desc_2'),
      t('onboarding_desc_3'),
    ];

    return (
      <View key={stepIndex} style={styles.stepContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={onboardingImages[stepIndex]}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        </View>
        <Text style={styles.title}>{titles[stepIndex]}</Text>
        <Text style={styles.description}>{descriptions[stepIndex]}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEnabled={isMultiStep}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        {isMultiStep ? (
          // Multi-step: show all 3 steps
          Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.page}>
              {renderStep(index)}
            </View>
          ))
        ) : (
          // Single-step: show only first step
          <View style={styles.page}>
            {renderStep(0)}
          </View>
        )}
      </ScrollView>

      {/* Indicators for multi-step */}
      {isMultiStep && (
        <View style={styles.indicators}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentStep === index && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        {isMultiStep && currentStep < steps - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleNext} style={styles.ctaButton}>
          <Text style={styles.ctaText}>
            {currentStep === steps - 1 || !isMultiStep
              ? t('get_started')
              : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 26,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  actions: {
    paddingHorizontal: 40,
    paddingBottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  ctaText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;