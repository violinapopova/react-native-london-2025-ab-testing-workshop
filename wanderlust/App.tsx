import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { PostHogProvider } from 'posthog-react-native';
import { ExperimentProvider } from './src/context/ExperimentContextPostHog';
import AppNavigator from './src/components/AppNavigator';

const App: React.FC = () => {
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer
        onReady={() => {
          console.log('[Navigation] Container ready');
          setIsNavigationReady(true);
        }}
      >
        {isNavigationReady && (
          <PostHogProvider 
            apiKey="phc_usiiINoMz7zMeM8YYO15KmwNXr04opopRG3Ah3AeBd8" 
            options={{
              host: "https://app.posthog.com",
            }}
          >
            <ExperimentProvider>
              <AppNavigator />
            </ExperimentProvider>
          </PostHogProvider>
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
