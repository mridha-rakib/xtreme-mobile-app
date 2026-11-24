import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  addStaffIssueReport,
  canTransitionAssignmentStatus,
  getAllBookings,
  getAllowedNextAssignmentStatuses,
  getAllStaffAssignments,
  getAllStaffHistory,
  getAllStaffIssueReports,
  getStaffAssignmentById,
  getStaffAssignmentsByTab,
  resetStaffState,
  subscribeStaff,
  updateStaffAssignmentStatus,
} from '../packages/mock-data/src/index.ts';
import { customerScreens } from '../packages/navigation/src/customer.ts';
import { staffScreens } from '../packages/navigation/src/staff.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

console.log('======================================================================');
console.log('  XTREME Mobile — Phase 3.1 Staff Mobile Complete Test Suite          ');
console.log('======================================================================\n');

// -----------------------------------------------------------------------------
// 1. All 6 Staff Mobile Routes Registered & Files Exist
// -----------------------------------------------------------------------------
console.log('1. Verifying All 6 Staff Mobile Routes & Component Files:');

assert.strictEqual(staffScreens.length, 6, 'Must register exactly 6 staff screens');

for (const scr of staffScreens) {
  assert.ok(scr.id && scr.title && scr.path, `Staff screen definition valid for ${scr.id}`);

  const relativeFilePath = scr.path.replace(/^\//, '');
  let targetFile = path.join(repoRoot, 'apps/staff-mobile/app', `${relativeFilePath}.tsx`);
  if (!fs.existsSync(targetFile)) {
    targetFile = path.join(repoRoot, 'apps/staff-mobile/app', relativeFilePath, 'index.tsx');
  }
  assert.ok(
    fs.existsSync(targetFile),
    `Component file must exist for staff screen ${scr.id} at ${scr.path} (checked ${targetFile})`,
  );
  console.log(`   ✓ [${scr.id}] ${scr.path} -> ${path.relative(repoRoot, targetFile)}`);
}

// -----------------------------------------------------------------------------
// 2. Absence of Internal Wireframe Screen IDs in User-Facing Text
// -----------------------------------------------------------------------------
console.log('\n2. Verifying Absence of Internal Wireframe Screen IDs in User-Facing Text:');

const staffAppDir = path.join(repoRoot, 'apps/staff-mobile/app');
function checkDirectoryForWireframeText(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDirectoryForWireframeText(fullPath);
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.tsx') &&
      entry.name !== 'index.tsx' // QA directory index intentionally lists IDs for QA navigation
    ) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Match <Text ...>STF-... or >STF-...
        if (/<Text[^>]*>[^<]*STF-[A-Z]+-\d+/i.test(line) || />\s*STF-[A-Z]+-\d+\s*</i.test(line)) {
          assert.fail(
            `Found internal wireframe screen ID in user-facing JSX in ${path.relative(repoRoot, fullPath)}:${i + 1}:\n  ${line.trim()}`,
          );
        }
      }
    }
  }
}
checkDirectoryForWireframeText(staffAppDir);
console.log('   ✓ No internal wireframe screen IDs found in user-facing UI text');

// -----------------------------------------------------------------------------
// 3. Staff Assignments Reactive Store & Query Operations
// -----------------------------------------------------------------------------
console.log('\n3. Verifying Staff Assignments Reactive Store & Query Operations:');

resetStaffState();

const initialAssignments = getAllStaffAssignments();
assert.ok(initialAssignments.length >= 4, 'Must seed initial operational assignments');

const firstAsg = initialAssignments[0];
assert.ok(firstAsg.id, 'Assignment must have an ID');
assert.ok(firstAsg.title, 'Assignment must have a title');
assert.ok(firstAsg.customerName, 'Assignment must have a customerName');
assert.ok(firstAsg.assignmentStatus, 'Assignment must have an assignmentStatus');
assert.ok(firstAsg.pickupLocation, 'Assignment must have pickupLocation');

