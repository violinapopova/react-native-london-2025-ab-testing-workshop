// Example component showing PostHog useFeatureFlag pattern
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFeatureFlag, usePostHog } from 'posthog-react-native';

const PostHogExampleScreen: React.FC = () => {
  const postHog = usePostHog();
  
  // Example 1: Simple boolean flag
  const showNewFeature = useFeatureFlag('show-new-feature');
  
  // Example 2: Multi-variant flag with payload (like from the docs)
  const backgroundExperiment = useFeatureFlag('background-color-test') as any;
  
  // Example 3: String variant flag with payload
  const buttonTextVariant = useFeatureFlag('button-text-variant') as any;
  
  // Determine background color based on payload
  const getBackgroundColor = () => {
    if (backgroundExperiment?.color) return backgroundExperiment.color;
    if (backgroundExperiment === 'test') return '#4CAF50'; // Fallback for simple variant
    if (backgroundExperiment === 'control') return '#FF5757';
    return '#2196F3'; // Blue for default/fallback
  };
  
  // Determine button text based on payload
  const getButtonText = () => {
    if (buttonTextVariant?.text) return buttonTextVariant.text;
    if (buttonTextVariant === 'urgent') return 'Book Now!'; // Fallback for simple variant
    if (buttonTextVariant === 'casual') return 'Reserve Spot';
    return 'Book Now'; // Default
  };
  
  const handleButtonPress = () => {
    // Track the conversion event
    postHog?.capture('button_clicked', {
      background_variant: backgroundExperiment,
      button_text_variant: buttonTextVariant,
      feature_enabled: showNewFeature,
    });
    
    console.log('Button clicked with variants:', {
      background: backgroundExperiment,
      buttonText: buttonTextVariant,
      newFeature: showNewFeature,
    });
  };
  
  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.title}>PostHog A/B Test Example</Text>
      
      <Text style={styles.variantInfo}>
        Background Variant: {backgroundExperiment?.name || backgroundExperiment || 'not-set'}
      </Text>
      
      <Text style={styles.variantInfo}>
        Button Text Variant: {buttonTextVariant?.style || buttonTextVariant || 'not-set'}
      </Text>
      
      <Text style={styles.variantInfo}>
        New Feature Enabled: {showNewFeature ? 'Yes' : 'No'}
      </Text>
      
      {(backgroundExperiment?.color || buttonTextVariant?.text) && (
        <View style={styles.payloadInfo}>
          <Text style={styles.payloadTitle}>📦 Payloads:</Text>
          {backgroundExperiment?.color && (
            <Text style={styles.payloadText}>
              Background: {backgroundExperiment.color} ({backgroundExperiment.name})
            </Text>
          )}
          {buttonTextVariant?.text && (
            <Text style={styles.payloadText}>
              Button: "{buttonTextVariant.text}" ({buttonTextVariant.style})
            </Text>
          )}
        </View>
      )}
      
      {showNewFeature && (
        <View style={styles.newFeature}>
          <Text style={styles.newFeatureText}>
            🎉 New Feature is Enabled!
          </Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleButtonPress}
      >
        <Text style={styles.buttonText}>
          {getButtonText()}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How this works:</Text>
        <Text style={styles.infoText}>
          • useFeatureFlag hooks fetch flags from PostHog{'\n'}
          • Background color changes based on 'background-color-test' flag{'\n'}
          • Button text changes based on 'button-text-variant' flag{'\n'}
          • New feature shows when 'show-new-feature' is true{'\n'}
          • All interactions are tracked for analytics
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  variantInfo: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  newFeature: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  newFeatureText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    maxWidth: '90%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  payloadInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    maxWidth: '90%',
  },
  payloadTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  payloadText: {
    fontSize: 12,
    color: 'white',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
});

export default PostHogExampleScreen;