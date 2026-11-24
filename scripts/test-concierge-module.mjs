import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  addConciergeRequest,
  addMessage,
  convertFromBaseXof,
  generateConciergeReference,
  getAllConciergeRequests,
  getAllConversations,
  getBookingById,
  getConciergeRequestById,
  getConversationById,
  getMessagesByConversationId,
  resetBookings,
  resetConciergeState,
  resolveCancellationRequest,
  sampleConciergeRequests,
  sampleConversations,
  sampleMessages,
  updateBooking,
  updateConciergeRequest,
} from '../packages/mock-data/src/index.ts';
import { customerScreens } from '../packages/navigation/src/customer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

console.log('--- Running XTREME Phase 2.6 Batch 4 (Concierge Module) Test Suite ---\n');

// 1. Verify Route Registration for all 5 Concierge screens
console.log('1. Verifying Route Registration for all 5 Concierge Screens:');
const requiredConciergeRoutes = [
  {
    id: 'CUS-CON-01',
    path: '/concierge/plan-trip',
    name: 'Plan My Entire Trip / Concierge Request',
  },
  { id: 'CUS-CON-02', path: '/concierge/requests', name: 'Concierge Requests' },
  { id: 'CUS-CON-03', path: '/concierge/request-detail', name: 'Concierge Request Detail' },
  { id: 'CUS-CON-04', path: '/concierge/conversations', name: 'Concierge Conversations' },
  {
    id: 'CUS-CON-05',
    path: '/concierge/conversation-detail',
    name: 'Concierge Conversation Detail',
  },
];

for (const scr of requiredConciergeRoutes) {
  const registered = customerScreens.find((s) => s.path === scr.path);
  assert.ok(registered, `Route ${scr.path} (${scr.id}) must be registered in customerScreens`);
  console.log(`   ✓ Registered route: ${scr.path} (${scr.id})`);
}