// Test lookup by ID
const fetchedAsg = getStaffAssignmentById(firstAsg.id);
assert.ok(fetchedAsg, `Assignment ${firstAsg.id} must be retrievable`);
assert.strictEqual(fetchedAsg.title, firstAsg.title);

// Test non-existent ID lookup
const missingAsg = getStaffAssignmentById('non-existent-asg-id-999');
assert.strictEqual(missingAsg, undefined, 'Unknown assignment ID must safely return undefined');

// Test tab filtering
const todayAsgs = getStaffAssignmentsByTab('today');
const upcomingAsgs = getStaffAssignmentsByTab('upcoming');
const historyAsgs = getStaffAssignmentsByTab('history');
assert.ok(Array.isArray(todayAsgs), 'Today assignments must be an array');
assert.ok(Array.isArray(upcomingAsgs), 'Upcoming assignments must be an array');
assert.ok(Array.isArray(historyAsgs), 'History assignments must be an array');
assert.ok(historyAsgs.length >= 2, 'History tab must contain historical assignments');

// History items must be completed or unable to complete
for (const h of historyAsgs) {
  assert.ok(
    h.assignmentStatus === 'COMPLETED' || h.assignmentStatus === 'UNABLE_TO_COMPLETE',
    `History item ${h.id} has non-terminal status: ${h.assignmentStatus}`,
  );
}
const directHistory = getAllStaffHistory();
assert.strictEqual(
  directHistory.length,
  historyAsgs.length,
  'getAllStaffHistory must match history tab',
);
console.log(
  `   ✓ Staff store queries verified (total: ${initialAssignments.length}, today: ${todayAsgs.length}, upcoming: ${upcomingAsgs.length}, history: ${historyAsgs.length})`,
);

// -----------------------------------------------------------------------------
// 4. State Machine Transition Rules & Mutations
// -----------------------------------------------------------------------------
console.log('\n4. Verifying State Machine Transition Rules & Mutations:');

// Test allowed next statuses
assert.deepStrictEqual(getAllowedNextAssignmentStatuses('ASSIGNED'), [
  'ACCEPTED',
  'UNABLE_TO_COMPLETE',
]);
assert.deepStrictEqual(getAllowedNextAssignmentStatuses('ACCEPTED'), [
  'EN_ROUTE',
  'ARRIVED',
  'IN_PROGRESS',
  'UNABLE_TO_COMPLETE',
]);
assert.deepStrictEqual(getAllowedNextAssignmentStatuses('EN_ROUTE'), [
  'ARRIVED',
  'IN_PROGRESS',
  'UNABLE_TO_COMPLETE',
]);
assert.deepStrictEqual(getAllowedNextAssignmentStatuses('ARRIVED'), [
  'IN_PROGRESS',
  'UNABLE_TO_COMPLETE',
]);
assert.deepStrictEqual(getAllowedNextAssignmentStatuses('IN_PROGRESS'), [
  'COMPLETED',
  'UNABLE_TO_COMPLETE',
]);
assert.deepStrictEqual(getAllowedNextAssignmentStatuses('COMPLETED'), []);
assert.deepStrictEqual(getAllowedNextAssignmentStatuses('UNABLE_TO_COMPLETE'), []);

// Test transition permission checks
assert.strictEqual(canTransitionAssignmentStatus('ASSIGNED', 'ACCEPTED'), true);
assert.strictEqual(canTransitionAssignmentStatus('ASSIGNED', 'COMPLETED'), false);
assert.strictEqual(canTransitionAssignmentStatus('COMPLETED', 'ASSIGNED'), false);
assert.strictEqual(canTransitionAssignmentStatus('IN_PROGRESS', 'COMPLETED'), true);

// Test transition mutation & subscription
let notified = false;
const unsubscribe = subscribeStaff(() => {
  notified = true;
});

const asgToUpdate = initialAssignments.find((a) => a.assignmentStatus === 'ASSIGNED');
assert.ok(asgToUpdate, 'Must have an ASSIGNED assignment to test transition');

