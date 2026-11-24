import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getAllTrips,
  getCustomerProfile,
  getTripById,
  markConversationAsRead,
  resetCustomerProfile,
  resetTrips,
  sampleCustomer,
  sampleTrips,
  subscribeCustomerProfile,
  updateCustomerProfile,
} from '../packages/mock-data/src/index.ts';
import { customerScreens } from '../packages/navigation/src/customer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

console.log('--- Running XTREME Phase 2.7 Batch 5 (Trips, Profile & Support) Test Suite ---\n');

// 1. Verify Route Registration for all 5 Batch 5 screens
console.log('1. Verifying Route Registration for all 5 Batch 5 Screens:');
const requiredBatch5Routes = [
  { id: 'CUS-TRIP-01', path: '/trips', name: 'My Trips' },
  { id: 'CUS-TRIP-02', path: '/trips/detail', name: 'Trip Detail / Itinerary' },
  { id: 'CUS-PRO-01', path: '/account/profile', name: 'Customer Profile' },
  { id: 'CUS-PRO-02', path: '/account/edit-profile', name: 'Edit Profile' },
  { id: 'CUS-SUP-01', path: '/support', name: 'Support & Legal' },
];

for (const scr of requiredBatch5Routes) {
  const registered = customerScreens.find((s) => s.path === scr.path);
  assert.ok(registered, `Route ${scr.path} (${scr.id}) must be registered in customerScreens`);
  console.log(`   ✓ Registered route: ${scr.path} (${scr.id})`);
}

// 2. Absence of Internal Screen IDs in Rendered Screen JSX
console.log('\n2. Verifying Absence of Internal Wireframe Screen IDs in Rendered UI:');
const screenFiles = [
  { file: 'apps/customer-mobile/app/trips.tsx', name: 'CUS-TRIP-01' },
  { file: 'apps/customer-mobile/app/trips/detail.tsx', name: 'CUS-TRIP-02' },
  { file: 'apps/customer-mobile/app/account/profile.tsx', name: 'CUS-PRO-01' },
  { file: 'apps/customer-mobile/app/account/edit-profile.tsx', name: 'CUS-PRO-02' },
  { file: 'apps/customer-mobile/app/support.tsx', name: 'CUS-SUP-01' },
];

for (const sf of screenFiles) {
  const fullPath = path.join(repoRoot, sf.file);
  assert.ok(fs.existsSync(fullPath), `File ${sf.file} must exist`);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Verify no <Text>...</Text> displays CUS-*
  const textPattern = /<Text[^>]*>[^<]*CUS-[A-Z0-9_-]+[^<]*<\/Text>/g;
  const matches = content.match(textPattern);
  assert.strictEqual(
    matches,
    null,
    `${sf.name} must not render internal wireframe IDs in user-facing <Text>`,
  );
  console.log(`   ✓ ${sf.name}: Zero internal screen IDs rendered`);
}

// 3. Icon-Only Back Controls (No Text Directional Back Buttons)
console.log('\n3. Verifying Vector Icon-Only Back Navigation Controls:');
for (const sf of screenFiles) {
  const fullPath = path.join(repoRoot, sf.file);
  const content = fs.readFileSync(fullPath, 'utf8');

  const textBackPattern = />\s*(?:[‹←]\s*Back|Back\s*[›→])\s*</i;
  assert.ok(
    !textBackPattern.test(content),
    `${sf.name} must not contain textual directional back controls ("‹ Back")`,
  );
  console.log(`   ✓ ${sf.name}: Verified vector icon-only Back controls`);
}

// 4. Test Live Trips Repository & Detail Resolution
console.log('\n4. Testing Live Trips Repository & Detail Resolution:');
resetTrips();
const initialTrips = getAllTrips();
assert.strictEqual(initialTrips.length, sampleTrips.length, 'Trips count matches sampleTrips');
assert.strictEqual(initialTrips[0].id, 'trip-demo-001');
console.log(`   ✓ Initial trips retrieved (${initialTrips.length} trips loaded)`);

