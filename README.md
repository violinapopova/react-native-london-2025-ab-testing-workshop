# React Native London 2025 A/B Testing Workshop

## How to Use This Repo

This workshop is structured as a progressive hands-on session, building from local A/B testing basics to full remote integrations. We'll use the provided starter repo (link forthcoming—check the workshop invite email or Slack for the GitHub URL once pushed). The repo will include:

- **Local Testing Folder** (`local-testing/`): A simple Expo managed React Native travel app with Context + AsyncStorage for variant mocking. Start here for the intro exercises.
- **Posthog Integration** (`expo-posthog/`): The Expo Managed React Native travel app integrated with PostHog for remote flags and events.
- **Bare React Native App** (`bare-app/`): The same travel app ejected to bare workflow, using Firebase Remote Config.

**Workshop Flow**:
1. **Intro**: Slides/discussion on A/B basics and clipmyhorse.tv examples (no code yet).
2. **Local Testing**: `cd local-testing && npm install && expo start`. Tweak variants in-app.
3. **PostHog Integration**: Switch to `expo-posthog`, add SDK, test remote bucketing.
4. **Firebase in Bare RN**: `cd bare-app && npm install`, configure Remote Config, run native builds.
5. **Wrap-Up & Challenges**: Metrics review, Q&A.

Fork/clone the repo pre-workshop (instructions will be updated with the exact URL). We'll pair-program via screen shares if needed. The code will be with comments for quick jumps.

## Prerequisites

To maximize your time in this A/B Testing in React Native workshop, set up a development environment capable of running both Expo managed and bare React Native apps. The workshop focuses on experimentation logic, but we'll touch native builds for the bare workflow section. If you're new to local native dev, follow the [Expo Local App Development guide](https://docs.expo.dev/guides/local-app-development/) for details.

The workshop assumes:
- **React/React Native Comfort**: Basics of components, hooks (e.g., `useContext`, `useEffect`), and navigation (we use React Navigation in the demo).
- **A/B Testing Awareness**: No prior experience needed—we'll cover it in the intro. Familiarity with state management or analytics tools (e.g., console logs) is a plus.
- **Git Basics**: Cloning and switching folders/branches.

You'll need to build and run on iOS/Android emulators/simulators, plus at least one physical device for testing variant persistence and events.

### Core Tools (Recent Versions Recommended)
Tested on macOS Sequoia, Windows 11, and Linux (Ubuntu 22+). Update to latest stable where possible.

- **Node.js**: LTS version 22+ (download from [nodejs.org](https://nodejs.org)). Verify: `node -v`.
- **Expo CLI**: Latest (via `npx expo`, currently 7.x+). Install globally if preferred: `npm install -g @expo/cli`.
- **React Native CLI**: Install: `npm install -g @react-native-community/cli`.
- **iOS-Specific**:
  - Xcode: Version 16+ (from App Store). Includes iOS Simulator (iOS 18+).
  - CocoaPods: Version 1.15+ (`sudo gem install cocoapods`).
  - Watchman: Version 2022.10.17+ (`brew install watchman` on macOS).
- **Android-Specific**:
  - Android Studio: Latest stable (Otter | 2025.2.1+ from [developer.android.com](https://developer.android.com/studio)).
  - JDK: Version 17+ (bundled with Android Studio or from Oracle/OpenJDK).
  - Android SDK: Installed via Android Studio (API level 34+ for Android 14+).
  - Android Emulator: Set up an AVD in Android Studio.
- **Other Dev Tools**:
  - Visual Studio Code (latest, with extensions: Expo Tools, React Native Tools).
  - Git (latest; GitHub Desktop optional for easier cloning).

### Accounts & Services
- **Expo Account**: Free—sign up at [expo.dev](https://expo.dev) and run `expo login`.
- **PostHog**: Free tier at [posthog.com](https://posthog.com). Create a project and note your API key/project ID.
- **Firebase**: Free project at [console.firebase.google.com](https://console.firebase.google.com). Enable Remote Config and Analytics; download the `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) configs.

### Hardware
- **Mac Highly Recommended**: For full iOS support (Xcode is macOS-only). If on Windows/Linux, focus on Android—we can adapt iOS via Expo's EAS Build (requires iOS device and Apple Developer account, $99/year).
- **iOS or Android Device**: At least one, preferably both. Enable:
  - iOS: Developer Mode (Settings > Privacy & Security).
  - Android: Developer Options + USB Debugging (Settings > About Phone > Tap Build Number 7x).
- **Bonus**: Bluetooth headphones for any audio-related variant tests (e.g., in-app notifications), though not core to A/B.

## Test Your Setup Before the Workshop
Spend 20-30 mins verifying. If issues arise, check `npx expo doctor` or `npx react-native doctor` for diagnostics. Join our pre-workshop Slack (#setup-help) for quick fixes.

1. **Create a New Expo Project** (Tests Managed Workflow):  
   ```
   npx create-expo-app@latest TestApp
   cd TestApp
   npm install
   ```

2. **Run on iOS Simulator**:  
   ```
   npx expo run:ios
   ```  
   (Launches Simulator if not running. Expect a basic app to load.)

3. **Run on Android Emulator**:  
   First, start an AVD in Android Studio. Then:  
   ```
   npx expo run:android
   ```  
   (App should build and launch.)

4. **Test on Physical Device** (Key for Variant Persistence):  
   Connect via USB (trust prompts on iOS; enable debugging on Android).  
   - iOS: `npx expo run:ios --device`  
   - Android: `npx expo run:android --device`  
   Select your device. App should install and run.

5. **Quick Bare RN Test** (For Later Section):  
   In a new folder:  
   ```
   npx @react-native-community/cli@latest init BareTest --version 0.75
   cd BareTest
   npx react-native run-android  # Or run-ios on Mac
   ```  
   (Builds native project—expect some setup prompts.)

6. **Services Quick-Check**:  
   - Expo: Scan QR from `npx expo start` in Expo Go app.  
   - PostHog: Log a test event via their JS snippet in a playground.  
   - Firebase: Upload a dummy config to Remote Config console.

If all green, you're golden! We'll hit the ground running with local variants. ✈️📊