// 2. Absence of Internal Screen IDs in Rendered Screen JSX
console.log('\n2. Verifying Absence of Internal Wireframe Screen IDs in Rendered UI:');
const screenFiles = [
  { file: 'apps/customer-mobile/app/concierge/plan-trip.tsx', name: 'CUS-CON-01' },
  { file: 'apps/customer-mobile/app/concierge/requests.tsx', name: 'CUS-CON-02' },
  { file: 'apps/customer-mobile/app/concierge/request-detail.tsx', name: 'CUS-CON-03' },
  { file: 'apps/customer-mobile/app/concierge/conversations.tsx', name: 'CUS-CON-04' },
  { file: 'apps/customer-mobile/app/concierge/conversation-detail.tsx', name: 'CUS-CON-05' },
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

// 4. Test Live Concierge Request Repository
console.log('\n4. Testing Live Concierge Request Repository & Lifecycle:');
resetConciergeState();
const initialRequests = getAllConciergeRequests();
assert.ok(
  initialRequests.length >= 4,
  'Should have at least 4 sample concierge requests matching Figma',
);

// Reference generation
const ref1 = generateConciergeReference();
const ref2 = generateConciergeReference();
assert.ok(ref1.startsWith('CR-2026-'), 'Concierge reference must follow CR-2026-XXXX format');
assert.notStrictEqual(ref1, ref2, 'Concierge references must be sequentially distinct');
console.log(`   ✓ Concierge reference sequence generated: ${ref1}, ${ref2}`);

// Adding request
const newReqId = 'req-test-qa-001';
const submittedReq = addConciergeRequest({
  id: newReqId,
  reference: ref1,
  customerId: 'demo-cus-001',
  title: 'Helicopter Beach Safari',
  type: 'PLAN_TRIP',
  details: 'Private helicopter flight with beach landing at Cap Skirring',
  status: 'OPEN',
  createdAt: new Date().toISOString(),
});

assert.strictEqual(submittedReq.id, newReqId);
const resolved = getConciergeRequestById(newReqId);
assert.ok(resolved, 'New concierge request must be resolvable by exact ID');
assert.strictEqual(resolved.reference, ref1);
assert.strictEqual(resolved.status, 'OPEN');

// Resolving by reference
const resolvedByRef = getConciergeRequestById(ref1);
assert.ok(resolvedByRef, 'Concierge request must be resolvable by reference string');
assert.strictEqual(resolvedByRef.id, newReqId);

// Update status
const updated = updateConciergeRequest(newReqId, { status: 'IN_PROGRESS' });
assert.ok(updated);
assert.strictEqual(updated.status, 'IN_PROGRESS');
console.log('   ✓ Concierge request addition, resolution, and status mutation verified');

// Unknown ID returns undefined
const unknownReq = getConciergeRequestById('req-non-existent-999');
assert.strictEqual(unknownReq, undefined, 'Unknown concierge request ID must return undefined');
console.log('   ✓ Unknown ID safely returns undefined (triggers NotFoundCard)');

// 5. Test Live Conversations & Messaging System
console.log('\n5. Testing Live Conversations & Messaging System:');
const initialConvs = getAllConversations();
assert.ok(
  initialConvs.length >= 6,
  'Should have at least 6 conversations matching Figma CUS-CON-04',
);

const conv1 = getConversationById('conv-demo-001');
assert.ok(conv1, 'conv-demo-001 must exist');
const initialMsgs = getMessagesByConversationId('conv-demo-001');
assert.ok(
  initialMsgs.length >= 5,
  'conv-demo-001 should have at least 5 messages matching Figma thread',
);

// Add new message
addMessage({
  id: `msg-test-${Date.now()}`,
  conversationId: 'conv-demo-001',
  senderId: 'demo-cus-001',
  senderName: 'You',
  isStaff: false,
  content: 'Please also confirm catering for sunset on the dunes.',
  timestamp: '10:35',
});

const updatedMsgs = getMessagesByConversationId('conv-demo-001');
assert.strictEqual(updatedMsgs.length, initialMsgs.length + 1, 'Message count must increment');
assert.strictEqual(
  updatedMsgs[updatedMsgs.length - 1].content,
  'Please also confirm catering for sunset on the dunes.',
);

const updatedConv = getConversationById('conv-demo-001');
assert.strictEqual(
  updatedConv.lastMessageSnippet,
  'Please also confirm catering for sunset on the dunes.',
);
assert.strictEqual(updatedConv.lastUpdated, '10:35');
console.log('   ✓ Dialogue messaging appends, snippet updates, and timestamp persists correctly');

// 6. Test Preflight A1: Cancellation Request Lifecycle
console.log('\n6. Testing Preflight A1 - Cancellation Request Lifecycle:');
resetBookings();
const testBooking = getBookingById('bkg-demo-001');
assert.ok(testBooking);
const initialBookingStatus = testBooking.status;

// Simulate cancellation submission
updateBooking(testBooking.id, {
  cancellationRequest: {
    status: 'PENDING',
    reason: 'Client schedule conflict',
    requestedAt: new Date().toISOString(),
  },
});

const bookingAfterCancelRequest = getBookingById(testBooking.id);
assert.strictEqual(
  bookingAfterCancelRequest.cancellationRequest?.status,
  'PENDING',
  'Cancellation request must have PENDING status upon customer submission',
);
assert.strictEqual(
  bookingAfterCancelRequest.status,
  initialBookingStatus,
  'Booking operational status must NOT become CANCELLED immediately upon submission',
);

// Resolve cancellation
resolveCancellationRequest(testBooking.id, 'APPROVED');
const bookingAfterApproval = getBookingById(testBooking.id);
assert.strictEqual(bookingAfterApproval.status, 'CANCELLED');
assert.strictEqual(bookingAfterApproval.cancellationRequest?.status, 'APPROVED');
console.log(
  '   ✓ Cancellation request preserves original status as PENDING until authorized resolution',
);

// 7. Test Preflight A4: Currency Conversion Consistency
console.log('\n7. Testing Preflight A4 - Currency Conversion Consistency:');
const baseXof = 95000;
const eurConv = convertFromBaseXof(baseXof, 'EUR');
assert.strictEqual(eurConv.isConverted, true);
assert.strictEqual(eurConv.rate, 655.957);
assert.strictEqual(eurConv.amount, Math.round(95000 / 655.957)); // ~145 EUR, never 95000 EUR!

const usdConv = convertFromBaseXof(baseXof, 'USD');
assert.strictEqual(usdConv.isConverted, true);
assert.strictEqual(usdConv.rate, 610.0);
assert.strictEqual(usdConv.amount, Math.round(95000 / 610.0)); // ~156 USD, never 95000 USD!

const xofConv = convertFromBaseXof(baseXof, 'XOF');
assert.strictEqual(xofConv.isConverted, false);
assert.strictEqual(xofConv.amount, 95000);
console.log(
  `   ✓ Currency conversions accurate: 95,000 XOF = ~${eurConv.amount} EUR / ~${usdConv.amount} USD`,
);

// 8. Test Deterministic State Reset
console.log('\n8. Testing Deterministic State Reset:');
resetConciergeState();
const resetRequests = getAllConciergeRequests();
assert.strictEqual(resetRequests.length, sampleConciergeRequests.length);
assert.strictEqual(
  getConciergeRequestById(newReqId),
  undefined,
  'Test request must be removed after reset',
);

const resetConvs = getAllConversations();
assert.strictEqual(resetConvs.length, sampleConversations.length);

const resetMsgs = getMessagesByConversationId('conv-demo-001');
assert.strictEqual(
  resetMsgs.length,
  sampleMessages.filter((m) => m.conversationId === 'conv-demo-001').length,
);
console.log('   ✓ resetConciergeState cleanly restores initial mock data');

console.log('\n--- All Phase 2.6 Batch 4 Concierge Module Tests Passed! ---');
