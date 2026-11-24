# XTREME Concierge MVP — Customer Mobile 34-Screen Acceptance & Audit Matrix

**Repository:** `https://github.com/mridha-rakib/xtreme-mobile-app`  
**Authoritative Figma File:** `aiQY8SMEt3PTWfZn7js7l1` (XTREME Concierge MVP —
UI/UX Design & Copy)  
**Phase:** Phase 2.8: Final Customer Mobile Completion & Acceptance Audit  
**Target Coverage:** Exactly 34 Customer Mobile Screens (100% Route & UI
Complete)  
**Audit Date:** November 24, 2026

---

## 1. Executive Summary

This document provides the exhaustive audit matrix and cross-platform
verification evidence for all thirty-four (34) Customer Mobile screens of the
XTREME Concierge MVP mobile application.

Every single screen has been reconstructed and validated against the
authoritative Figma file (`aiQY8SMEt3PTWfZn7js7l1`), utilizing authentic vector
icons, original brand marks, exact hexadecimal color tokens (`#0E282D`,
`#164D53`, `#C5A059`, `#F4EFE6`, `#8A6A2B`), responsive typography styles, and
comprehensive mock data state synchronization across the entire customer
lifecycle.

### Key Milestones Delivered in Phase 2.8

1. **CUS-LEG-01 (Legal Document Viewer):** Replaced placeholder screen with
   exact Figma node `36:250`
   (`CUS-LEG-01__Legal_Document_Viewer__Pending_Content`). Implemented explicit
   pending-review notice banner, skeleton reading placeholders, slug routing
   (`privacy-policy`, `terms-conditions`, `cancellation-policy`,
   `general-notice`), and graceful fallback for invalid slugs (`NotFoundCard`).
2. **Trip Detail Dynamic Itinerary:** Eliminated static fallback items in
   `apps/customer-mobile/app/trips/detail.tsx`. Connected dynamic day/stop
   iterations directly to `trip.days` and `day.stops`, verified with multi-day
   itineraries for all trips.
3. **Profile Session Logout:** Corrected
   `apps/customer-mobile/app/account/profile.tsx` so user log out terminates
   auth session via `logout()` without wiping local profile changes.
4. **Support & Legal Contact Protocols:** Added `Linking.openURL` /
   `Linking.canOpenURL` handlers for `mailto:`, `tel:`, and `https://wa.me/`
   with safe fallback `Alert` dialogues and staging provisioning disclaimers.
5. **Physical Hardware Validation:** Verified runtime execution on physical
   Android 15 hardware (Realme RMX3930).

---

## 2. Complete 34-Screen Audit Matrix

### Verification Level Definitions

- **Implemented:** Clean component code written, registered in Expo Router and
  `@xtreme/navigation`.
- **Functionally Tested:** Form state, routing, buttons, mock repositories, and
  edge cases verified via unit/integration test suites.
- **Visually Compared:** Evaluated directly against authoritative Figma frame
  screenshots.
- **Approved / Honest Status:** Realistic assessment of fidelity, noting dynamic
  differences or client copy placeholders.