const updatedResult = updateStaffAssignmentStatus(
  asgToUpdate.id,
  'ACCEPTED',
  'Driver accepted mission on time',
);
assert.ok(updatedResult.success, 'updateStaffAssignmentStatus must succeed');
assert.ok(updatedResult.assignment, 'updateStaffAssignmentStatus must return updated assignment');
assert.strictEqual(updatedResult.assignment.assignmentStatus, 'ACCEPTED');
assert.ok(updatedResult.assignment.notes.length > 0, 'Operational note must be recorded');
assert.strictEqual(notified, true, 'Subscribers must be notified on status update');

unsubscribe();
console.log('   ✓ State machine transitions and reactive notifications verified');

// -----------------------------------------------------------------------------
// 5. Staff Issue Reporting & Financial State Isolation
// -----------------------------------------------------------------------------
console.log('\n5. Verifying Staff Issue Reporting & Financial State Isolation:');

const customerBookingsBefore = JSON.stringify(getAllBookings());

const issueReport = addStaffIssueReport({
  assignmentId: asgToUpdate.id,
  category: 'TRAFFIC',
  severity: 'MEDIUM',
  issueContext: 'Severe traffic bottleneck on Autoroute de l’Avenir',
  visibilityScope: 'OPERATIONS_AND_CUSTOMER',
  assignmentOutcome: 'DELAY_EXPECTED',
  note: 'Encountered 25 minute delay due to road construction detour.',
});

assert.ok(issueReport.id, 'Issue report must have generated ID');
assert.strictEqual(issueReport.assignmentId, asgToUpdate.id);

const allReports = getAllStaffIssueReports();
assert.ok(
  allReports.some((r) => r.id === issueReport.id),
  'Logged issue report must be retrievable from staff store',
);

// Verify critical issue outcome marks assignment UNABLE_TO_COMPLETE
const criticalReport = addStaffIssueReport({
  assignmentId: asgToUpdate.id,
  category: 'MECHANICAL',
  severity: 'CRITICAL',
  issueContext: 'Vehicle mechanical breakdown',
  visibilityScope: 'OPERATIONS_ONLY',
  assignmentOutcome: 'UNABLE_TO_COMPLETE',
  note: 'Vehicle engine overheating, recovery truck summoned.',
});
assert.strictEqual(criticalReport.assignmentOutcome, 'UNABLE_TO_COMPLETE');

const finalAsgState = getStaffAssignmentById(asgToUpdate.id);
assert.strictEqual(
  finalAsgState.assignmentStatus,
  'UNABLE_TO_COMPLETE',
  'Critical report with UNABLE_TO_COMPLETE outcome must transition assignment to UNABLE_TO_COMPLETE',
);

// Verify customer bookings remain 100% untampered
const customerBookingsAfter = JSON.stringify(getAllBookings());
assert.strictEqual(
  customerBookingsBefore,
  customerBookingsAfter,
  'Staff operations must never mutate customer bookings or financial statuses',
);
console.log('   ✓ Staff issue reporting and financial state isolation verified');

// -----------------------------------------------------------------------------
// 6. Regression Check: Customer Mobile 34 Routes
// -----------------------------------------------------------------------------
console.log('\n6. Regression Check: All 34 Customer Mobile Routes Preserved:');

assert.strictEqual(customerScreens.length, 34, 'Customer mobile must retain all 34 screens');
for (const scr of customerScreens) {
  const relativeFilePath = scr.path.replace(/^\//, '');
  let targetFile = path.join(repoRoot, 'apps/customer-mobile/app', `${relativeFilePath}.tsx`);
  if (!fs.existsSync(targetFile)) {
    targetFile = path.join(repoRoot, 'apps/customer-mobile/app', relativeFilePath, 'index.tsx');
  }
  assert.ok(fs.existsSync(targetFile), `Customer screen ${scr.id} must exist`);
}
console.log('   ✓ All 34 Customer mobile screens intact and undisturbed');

console.log('\n======================================================================');
console.log('  ALL STAFF MOBILE ACCEPTANCE & INTEGRITY TESTS PASSED SUCCESSFULLY!  ');
console.log('======================================================================\n');
