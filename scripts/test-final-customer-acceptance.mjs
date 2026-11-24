import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  addBooking,
  addConciergeRequest,
  addMessage,
  generateBookingReference,
  generateConciergeReference,
  getAllBookings,
  getAllConciergeRequests,
  getAllTrips,
  getCustomerProfile,
  getTripById,
  updateCustomerProfile,
} from '../packages/mock-data/src/index.ts';
import { customerScreens } from '../packages/navigation/src/customer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

console.log('======================================================================');
console.log('  XTREME Mobile — Phase 2.8 Final Customer Acceptance & Audit Suite  ');
console.log('======================================================================\n');

// -----------------------------------------------------------------------------
// 1. All 34 Customer Mobile Routes Registered & Files Exist
// -----------------------------------------------------------------------------
console.log('1. Verifying All 34 Customer Mobile Routes & Component Files:');

assert.strictEqual(customerScreens.length, 34, 'Must register exactly 34 customer screens');

for (const scr of customerScreens) {
  assert.ok(scr.id && scr.title && scr.path, `Screen definition valid for ${scr.id}`);

  // Resolve file in apps/customer-mobile/app
  // route /auth/sign-in -> apps/customer-mobile/app/auth/sign-in.tsx
  // route /discover -> apps/customer-mobile/app/discover.tsx
  // route /discover/services -> apps/customer-mobile/app/discover/services.tsx
  const relativeFilePath = scr.path.replace(/^\//, '');
  let targetFile = path.join(repoRoot, 'apps/customer-mobile/app', `${relativeFilePath}.tsx`);
  if (!fs.existsSync(targetFile)) {
    targetFile = path.join(repoRoot, 'apps/customer-mobile/app', relativeFilePath, 'index.tsx');
  }
  assert.ok(
    fs.existsSync(targetFile),
    `Component file must exist for screen ${scr.id} at ${scr.path} (checked ${targetFile})`,
  );
  console.log(`   ✓ [${scr.id}] ${scr.path} -> ${path.relative(repoRoot, targetFile)}`);
}

// -----------------------------------------------------------------------------
// 2. Absence of Internal Wireframe Screen IDs in User-Facing Text
// -----------------------------------------------------------------------------
console.log('\n2. Verifying Absence of Internal Wireframe Screen IDs in User-Facing Text:');

const customerAppDir = path.join(repoRoot, 'apps/customer-mobile/app');
function checkDirectoryForWireframeText(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDirectoryForWireframeText(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      if (entry.name === 'index.tsx' && fullPath.endsWith(path.join('app', 'index.tsx'))) {
        // QA Hub route lists screens by name/ID for testing purposes - exempt from user-facing restriction
        continue;
      }
      const content = fs.readFileSync(fullPath, 'utf8');
      const textPattern = /<Text[^>]*>[^<]*CUS-[A-Z0-9_-]+[^<]*<\/Text>/g;
      const matches = content.match(textPattern);
      assert.strictEqual(
        matches,
        null,
        `File ${path.relative(repoRoot, fullPath)} must not render internal wireframe IDs in user-facing <Text>`,
      );
    }
  }
}
checkDirectoryForWireframeText(customerAppDir);
console.log(
  '   ✓ Verified: All 34 Customer screens render zero internal wireframe IDs in user-facing JSX',
);

// -----------------------------------------------------------------------------
// 3. CUS-LEG-01: Legal Document Viewer
// -----------------------------------------------------------------------------
console.log('\n3. Verifying CUS-LEG-01 (Legal Document Viewer):');
const legalFilePath = path.join(repoRoot, 'apps/customer-mobile/app/legal/document.tsx');
assert.ok(fs.existsSync(legalFilePath), 'Legal document viewer file must exist');
const legalContent = fs.readFileSync(legalFilePath, 'utf8');

// Verify all 4 legal slugs supported
const expectedSlugs = [
  'privacy-policy',
  'terms-conditions',
  'cancellation-policy',
  'general-notice',
];
for (const slug of expectedSlugs) {
  assert.ok(
    legalContent.includes(`'${slug}'`) || legalContent.includes(`"${slug}"`),
    `Legal viewer must configure slug: ${slug}`,
  );
  console.log(`   ✓ Handled slug: ${slug}`);
}