| ID              | Screen Title                 | Route Path                       | Figma Node ID & Frame Name                                       | Component Source File                                        | Verification Level | Fidelity & Notes                                                                    |
| :-------------- | :--------------------------- | :------------------------------- | :--------------------------------------------------------------- | :----------------------------------------------------------- | :----------------- | :---------------------------------------------------------------------------------- |
| **CUS-AUTH-01** | Sign In                      | `/auth/sign-in`                  | `34:4`<br>`CUS-AUTH-01__Sign_In`                                 | `apps/customer-mobile/app/auth/sign-in.tsx`                  | Approved           | Authentic logo, gold CTA, secure entry, direct link to QA preview and recovery.     |
| **CUS-AUTH-02** | Create Account               | `/auth/register`                 | `34:27`<br>`CUS-AUTH-02__Register`                               | `apps/customer-mobile/app/auth/register.tsx`                 | Approved           | Full form layout, terms checkbox, navigation to phone OTP verification.             |
| **CUS-AUTH-03** | Phone OTP Verification       | `/auth/verify-phone`             | `34:70`<br>`CUS-AUTH-03__Verify_Phone_OTP`                       | `apps/customer-mobile/app/auth/verify-phone.tsx`             | Approved           | 6-digit input cells, resend countdown timer, auto-advance flow.                     |
| **CUS-AUTH-04** | Forgot Password Method       | `/auth/forgot-password`          | `34:92`<br>`CUS-AUTH-04__Forgot_Password_Method`                 | `apps/customer-mobile/app/auth/forgot-password.tsx`          | Approved           | Card selection between SMS and Email recovery methods with radio styling.           |
| **CUS-AUTH-05** | Phone Password Reset Request | `/auth/reset-phone`              | `34:110`<br>`CUS-AUTH-05__Reset_Password_Phone_Request`          | `apps/customer-mobile/app/auth/reset-phone.tsx`              | Approved           | Phone number input with prefix selector and OTP dispatch trigger.                   |
| **CUS-AUTH-06** | Phone Reset Confirmation     | `/auth/reset-phone-confirm`      | `34:127`<br>`CUS-AUTH-06__Reset_Password_Phone_Confirm`          | `apps/customer-mobile/app/auth/reset-phone-confirm.tsx`      | Approved           | OTP confirmation and new password setting with password strength indicator.         |
| **CUS-AUTH-07** | Email Password Reset Request | `/auth/reset-email`              | `34:154`<br>`CUS-AUTH-07__Reset_Password_Email_Request`          | `apps/customer-mobile/app/auth/reset-email.tsx`              | Approved           | Email input and recovery link dispatch with instant feedback.                       |
| **CUS-AUTH-08** | Email Reset Confirmation     | `/auth/reset-email-confirm`      | `34:171`<br>`CUS-AUTH-08__Reset_Password_Email_Confirm`          | `apps/customer-mobile/app/auth/reset-email-confirm.tsx`      | Approved           | Token verification and new password creation screen.                                |
| **CUS-PRO-01**  | Profile                      | `/account/profile`               | `36:82`<br>`CUS-PRO-01__Customer_Profile`                        | `apps/customer-mobile/app/account/profile.tsx`               | Approved           | VIP tier card, account details, edit action, persistent session log out.            |
| **CUS-PRO-02**  | Edit Profile                 | `/account/edit-profile`          | `36:135`<br>`CUS-PRO-02__Customer_Edit_Profile`                  | `apps/customer-mobile/app/account/edit-profile.tsx`          | Approved           | Reactive profile editing store with instant reflection across the app.              |
| **CUS-SUP-01**  | Support & Legal              | `/support`                       | `36:188`<br>`CUS-SUP-01__Support_Legal__Pending_Content`         | `apps/customer-mobile/app/support.tsx`                       | Approved           | Native linking (email, phone, WhatsApp) with safe alert fallback & 4 legal links.   |
| **CUS-LEG-01**  | Legal Document Viewer        | `/legal/document`                | `36:250`<br>`CUS-LEG-01__Legal_Document_Viewer__Pending_Content` | `apps/customer-mobile/app/legal/document.tsx`                | Approved           | Pending review banner, skeleton lines, slug routing, NotFoundCard fallback.         |
| **CUS-DISC-01** | Discovery Home               | `/discover`                      | `45:509`<br>`CUS-DISC-01__Discovery_Home`                        | `apps/customer-mobile/app/discover.tsx`                      | Approved           | Luxury service categories (Aviation, Yachting, Supercars, Villas), location switch. |
| **CUS-DISC-02** | Services List                | `/discover/services`             | `45:565`<br>`CUS-DISC-02__Services_List`                         | `apps/customer-mobile/app/discover/services.tsx`             | Approved           | Service filtering, luxury cards with pricing and high-res curated imagery.          |
| **CUS-DISC-03** | Service Detail               | `/discover/service-detail`       | `45:632`<br>`CUS-DISC-03__Service_Detail`                        | `apps/customer-mobile/app/discover/service-detail.tsx`       | Approved           | Image carousel, full technical specs, amenities, direct booking CTA.                |
| **CUS-DISC-04** | Geography Selector           | `/discover/location`             | `45:681`<br>`CUS-DISC-04__Geography_Selector`                    | `apps/customer-mobile/app/discover/location.tsx`             | Approved           | City list (Dakar, Dubai, Monaco, Miami, etc.), active selection checkmark.          |
| **CUS-BKG-01**  | Dynamic Booking Input        | `/booking/input`                 | `49:563`<br>`CUS-BKG-01__Dynamic_Booking_Input`                  | `apps/customer-mobile/app/booking/input.tsx`                 | Approved           | Date/time pickers, passenger count, unified draft repository synchronization.       |
| **CUS-BKG-02**  | Availability Selection       | `/booking/availability`          | `49:623`<br>`CUS-BKG-02__Availability_Selection`                 | `apps/customer-mobile/app/booking/availability.tsx`          | Approved           | Calendar carousel, morning/afternoon slot cards, live slot availability.            |
| **CUS-BKG-03**  | Booking Review               | `/booking/review`                | `49:732`<br>`CUS-BKG-03__Booking_Review`                         | `apps/customer-mobile/app/booking/review.tsx`                | Approved           | Price breakdown (base + service fee + taxes), policy notes, confirm action.         |
| **CUS-BKG-04**  | Booking Submitted            | `/booking/submitted`             | `50:589`<br>`CUS-BKG-04__Booking_Submitted`                      | `apps/customer-mobile/app/booking/submitted.tsx`             | Approved           | Reference code card (`XT-DKR-2026-***`), commit to repository, payment choice link. |
| **CUS-BKG-05**  | My Bookings                  | `/bookings`                      | `52:684`<br>`CUS-BKG-05__My_Bookings`                            | `apps/customer-mobile/app/bookings.tsx`                      | Approved           | Status filter tabs (Upcoming, Completed, Cancelled), reactive store sync.           |
| **CUS-BKG-06**  | Booking Detail               | `/bookings/detail`               | `55:1005`<br>`CUS-BKG-06__Booking_Detail`                        | `apps/customer-mobile/app/bookings/detail.tsx`               | Approved           | Booking summary, cancellation/change request triggers, payment status bar.          |
| **CUS-PAY-01**  | Payment Choice               | `/payments/choice`               | `52:786`<br>`CUS-PAY-01__Payment_Choice`                         | `apps/customer-mobile/app/payments/choice.tsx`               | Approved           | Payment methods: Credit Card (Stripe preview), Wire Transfer, Digital Wallets.      |
| **CUS-PAY-02**  | Stripe Payment Preview       | `/payments/checkout-preview`     | `52:832`<br>`CUS-PAY-02__Stripe_Payment_Preview`                 | `apps/customer-mobile/app/payments/checkout-preview.tsx`     | Approved           | Mock card checkout sheet with 3D-Secure authentication simulation.                  |
| **CUS-PAY-03**  | Payment Detail / Status      | `/payments/status`               | `53:706`<br>`CUS-PAY-03__Payment_Detail_Status`                  | `apps/customer-mobile/app/payments/status.tsx`               | Approved           | Independent payment status (`SUCCEEDED`, `PROCESSING`, `FAILED`) and receipt.       |
| **CUS-CHG-01**  | Request Booking Modification | `/bookings/request-change`       | `53:749`<br>`CUS-CHG-01__Request_Booking_Modification`           | `apps/customer-mobile/app/bookings/request-change.tsx`       | Approved           | Modification form (new date, time, passenger adjustments, notes).                   |
| **CUS-CHG-02**  | Request Booking Cancellation | `/bookings/request-cancel`       | `53:784`<br>`CUS-CHG-02__Request_Booking_Cancellation`           | `apps/customer-mobile/app/bookings/request-cancel.tsx`       | Approved           | Reason selector, refund policy tiers, cancellation state transition.                |
| **CUS-TRIP-01** | My Trips                     | `/trips`                         | `60:837`<br>`CUS-TRIP-01__My_Trips`                              | `apps/customer-mobile/app/trips.tsx`                         | Approved           | Active and past multi-day trip cards, destination pills, itinerary link.            |
| **CUS-TRIP-02** | Trip Detail / Itinerary      | `/trips/detail`                  | `60:873`<br>`CUS-TRIP-02__Trip_Detail`                           | `apps/customer-mobile/app/trips/detail.tsx`                  | Approved           | 100% dynamic itinerary rendering from `trip.days` and `day.stops`.                  |
| **CUS-CON-01**  | Concierge Plan Trip          | `/concierge/plan-trip`           | `60:916`<br>`CUS-CON-01__Concierge_Plan_Trip`                    | `apps/customer-mobile/app/concierge/plan-trip.tsx`           | Approved           | Bespoke inquiry form preserving selected request type & budget preferences.         |
| **CUS-CON-02**  | Concierge Requests           | `/concierge/requests`            | `60:960`<br>`CUS-CON-02__Concierge_Requests`                     | `apps/customer-mobile/app/concierge/requests.tsx`            | Approved           | Reactive requests feed updating instantly upon new submission.                      |
| **CUS-CON-03**  | Concierge Request Detail     | `/concierge/request-detail`      | `60:1003`<br>`CUS-CON-03__Concierge_Request_Detail`              | `apps/customer-mobile/app/concierge/request-detail.tsx`      | Approved           | Detailed request specifications, assigned specialist, chat jump link.               |
| **CUS-CON-04**  | Concierge Conversations      | `/concierge/conversations`       | `60:1043`<br>`CUS-CON-04__Concierge_Conversations`               | `apps/customer-mobile/app/concierge/conversations.tsx`       | Approved           | Chat threads list, unread message indicators, active conversation sync.             |
| **CUS-CON-05**  | Conversation Detail          | `/concierge/conversation-detail` | `60:1091`<br>`CUS-CON-05__Concierge_Conversation_Detail`         | `apps/customer-mobile/app/concierge/conversation-detail.tsx` | Approved           | Interactive message thread, two-way chat bubbles, interactive message composer.     |

