# PostHog Integration Guide

This file contains instructions for switching between the AsyncStorage and PostHog implementations of A/B testing.

## Current Setup

- **`ExperimentContext.tsx`** - AsyncStorage implementation (local-testing branch)
- **`ExperimentContextPostHog.tsx`** - PostHog implementation (expo-posthog branch)

## To Use PostHog Implementation

### 1. Replace ExperimentContext Import in App.tsx

**Current (AsyncStorage):**
```tsx
import { ExperimentProvider } from './src/context/ExperimentContext';
```

**Change to (PostHog):**
```tsx
import { ExperimentProvider } from './src/context/ExperimentContextPostHog';
```

### 2. Set Up PostHog API Key

Edit `ExperimentContextPostHog.tsx` line 11:
```tsx
const POSTHOG_API_KEY = 'phc_YOUR_ACTUAL_API_KEY_HERE'; // Replace with your PostHog API key
```

### 3. Configure PostHog Project

In your PostHog dashboard, create these feature flags:

| Flag Key | Variants | Purpose |
|----------|----------|---------|
| `wanderlust-cta-variant` | `control`, `variant-b` | CTA text/color |
| `wanderlust-onboarding-flow` | `single-step`, `multi-step` | Onboarding steps |
| `wanderlust-premium-badge` | `pro`, `elite` | Badge text |
| `wanderlust-search-placeholder` | `formal`, `casual` | Search placeholder |
| `wanderlust-local-deals` | `disabled`, `enabled` | LocalDeals feature |
| `wanderlust-summer-promo` | `disabled`, `enabled` | Summer promo banner |

## Key Differences

### AsyncStorage Implementation
- **Local storage only** - No network dependency
- **Manual variant switching** - Full control for demos
- **Console logging** - See all events in dev console
- **Perfect for workshops** - No setup required

### PostHog Implementation
- **Real analytics platform** - Production-ready
- **Automatic user bucketing** - True A/B testing
- **Dashboard insights** - Real data visualization
- **Feature flag management** - Remote config updates

## Workshop Demo Comparison

### AsyncStorage (Current)
```tsx
// Manual control - great for education
await switchVariant('B'); // Immediate switch
console.log(experiments); // See exact data
```

### PostHog
```tsx
// Real-world scenario
const ctaVariant = postHog.getFeatureFlag('wanderlust-cta-variant');
postHog.capture('button_clicked', { variant: ctaVariant });
// Data flows to PostHog dashboard
```

## Demo Script Ideas

1. **Show AsyncStorage first** - "This is how A/B testing works internally"
2. **Switch to PostHog** - "This is how it works in production"
3. **Compare dashboard** - Show PostHog analytics vs console logs
4. **Explain trade-offs** - Control vs automation

## Testing PostHog Integration

1. Install PostHog
2. Get free API key from posthog.com
3. Replace API key in config
4. Update App.tsx import
5. Test feature flags in PostHog dashboard

## Troubleshooting

- **API key errors**: Check PostHog project settings
- **Feature flags not working**: Verify flag names match exactly
- **No events**: Check network connection and API key
- **Type errors**: Ensure PostHog types are properly imported

## Best Practices for Workshop

- **Start with AsyncStorage** - Easier to understand concepts
- **Show PostHog dashboard** - Even if using AsyncStorage implementation
- **Explain the transition** - How to move from prototype to production
- **Demo both approaches** - Show the full spectrum