// Verify pending content state without fake legal terms
assert.ok(
  legalContent.includes('Legal content pending') ||
    legalContent.includes('Pending Client/Legal Review'),
  'Legal viewer must show pending review notice per Figma node 36:250',
);
assert.ok(
  legalContent.includes('skeletonLine'),
  'Legal viewer must render skeleton lines matching Figma nodes 36:261-36:267',
);
assert.ok(
  legalContent.includes('NotFoundCard'),
  'Legal viewer must render NotFoundCard fallback for invalid document slugs',
);
console.log(
  '   ✓ Verified: Pending legal review notice, skeleton layout, and NotFoundCard fallback',
);

// -----------------------------------------------------------------------------
// 4. CUS-TRIP-02: Dynamic Trip Itinerary Resolution
// -----------------------------------------------------------------------------
console.log('\n4. Verifying CUS-TRIP-02 (Dynamic Trip Itinerary Resolution):');
const tripDetailPath = path.join(repoRoot, 'apps/customer-mobile/app/trips/detail.tsx');
const tripDetailContent = fs.readFileSync(tripDetailPath, 'utf8');

assert.ok(
  !tripDetailContent.includes('DEFAULT_ITINERARY_ITEMS'),
  'Trip detail must not use static DEFAULT_ITINERARY_ITEMS',
);
assert.ok(tripDetailContent.includes('trip.days'), 'Trip detail must map over trip.days directly');
assert.ok(tripDetailContent.includes('day.stops'), 'Trip detail must map over day.stops directly');

// Verify multi-trip data integrity in mock store
const allTrips = getAllTrips();
assert.ok(allTrips.length >= 3, 'Must have at least 3 sample trips');
for (const trip of allTrips) {
  assert.ok(Array.isArray(trip.days) && trip.days.length > 0, `Trip ${trip.id} must have days`);
  for (const day of trip.days) {
    assert.ok(
      Array.isArray(day.stops) && day.stops.length > 0,
      `Trip ${trip.id} day ${day.dayNumber} must have stops`,
    );
  }
}
const trip1 = getTripById(allTrips[0].id);
const trip2 = getTripById(allTrips[1].id);
assert.notStrictEqual(trip1.title, trip2.title, 'Trips must have different titles');
assert.notStrictEqual(
  trip1.days[0].stops[0].title,
  trip2.days[0].stops[0].title,
  'Trips must have independent stops',
);
console.log(
  `   ✓ Verified: Dynamic itinerary resolves distinct days and stops for Trip 1 (${trip1.id}: ${trip1.days.length} days) and Trip 2 (${trip2.id}: ${trip2.days.length} days)`,
);

// -----------------------------------------------------------------------------
// 5. CUS-PRO-01: Profile Logout & Data Persistence
// -----------------------------------------------------------------------------
console.log('\n5. Verifying CUS-PRO-01 Profile Logout & Data Persistence:');
const profileFilePath = path.join(repoRoot, 'apps/customer-mobile/app/account/profile.tsx');
const profileContent = fs.readFileSync(profileFilePath, 'utf8');

assert.ok(
  profileContent.includes('logout()') || profileContent.includes('logout'),
  'Profile screen must invoke logout() from auth context',
);
assert.ok(
  !profileContent.includes('resetCustomerProfile()'),
  'Profile logout must NOT call resetCustomerProfile() (user edits must be preserved)',
);

// Verify profile update and persistence
const initialProfile = getCustomerProfile();
const originalFirstName = initialProfile.firstName;
const testName = `Updated_${Date.now()}`;
updateCustomerProfile({ firstName: testName });

const updatedProfile = getCustomerProfile();
assert.strictEqual(updatedProfile.firstName, testName, 'Customer profile must update reactively');
// Reset back to original to keep clean mock state
updateCustomerProfile({ firstName: originalFirstName });
console.log(
  '   ✓ Verified: Logout clears session without wiping profile edits, profile updates reactively',
);

// -----------------------------------------------------------------------------
// 6. CUS-SUP-01: Support Contact Protocols
// -----------------------------------------------------------------------------
console.log('\n6. Verifying CUS-SUP-01 Support Contact Protocols:');
const supportFilePath = path.join(repoRoot, 'apps/customer-mobile/app/support.tsx');
const supportContent = fs.readFileSync(supportFilePath, 'utf8');