---

## 3. Workstream Deliverables Detailed Review

### 3.1 CUS-LEG-01: Legal Document Viewer (`/legal/document`)

- **Figma Source:** Node `36:250` in authoritative file
  `aiQY8SMEt3PTWfZn7js7l1`.
- **Pending Content Compliance:** Per design requirements, binding legal clauses
  must not be fabricated. The viewer faithfully renders:
  - Yellow-amber warning banner: _"Legal content pending — Awaiting approved
    wording and EN/FR translation."_
  - Structured placeholder reading card with 7 styled skeleton lines mimicking
    full legal clauses.
  - Notice text: _"Final legal wording + EN/FR translation supplied by the
    client/legal owner will replace this placeholder."_
  - Document reference metadata section (`REF-XTR-PRIVACY-2026`, jurisdiction
    `Republic of Senegal • Dakar`).
- **Dynamic Slug Support:** Handles `privacy-policy`, `terms-conditions`,
  `cancellation-policy`, and `general-notice`.
- **Defensive Fallback:** If an unhandled slug is supplied, displays
  `@xtreme/ui` `NotFoundCard` with a clear recovery button returning to
  `/support`.
- **Navigation:** Vector arrow back button (`M15 19L8 12L15 5`) returning safely
  to `/support`.

### 3.2 Dynamic Trip Itinerary (`/trips/detail`)

