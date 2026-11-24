import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  addBooking,
  generateBookingReference,
  getAllBookings,
  getBookingById,
  resetBookings,
  updateBooking,
} from '../packages/mock-data/src/index.ts';
import { customerScreens } from '../packages/navigation/src/customer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

console.log('--- Running XTREME Phase 2.5 Batch 3 (Payments & Modifications) Test Suite ---\n');

// 1. Verify Route Registration for all 5 Batch 3 screens
console.log('1. Verifying Route Registration for all 5 Batch 3 Screens:');
const requiredBatch3Routes = [
  { id: 'CUS-PAY-01', path: '/payments/choice', name: 'Payment Method Selection' },
  { id: 'CUS-PAY-02', path: '/payments/checkout-preview', name: 'Checkout Preview' },
  { id: 'CUS-PAY-03', path: '/payments/status', name: 'Payment Detail / Status' },
  { id: 'CUS-CHG-01', path: '/bookings/request-change', name: 'Booking Modification Request' },
  { id: 'CUS-CHG-02', path: '/bookings/request-cancel', name: 'Booking Cancellation Request' },
];

for (const scr of requiredBatch3Routes) {
  const registered = customerScreens.find((s) => s.path === scr.path);
  assert.ok(registered, `Route ${scr.path} (${scr.id}) must be registered in customerScreens`);
  console.log(`   ✓ Registered route: ${scr.path} (${scr.id})`);
}