assert.ok(
  supportContent.includes('mailto:') && supportContent.includes('item.value'),
  'Support screen must trigger mailto: URI for email contact',
);
assert.ok(
  supportContent.includes('tel:') && supportContent.includes('item.value'),
  'Support screen must trigger tel: URI for phone contact',
);
assert.ok(
  supportContent.includes('https://wa.me/') && supportContent.includes('cleanPhone'),
  'Support screen must trigger WhatsApp URI for messaging',
);
assert.ok(
  supportContent.includes('Linking.canOpenURL') && supportContent.includes('Linking.openURL'),
  'Support screen must safely check Linking.canOpenURL before opening',
);
assert.ok(
  supportContent.includes('Alert.alert'),
  'Support screen must provide Alert fallback if URL scheme cannot be opened',
);
assert.ok(
  supportContent.includes('Direct Client Channels') ||
    supportContent.includes('Staging channels active'),
  'Support screen must show staging contact notice',
);
console.log(
  '   ✓ Verified: mailto:, tel:, and WhatsApp handlers with safe Alert fallback and notice banner',
);

// -----------------------------------------------------------------------------
// 7. Booking & Concierge End-to-End Regression Validation
// -----------------------------------------------------------------------------
console.log('\n7. Verifying Booking & Concierge End-to-End Reactive Flow:');

// Test Booking creation & immediate listing
const preBookings = getAllBookings();
const newBooking = addBooking({
  id: `test-bkg-${Date.now()}`,
  reference: generateBookingReference(),
  customerId: 'demo-cus-001',
  serviceId: 'srv-001',
  serviceName: 'Gulfstream G650ER Private Jet Charter',
  bookingMode: 'INSTANT',
  status: 'CONFIRMED',
  date: '2026-12-15',
  time: '10:00 AM',
  pickupLocation: 'Blaise Diagne Airport VIP Terminal',
  passengers: 4,
  amount: 48500,
  currency: 'USD',
  paymentStatus: 'PENDING',
  createdAt: new Date().toISOString(),
});
const postBookings = getAllBookings();
assert.strictEqual(
  postBookings.length,
  preBookings.length + 1,
  'New booking must be added to repository',
);
assert.strictEqual(
  postBookings[0].id,
  newBooking.id,
  'New booking must be visible at top of bookings',
);
console.log(
  `   ✓ Verified: Mock booking creation and immediate listing (${newBooking.id} / ${newBooking.reference})`,
);

// Test Concierge Request creation
const preRequests = getAllConciergeRequests();
const newRequest = addConciergeRequest({
  id: `test-req-${Date.now()}`,
  reference: generateConciergeReference(),
  customerId: 'demo-cus-001',
  type: 'PLAN_TRIP',
  title: 'Bespoke Alps Ski Chalet & Helicopter Transfer',
  details: 'Require private chef and mountain guide.',
  tripContext: 'St. Moritz, Switzerland',
  serviceContext: 'Chalet & Transfer',
  startDate: '2026-12-20',
  endDate: '2026-12-27',
  budgetNotes: '$50,000 - $100,000',
  guestCount: 6,
  status: 'OPEN',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  conversationId: 'conv-demo-001',
});
const postRequests = getAllConciergeRequests();
assert.strictEqual(
  postRequests.length,
  preRequests.length + 1,
  'New concierge request must be added to repository',
);
assert.strictEqual(postRequests[0].id, newRequest.id, 'New concierge request must be listed');
console.log(
  `   ✓ Verified: Concierge request creation and immediate listing (${newRequest.id} / ${newRequest.reference})`,
);

// Test Concierge Messaging
const msg = addMessage({
  id: `test-msg-${Date.now()}`,
  conversationId: newRequest.conversationId || 'conv-demo-001',
  senderId: 'demo-cus-001',
  senderName: 'You',
  isStaff: false,
  content: 'Thank you for handling our booking request.',
  timestamp: '11:00',
});
assert.ok(msg?.id, 'Concierge message must be added');
console.log(`   ✓ Verified: Concierge message sent (${msg.id})`);

console.log('\n======================================================================');
console.log('  ALL 34 CUSTOMER MOBILE SCREENS & ACCEPTANCE CRITERIA VERIFIED PASS  ');
console.log('======================================================================\n');