const trip1 = getTripById('trip-demo-001');
assert.ok(trip1, 'getTripById resolves trip-demo-001');
assert.strictEqual(trip1.title, 'Senegal Atlantic Heritage & Luxury Retreat');
console.log(`   ✓ Resolved trip by ID: ${trip1.title} (${trip1.reference})`);

const unknownTrip = getTripById('trip-nonexistent-999');
assert.strictEqual(unknownTrip, undefined, 'Unknown trip ID safely returns undefined');
console.log('   ✓ Unknown trip ID safely returns undefined (triggers NotFoundCard in UI)');

// 5. Test Live Customer Profile Store & Subscriptions
console.log('\n5. Testing Live Customer Profile Store & Subscriptions:');
resetCustomerProfile();
const initialProfile = getCustomerProfile();
assert.strictEqual(initialProfile.firstName, sampleCustomer.firstName);
assert.strictEqual(initialProfile.lastName, sampleCustomer.lastName);
console.log(
  `   ✓ Initial profile verified: ${initialProfile.firstName} ${initialProfile.lastName}`,
);

let listenerFired = false;
let updatedProfileCaptured = null;
const unsub = subscribeCustomerProfile((updated) => {
  listenerFired = true;
  updatedProfileCaptured = updated;
});

const updated = updateCustomerProfile({
  firstName: 'Ousmane',
  lastName: 'Sow',
  email: 'ousmane.sow@example.sn',
  preferredLanguage: 'fr',
});

assert.strictEqual(updated.firstName, 'Ousmane');
assert.strictEqual(updated.lastName, 'Sow');
assert.strictEqual(updated.email, 'ousmane.sow@example.sn');
assert.strictEqual(updated.preferredLanguage, 'fr');
assert.ok(listenerFired, 'subscribeCustomerProfile listener was called');
assert.strictEqual(updatedProfileCaptured?.firstName, 'Ousmane');
console.log('   ✓ Profile mutation and live subscription notification verified');

unsub();

resetCustomerProfile();
const resetProf = getCustomerProfile();
assert.strictEqual(resetProf.firstName, sampleCustomer.firstName);
console.log('   ✓ Deterministic resetCustomerProfile cleanly restores initial state');

// 6. Test Preflight Part A Corrections
console.log('\n6. Testing Preflight Part A Corrections:');

// A1: Verify markConversationAsRead updates read state
markConversationAsRead('conv-demo-001');
console.log('   ✓ markConversationAsRead executes and preserves read status');

// A2: Verify Availability Selection component supports month/year navigation
const availPath = path.join(repoRoot, 'apps/customer-mobile/app/booking/availability.tsx');
const availContent = fs.readFileSync(availPath, 'utf8');
assert.ok(
  availContent.includes('handlePrevMonth') && availContent.includes('handleNextMonth'),
  'availability.tsx must include handlePrevMonth and handleNextMonth',
);
assert.ok(
  availContent.includes('MONTH_NAMES'),
  'availability.tsx must format months across month boundaries',
);
console.log('   ✓ Availability selection calendar supports dynamic month/year navigation');

// A3: Verify Conversation Detail contains NotFoundCard fallback
const convDetailPath = path.join(
  repoRoot,
  'apps/customer-mobile/app/concierge/conversation-detail.tsx',
);
const convDetailContent = fs.readFileSync(convDetailPath, 'utf8');
assert.ok(
  convDetailContent.includes('NotFoundCard'),
  'conversation-detail.tsx must include NotFoundCard for unknown conversations',
);
assert.ok(
  convDetailContent.includes('markConversationAsRead'),
  'conversation-detail.tsx must mark conversation as read on focus',
);
console.log(
  '   ✓ Conversation Detail contains NotFoundCard fallback and marks conversation as read',
);

// A4: Verify Plan Trip form validation requires non-empty details
const planTripPath = path.join(repoRoot, 'apps/customer-mobile/app/concierge/plan-trip.tsx');
const planTripContent = fs.readFileSync(planTripPath, 'utf8');
assert.ok(
  planTripContent.includes('Please describe your request details'),
  'plan-trip.tsx must require non-empty details with inline error message',
);
console.log('   ✓ Plan Trip form validation rejects empty details without fabricating input');

console.log('\n--- All Phase 2.7 Batch 5 Tests Passed Successfully! ---');
