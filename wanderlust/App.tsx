import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExperimentProvider } from './src/context/ExperimentContext';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import BookingScreen from './src/screens/BookingScreen';
import SearchScreen from './src/screens/SearchScreen';
import { STORAGE_KEYS } from './src/utils/mockData';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
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
    return null; 
  }

  const appContent = (
    <ExperimentProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
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
      </NavigationContainer>
    </ExperimentProvider>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {appContent}
    </GestureHandlerRootView>
  );
};

export default App;
