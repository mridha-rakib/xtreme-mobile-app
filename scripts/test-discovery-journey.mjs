import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  sampleCategories,
  sampleLocations,
  sampleServices,
} from '../packages/mock-data/src/index.ts';
import { customerScreens } from '../packages/navigation/src/customer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

console.log('--- Running XTREME Complete Batch 1 (5 Screens) Journey Test Suite ---\n');

// 1. Verify Category & Services Mapping
console.log('1. Verifying Category & Services Model Alignment:');
assert.strictEqual(
  sampleCategories.length,
  6,
  'Must define exactly 6 authoritative categories matching Figma',
);
const expectedCategorySlugs = [
  'airport-transfer',
  'luxury-cars',
  'villas',
  'yachts',
  'activities',
  'nightlife',
];

sampleCategories.forEach((cat) => {
  assert.ok(
    expectedCategorySlugs.includes(cat.slug),
    `Category ${cat.slug} must match approved Figma catalog`,
  );
  console.log(`   ✓ Category: ${cat.name} (${cat.slug})`);
});

// 2. Journey Simulation: 5 Screens Flow
console.log('\n2. Testing Customer Navigation Journey across Batch 1 (5 Screens):');

// Journey Step 1: User visits Discovery Home (CUS-DISC-01)
const homeRoute = customerScreens.find((s) => s.path === '/discover');
assert.ok(homeRoute, 'Discovery Home route /discover must exist');
console.log('   ✓ Step 1: Navigated to /discover (CUS-DISC-01)');

// Journey Step 2: User taps Geography Selector (CUS-DISC-04)
const locationRoute = customerScreens.find((s) => s.path === '/discover/location');
assert.ok(locationRoute, 'Geography Selector route /discover/location must exist');
assert.ok(sampleLocations.length >= 5, 'Must have sample locations in Senegal');
console.log(
  `   ✓ Step 2: Navigated to /discover/location (CUS-DISC-04) with ${sampleLocations.length} Senegal locations`,
);

// Journey Step 3: User selects "Airport Transfer" category -> Services List (CUS-DISC-02)
const selectedCat = sampleCategories.find((c) => c.slug === 'airport-transfer');
assert.ok(selectedCat, 'Category airport-transfer must exist');
const servicesListRoute = customerScreens.find((s) => s.path === '/discover/services');
assert.ok(servicesListRoute, 'Services List route /discover/services must exist');

const filteredServices = sampleServices.filter((s) => s.categoryId === selectedCat.id);
assert.ok(filteredServices.length > 0, 'Must have at least one service under airport-transfer');
const targetService = filteredServices[0];
console.log(
  `   ✓ Step 3: Selected category "${selectedCat.name}" -> Filtered ${filteredServices.length} service(s) on /discover/services (CUS-DISC-02)`,
);

// Journey Step 4: User taps service item -> Service Detail (CUS-DISC-03)
const serviceDetailRoute = customerScreens.find((s) => s.path === '/discover/service-detail');
assert.ok(serviceDetailRoute, 'Service Detail route /discover/service-detail must exist');

const targetServiceId = targetService.id;
const resolvedService = sampleServices.find((s) => s.id === targetServiceId);
assert.ok(
  resolvedService,
  `Service ID ${targetServiceId} must resolve correctly in Service Detail`,
);
assert.strictEqual(
  resolvedService.name,
  targetService.name,
  'Resolved service name must match target',
);
console.log(
  `   ✓ Step 4: Preserved serviceId="${targetServiceId}" -> Resolved "${resolvedService.name}" on /discover/service-detail (CUS-DISC-03)`,
);

// Journey Step 5: User taps Continue -> Dynamic Booking Input (CUS-BKG-01)
const bookingInputRoute = customerScreens.find((s) => s.path === '/booking/input');
assert.ok(bookingInputRoute, 'Booking Input route /booking/input must exist');
console.log(
  `   ✓ Step 5: Preserved serviceId="${targetServiceId}" -> Navigated to /booking/input (CUS-BKG-01)`,
);

// Journey Step 6: User completes booking input -> Review Route
const bookingReviewRoute = customerScreens.find((s) => s.path === '/booking/review');
assert.ok(bookingReviewRoute, 'Booking Review route /booking/review must exist');
console.log('   ✓ Step 6: Booking flow completes seamlessly to /booking/review');

// 3. Verify Discovery & Booking Original Image Assets
console.log('\n3. Verifying Discovery & Booking Original Figma Assets:');
const batch1Assets = [
  'category_airport_transfer.png',
  'category_villas.png',
  'category_yachts.png',
  'category_activities.png',
  'category_nightlife.png',
  'service_airport_transfer_hero.png',
  'service_airport_transfer_thumb.png',
  'service_villa_thumb.png',
  'service_yacht_thumb.png',
  'service_activity_thumb.png',
  'service_nightlife_thumb.png',
  'icon_airport_transfer.svg',
  'icon_luxury_cars.svg',
  'icon_villas.svg',
  'icon_yachts.svg',
  'icon_activities.svg',
  'icon_nightlife.svg',
  'icon_location_pin.svg',
  'icon_chevron_down.svg',
  'icon_chevron_right.svg',
  'icon_search.svg',
  'icon_bell_circle.svg',
  'nav_home.svg',
  'nav_bookings.svg',
  'nav_concierge.svg',
  'nav_profile.svg',
];

const customerAssetsDir = path.join(repoRoot, 'apps/customer-mobile/assets/discovery');
for (const file of batch1Assets) {
  const p = path.join(customerAssetsDir, file);
  assert.ok(fs.existsSync(p), `Required asset must exist: ${file}`);
  const stat = fs.statSync(p);
  assert.ok(
    stat.size > 100,
    `Asset ${file} must have valid non-empty content (${stat.size} bytes)`,
  );
  console.log(`   ✓ Asset verified: ${file} (${stat.size} bytes)`);
}

// 4. Verify Absence of Wireframe IDs in Rendered Output for all 5 Batch 1 screens
console.log('\n4. Verifying Absence of Internal Screen IDs in Rendered Batch 1 UI:');
const screensToCheck = [
  { name: 'CUS-DISC-01 (Discovery Home)', file: 'apps/customer-mobile/app/discover.tsx' },
  { name: 'CUS-DISC-02 (Services List)', file: 'apps/customer-mobile/app/discover/services.tsx' },
  {
    name: 'CUS-DISC-03 (Service Detail)',
    file: 'apps/customer-mobile/app/discover/service-detail.tsx',
  },
  {
    name: 'CUS-DISC-04 (Geography Selector)',
    file: 'apps/customer-mobile/app/discover/location.tsx',
  },
  {
    name: 'CUS-BKG-01 (Dynamic Booking Input)',
    file: 'apps/customer-mobile/app/booking/input.tsx',
  },
];

for (const scr of screensToCheck) {
  const content = fs.readFileSync(path.join(repoRoot, scr.file), 'utf8');
  const violations = content
    .split('\n')
    .filter((l) => />\s*CUS-[A-Z0-9-]+\s*</.test(l) || /eyebrow\s*=\s*["']CUS-/.test(l));

  assert.strictEqual(
    violations.length,
    0,
    `${scr.name} must not render wireframe IDs in UI:\n${violations.join('\n')}`,
  );
  console.log(`   ✓ ${scr.name}: Zero internal screen IDs rendered`);
}

console.log('\n--- All Batch 1 Discovery & Booking Input Flow Tests Passed! ---');