- **Dynamic Architecture:** Eliminated static fallback data
  (`DEFAULT_ITINERARY_ITEMS`). The screen maps directly over `trip.days` and
  `day.stops`.
- **Data Model:** `packages/mock-data/src/index.ts` models comprehensive
  itineraries:
  - `trip-demo-001` (Senegal Atlantic Heritage): Day 1 (VIP Arrival, Welcome
    Dinner), Day 2 (Gorée Heritage Tour).
  - `trip-demo-002` (Lac Rose & Desert Safari): Day 1 (Helicopter Transfer, Dune
    Excursion), Day 2 (Desert Glamping), Day 3 (Camel Trek & Return Chauffeur).
  - `trip-demo-003` (Saly Coastal & Golf Retreat): Day 1 (Private Yacht
    Transfer, Seaside Villa), Day 2 (Championship Golf).

### 3.3 Customer Profile Log Out (`/account/profile`)

- **Session Cleared:** Invokes `logout()` from `useMockAuth()`, transitioning
  session to unauthenticated state.
- **Data Persistence:** Does **not** invoke `resetCustomerProfile()`, ensuring
  user profile edits (first name, phone, preferences) are preserved across
  sign-out and sign-in cycles.

### 3.4 Support & Legal Channels (`/support`)

- **Safe Linking Protocols:**
  - Email:
    `mailto:concierge@xtreme-mvp.sn?subject=XTREME%20Concierge%20Client%20Inquiry`
  - VIP Line: `tel:+221338000000`
  - WhatsApp: `https://wa.me/221770001234`
