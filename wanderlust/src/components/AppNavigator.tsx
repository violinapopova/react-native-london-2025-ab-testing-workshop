import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import SearchScreen from '../screens/SearchScreen';
import PostHogExample from '../components/PostHogExample';
import { STORAGE_KEYS } from '../utils/mockData';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      setIsOnboardingComplete(completed === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingComplete(false);
    }
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  if (isOnboardingComplete === null) {
    return null; // Loading state
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isOnboardingComplete ? (
        <Stack.Screen name="Onboarding">
          {(props) => (
            <OnboardingScreen
              {...props}
              onComplete={handleOnboardingComplete}
            />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="PostHogExample"
            component={PostHogExample}
            options={{ 
              title: 'PostHog A/B Test Demo',
              headerShown: true,
              presentation: 'modal'
            }}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{ 
              presentation: 'modal',
              headerShown: false 
            }}
          />
          <Stack.Screen
            name="Booking"
            component={BookingScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;