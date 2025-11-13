import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { PostHogProvider } from 'posthog-react-native';
import { ExperimentProvider } from './src/context/ExperimentContextPostHog';
import AppNavigator from './src/components/AppNavigator';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PostHogProvider 
        apiKey="phc_usiiINoMz7zMeM8YYO15KmwNXr04opopRG3Ah3AeBd8" 
        options={{
          host: "https://app.posthog.com",
        }}
      >
        <ExperimentProvider>
          <StatusBar barStyle="dark-content" />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ExperimentProvider>
      </PostHogProvider>
    </GestureHandlerRootView>
  );
};

export default App;