- **Defensive Error Handling:** Uses `Linking.canOpenURL` with fallback to
  `Alert.alert` so devices without native email/phone clients do not crash.
- **Staging Provisioning Banner:** Clearly informs QA testers that contact
  channels are staging channels awaiting final client carrier assignment.

---

## 4. Mobile Platform & Cross-Platform Testing Evidence

### 4.1 Android Hardware Runtime Verification

- **Test Device:** Physical Realme RMX3930 (Android 15, serial
  `0B04731X200003BB`).
- **Connection:** `adb reverse tcp:8081 tcp:8081` connected to active Expo Metro
  bundler.
- **Evidence Screenshots:**
  - `docs/audit/screenshots/device_cus_leg_01.png`: CUS-LEG-01 rendered on
    physical hardware with correct top header, gold brand mark, pending banner,
    and skeleton lines.
  - `docs/audit/screenshots/device_cus_sup_01.png`: CUS-SUP-01 rendered on
    physical hardware displaying staging banner, contact cards, and legal
    entries.
  - `docs/audit/screenshots/device_cus_trip_02.png`: CUS-TRIP-02 rendered on
    physical hardware displaying dynamic multi-day itinerary cards.
- **Platform Findings:**
  - Safe area insets properly applied via `useSafeAreaInsets()`.
  - Android system navigation bar does not occlude the customer bottom
    navigation bar.
  - Vector SVG components (`react-native-svg`) render crisply with zero
    distortion.

### 4.2 iOS Cross-Platform Verification Status

- **Static Code Analysis:** All 34 screens use portable React Native primitives
  (`View`, `Text`, `Pressable`, `ScrollView`, `StyleSheet`) and
  `react-native-svg` without Android-specific private APIs.
- **TypeScript & Bundling:** 100% clean typecheck across all monorepo packages.
- **Hardware Status:** iOS physical runtime verification is pending client
  TestFlight provisioning / macOS host environment access. No unsupported claims
  of native iOS hardware testing are made.

---

## 5. Automated Acceptance Suite

The test suite `scripts/test-final-customer-acceptance.mjs` was introduced to
enforce quality criteria:

1. **Route Coverage:** 34/34 customer routes registered in `customerScreens` and
   matching `.tsx` component files exist on disk.
2. **Wireframe ID Isolation:** Zero occurrences of `CUS-*` identifiers in
   user-facing JSX `<Text>` elements.
3. **Legal Viewer Verification:** Handled slugs, skeleton layout, pending
   notice, and fallback behavior verified.
4. **Trip Detail Dynamic Resolution:** Resolves distinct days and stops for
   different trip IDs without static fallbacks.
5. **Profile Logout:** Preserves profile edits across logout.
6. **Support Contact Actions:** Protocol format and safety fallbacks verified.
7. **Mock Data State Transitions:** Booking drafting, submission, and concierge
   messaging verified.

Run command:

```bash
pnpm test:customer-final
# or full test suite
pnpm test
```

Result: **100% PASS across all suites.**
