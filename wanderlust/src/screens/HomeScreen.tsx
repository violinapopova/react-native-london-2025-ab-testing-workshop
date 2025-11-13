import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import ExploreScreen from './ExploreScreen';
import SavedScreen from './SavedScreen';
import LocalDealsScreen from './LocalDealsScreen';
import { useExperiments } from '../context/ExperimentContextPostHog';
import { useTranslation } from '../i18n/useTranslation';
import Banner from '../components/Banner';
import LanguageSwitcher from '../components/LanguageSwitcher';
import DebugMenu from '../components/DebugMenu';

const Tab = createBottomTabNavigator();

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { exp, locale } = useExperiments();
  const { t } = useTranslation();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [debugMenuVisible, setDebugMenuVisible] = useState(false);
  
  // Detect current variant based on experiment values
  // Variant B: 3-step onboarding, Reserve Spot, Elite badge, Green color
  const currentVariant: 'A' | 'B' = 
    exp.onboarding_steps === 3 && 
    exp.swipe_cta_text === 'Reserve Spot' && 
    exp.premium_badge === 'elite' 
      ? 'B' 
      : 'A';

  // Determine if LocalDeals tab should be shown
  const showLocalDeals =
    locale === 'es' && exp.show_local_deals_es;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with app title, language switcher, debug menu, and search */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Wanderlust</Text>
        <View style={styles.headerButtons}>
          {__DEV__ && (
            <TouchableOpacity
              style={styles.gearButton}
              onPress={() => setDebugMenuVisible(true)}
            >
              <Icon name="settings" size={20} color="#666" />
            </TouchableOpacity>
          )}
          {__DEV__ && (
            <TouchableOpacity
              style={styles.postHogButton}
              onPress={() => navigation.navigate('PostHogExample')}
            >
              <Icon name="science" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          )}
          <LanguageSwitcher />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Icon name="search" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summer promo banner (fr locale only) */}
      {!bannerDismissed && (
        <Banner onDismiss={() => setBannerDismissed(true)} />
      )}
      
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FF6B6B',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            height: Platform.OS === 'ios' ? 80 : 60,
          },
        }}
      >
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="explore" size={size} color={color} />
            ),
            tabBarLabel: t('explore'),
          }}
        />
        <Tab.Screen
          name="Saved"
          component={SavedScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="bookmark" size={size} color={color} />
            ),
            tabBarLabel: t('saved'),
          }}
        />
        {showLocalDeals && (
          <Tab.Screen
            name="LocalDeals"
            component={LocalDealsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="local-offer" size={size} color={color} />
              ),
              tabBarLabel: t('local_deals'),
            }}
          />
        )}
      </Tab.Navigator>

      {/* Debug menu modal (dev only) */}
      {__DEV__ && (
        <DebugMenu
          visible={debugMenuVisible}
          onClose={() => setDebugMenuVisible(false)}
          currentVariant={currentVariant}
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  gearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  postHogButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
});

export default HomeScreen;