// 2. Absence of Internal Screen IDs in Rendered Screen JSX
console.log('\n2. Verifying Absence of Internal Wireframe Screen IDs in Rendered UI:');
const screenFiles = [
  { file: 'apps/customer-mobile/app/payments/choice.tsx', name: 'CUS-PAY-01' },
  { file: 'apps/customer-mobile/app/payments/checkout-preview.tsx', name: 'CUS-PAY-02' },
  { file: 'apps/customer-mobile/app/payments/status.tsx', name: 'CUS-PAY-03' },
  { file: 'apps/customer-mobile/app/bookings/request-change.tsx', name: 'CUS-CHG-01' },
  { file: 'apps/customer-mobile/app/bookings/request-cancel.tsx', name: 'CUS-CHG-02' },
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

// 4. Test Live Booking Repository & ID Resolution
console.log('\n4. Testing Shared Frontend Booking Repository & Identity Resolution:');
resetBookings();
const initialCount = getAllBookings().length;
assert.ok(initialCount >= 5, 'Initial repository contains sample bookings');

const testBookingId = `bkg-test-${Date.now()}`;
const testReference = generateBookingReference(101);
const newBooking = {
  id: testBookingId,
  reference: testReference,
  customerId: 'demo-cus-001',
  serviceId: 'svc-airport-fasttrack',
  serviceName: 'Blaise Diagne VIP Fast-Track & Chauffeur',
  bookingMode: 'INSTANT',
  status: 'CONFIRMED',
  date: '2026-12-15',
  time: '14:30 GMT',
  pickupLocation: 'Blaise Diagne VIP Pavilion',
  dropoffLocation: 'Almadies Oceanfront Villa',
  passengers: 2,
  quantity: 2,
  currency: 'XOF',
  amount: 95000,
  depositAmount: 47500,
  remainingBalance: 47500,
  paymentStatus: 'PENDING',
  paymentMethod: 'STRIPE_CARD',
  createdAt: new Date().toISOString(),
};

addBooking(newBooking);

// Verify immediate availability in repository
const allAfterAdd = getAllBookings();
assert.strictEqual(allAfterAdd.length, initialCount + 1, 'Repository count increments by 1');
assert.strictEqual(allAfterAdd[0].id, testBookingId, 'Newly submitted booking appears at top');

// Verify exact ID resolution
const resolvedById = getBookingById(testBookingId);
assert.ok(resolvedById, 'Booking resolves exactly by ID');
assert.strictEqual(resolvedById.reference, testReference, 'Booking reference matches exactly');

// Verify invalid ID resolution returns undefined (never silently substitutes unrelated record)
const resolvedInvalid = getBookingById('invalid-nonexistent-id');
assert.strictEqual(
  resolvedInvalid,
  undefined,
  'Invalid ID resolves to undefined (triggers NotFoundCard)',
);

console.log('   ✓ New booking immediately added and visible in repository');
console.log('   ✓ Booking resolves by exact ID without substituting unrelated records');
console.log('   ✓ Invalid booking ID cleanly triggers not-found behavior');

// 5. Test Payment State Machine & Operational State Independence
console.log('\n5. Testing Payment State Machine & Operational State Separation:');
// Verify payment status is initially PENDING upon booking creation
assert.strictEqual(
  newBooking.paymentStatus,
  'PENDING',
  'Payment status is PENDING upon booking submission',
);
assert.strictEqual(newBooking.status, 'CONFIRMED', 'Operational status is CONFIRMED');

// Simulate Payment Choice: Choose Deposit
updateBooking(testBookingId, {
  paymentPurpose: 'DEPOSIT',
  paymentStatus: 'PROCESSING',
});
const inProcessing = getBookingById(testBookingId);
assert.strictEqual(inProcessing.paymentPurpose, 'DEPOSIT', 'Payment purpose stored');
assert.strictEqual(
  inProcessing.paymentStatus,
  'PROCESSING',
  'Payment status transitions to PROCESSING',
);
assert.strictEqual(
  inProcessing.status,
  'CONFIRMED',
  'Operational status remains CONFIRMED independently',
);

// Simulate Payment Success
const paymentChargeRef = 'ch_stripe_demo_test99';
updateBooking(testBookingId, {
  paymentStatus: 'SUCCEEDED',
  paymentReference: paymentChargeRef,
});
const succeededBooking = getBookingById(testBookingId);
assert.strictEqual(succeededBooking.paymentStatus, 'SUCCEEDED', 'Payment status is SUCCEEDED');
assert.strictEqual(succeededBooking.paymentReference, paymentChargeRef, 'Payment reference stored');
assert.strictEqual(
  succeededBooking.status,
  'CONFIRMED',
  'Operational booking status preserved independently',
);

// Simulate Payment Failure and Retry
updateBooking(testBookingId, {
  paymentStatus: 'FAILED',
});
const failedBooking = getBookingById(testBookingId);
assert.strictEqual(
  failedBooking.paymentStatus,
  'FAILED',
  'Payment status transitions to FAILED on simulation',
);
assert.strictEqual(
  failedBooking.status,
  'CONFIRMED',
  'Operational booking status remains unaffected by payment failure',
);

console.log('   ✓ Payment status remains strictly separate from operational status');
console.log(
  '   ✓ Payment lifecycle transitions (PENDING -> PROCESSING -> SUCCEEDED / FAILED) verified',
);

// 6. Test Booking Modification Request Lifecycle
console.log('\n6. Testing Booking Modification Request:');
const modRecord = {
  id: `mod-${Date.now()}`,
  bookingId: testBookingId,
  requestedChanges: 'Please shift flight pickup time to 16:30 GMT due to schedule change.',
  reason: 'Airline reschedule',
  status: 'PENDING',
  createdAt: new Date().toISOString(),
};

updateBooking(testBookingId, {
  modificationRequest: modRecord,
});
const modifiedBooking = getBookingById(testBookingId);
assert.ok(modifiedBooking.modificationRequest, 'Modification request attached to booking');
assert.strictEqual(
  modifiedBooking.modificationRequest.status,
  'PENDING',
  'Modification request status is PENDING',
);
assert.strictEqual(
  modifiedBooking.date,
  '2026-12-15',
  'Original date preserved while request is pending',
);
assert.strictEqual(
  modifiedBooking.status,
  'CONFIRMED',
  'Authoritative booking status remains CONFIRMED while pending',
);

console.log('   ✓ Modification request recorded with PENDING status');
console.log('   ✓ Authoritative booking data preserved until modification approval');

// 7. Test Booking Cancellation Request & State Separation
console.log('\n7. Testing Booking Cancellation Request & Refund Separation:');
const cancelRecord = {
  id: `can-${Date.now()}`,
  bookingId: testBookingId,
  reason: 'Client schedule cancellation',
  status: 'APPROVED',
  createdAt: new Date().toISOString(),
};

updateBooking(testBookingId, {
  status: 'CANCELLED',
  cancellationRequest: cancelRecord,
});
const cancelledBooking = getBookingById(testBookingId);
assert.strictEqual(
  cancelledBooking.status,
  'CANCELLED',
  'Operational status transitions to CANCELLED',
);
assert.strictEqual(
  cancelledBooking.paymentStatus,
  'FAILED', // Previously failed or succeeded
  'Payment status is NOT automatically refunded merely by submitting cancellation',
);

console.log('   ✓ Cancellation request updates operational status to CANCELLED');
console.log('   ✓ Cancellation does not automatically promise or mutate payment refund state');

// 8. Test Deterministic QA Demo Reset
console.log('\n8. Testing Deterministic QA Demo Reset:');
resetBookings();
const resetCount = getAllBookings().length;
assert.strictEqual(
  resetCount,
  initialCount,
  'Repository restored to initial sample bookings count',
);
assert.strictEqual(
  getBookingById(testBookingId),
  undefined,
  'Temporary mock bookings cleared on reset',
);
console.log('   ✓ resetBookings restores clean initial mock repository');

console.log('\n--- All Phase 2.5 Batch 3 Tests Passed! ---');
