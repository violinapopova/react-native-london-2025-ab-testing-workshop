# PostHog Feature Flags Setup Guide

## 1. Access PostHog Dashboard
- Go to https://app.posthog.com
- Log in to your account
- Navigate to "Feature Flags" in the left sidebar

## 2. Create Feature Flags

### A. CTA Variant Experiment
**Flag Key:** `wanderlust-cta-variant`
- **Type:** Multi-variant
- **Variants:**
  - `book` (50% rollout) 
    - **Payload:** `{"text": "Book Now", "color": "#FF5757"}`
  - `reserve` (50% rollout) 
    - **Payload:** `{"text": "Reserve Spot", "color": "#4CAF50"}`
- **Description:** Tests different CTA button text and colors

### B. Onboarding Flow Experiment  
**Flag Key:** `wanderlust-onboarding-flow`
- **Type:** Multi-variant
- **Variants:**
  - `1-step` (50% rollout)
    - **Payload:** `{"steps": 1}`
  - `3-steps` (50% rollout)
    - **Payload:** `{"steps": 3}`
- **Description:** Tests different onboarding flow lengths

### C. Premium Badge Experiment
**Flag Key:** `wanderlust-premium-badge`
- **Type:** Multi-variant
- **Variants:**
  - `pro` (50% rollout)
    - **Payload:** `{"badge": "pro"}`
  - `elite` (50% rollout)
    - **Payload:** `{"badge": "elite"}`
- **Description:** Tests different premium badge labels

### D. Search Placeholder Experiment
**Flag Key:** `wanderlust-search-placeholder`
- **Type:** Multi-variant
- **Variants:**
  - `formal` (50% rollout)
    - **Payload:** `{"placeholder": "Search destinations..."}`
  - `casual` (50% rollout)
    - **Payload:** `{"placeholder": "Where to next?"}`
- **Description:** Tests different search input placeholders

### E. Locale-based Feature Flags

**Flag Key:** `wanderlust-local-deals-en`
- **Type:** Boolean
- **Enabled:** false (or based on your preference)
- **Description:** Shows local deals section for English users

**Flag Key:** `wanderlust-local-deals-es`
- **Type:** Boolean
- **Enabled:** true
- **Description:** Shows local deals section for Spanish users

**Flag Key:** `wanderlust-local-deals-fr`
- **Type:** Boolean
- **Enabled:** false (or based on your preference)
- **Description:** Shows local deals section for French users

**Flag Key:** `wanderlust-summer-promo-fr`
- **Type:** Boolean
- **Enabled:** true
- **Description:** Shows summer promo banner for French users

### F. Additional Demo Flags (for PostHogExample component)

**Flag Key:** `summer-promo-banner`
- **Type:** Multi-variant
- **Variants:**
  - `enabled` (50% rollout)
    - **Payload:** `{"show": true}`
  - `disabled` (50% rollout)
    - **Payload:** `{"show": false}`
- **Description:** Controls summer promo banner visibility

**Flag Key:** `show-new-feature`
- **Type:** Boolean
- **Enabled:** true (or 50% rollout)
- **No payload needed for boolean flags**
- **Description:** Shows/hides new feature section

**Flag Key:** `background-color-test`
- **Type:** Multi-variant
- **Variants:**
  - `control` (33% rollout)
    - **Payload:** `{"color": "#FF5757", "name": "control"}`
  - `test` (33% rollout)
    - **Payload:** `{"color": "#4CAF50", "name": "test"}`
  - `default` (34% rollout)
    - **Payload:** `{"color": "#2196F3", "name": "default"}`
- **Description:** A/B tests different background colors

**Flag Key:** `button-text-variant`
- **Type:** Multi-variant
- **Variants:**
  - `urgent` (33% rollout)
    - **Payload:** `{"text": "Book Now!", "style": "urgent"}`
  - `casual` (33% rollout)
    - **Payload:** `{"text": "Reserve Spot", "style": "casual"}`
  - `default` (34% rollout)
    - **Payload:** `{"text": "Book Now", "style": "default"}`
- **Description:** Tests different button text variations

## 3. Configure Rollout Settings
- Set rollout percentages based on your testing needs
- You can start with 50/50 splits for A/B tests
- Use targeting conditions if needed (e.g., by user properties)

## 4. How to Set Payloads in PostHog Dashboard

When creating a multi-variant feature flag:

1. **Add Variant**: Click "Add variant"
2. **Variant Key**: Enter the variant name (e.g., `book`, `reserve`)
3. **Rollout %**: Set the percentage (e.g., 50%)
4. **Payload**: Click "Add payload" and enter JSON:
   ```json
   {
     "text": "Book Now",
     "color": "#FF5757"
   }
   ```

### Example Payload Setup:

For `wanderlust-cta-variant`:
- **Variant: book**
  - Rollout: 50%
  - Payload: `{"text": "Book Now", "color": "#FF5757"}`
  
- **Variant: reserve** 
  - Rollout: 50%
  - Payload: `{"text": "Reserve Spot", "color": "#4CAF50"}`

**Important:** Make sure to use valid JSON format in payloads!

## 5. Enable Flags
- Make sure all flags are **enabled** and **active**
- Set appropriate rollout percentages
- Save each flag configuration

## 6. Test the Integration
After creating the flags:
1. Restart your React Native app
2. Check the console logs for PostHog feature flag values
3. Use the debug menu to refresh config and see changes
4. Navigate to the "PostHog A/B Test Demo" screen to see direct implementation

## 7. Monitor Results
- Go to "Insights" in PostHog to create funnels and track conversions
- Set up goal events like `button_clicked`, `booking_completed`, etc.
- Analyze which variants perform better

## Note for Workshop
You can create some flags before the workshop and show participants:
1. How to create flags in the dashboard
2. How flags appear in the app immediately
3. How to change rollout percentages and see real-time updates
4. How analytics track different variants

The code is now ready to receive real feature flags from PostHog instead of using random values!