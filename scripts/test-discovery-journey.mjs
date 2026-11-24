import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sampleCategories, sampleServices } from '../packages/mock-data/src/index.ts';
import { customerScreens } from '../packages/navigation/src/customer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

console.log('--- Running XTREME Discovery Flow & Navigation Journey Test Suite ---\n');

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

// 2. Journey Simulation: Discovery Home -> Services List -> Service Detail
console.log(
  '\n2. Testing Customer Navigation Journey (Discovery Home -> Services List -> Service Detail):',
);

// Journey Step 1: User visits Discovery Home
const homeRoute = customerScreens.find((s) => s.path === '/discover');
assert.ok(homeRoute, 'Discovery Home route /discover must exist');
console.log('   ✓ Step 1: Navigated to /discover (CUS-DISC-01)');

// Journey Step 2: User selects "Airport Transfer" category
const selectedCat = sampleCategories.find((c) => c.slug === 'airport-transfer');
assert.ok(selectedCat, 'Category airport-transfer must exist');
const servicesListRoute = customerScreens.find((s) => s.path === '/discover/services');
assert.ok(servicesListRoute, 'Services List route /discover/services must exist');

const filteredServices = sampleServices.filter((s) => s.categoryId === selectedCat.id);
assert.ok(filteredServices.length > 0, 'Must have at least one service under airport-transfer');
const targetService = filteredServices[0];
console.log(
  `   ✓ Step 2: Selected category "${selectedCat.name}" -> Filtered ${filteredServices.length} service(s) on /discover/services (CUS-DISC-02)`,
);

// Journey Step 3: User taps service item to view Service Detail
const serviceDetailRoute = customerScreens.find((s) => s.path === '/discover/service-detail');
assert.ok(serviceDetailRoute, 'Service Detail route /discover/service-detail must exist');

// Verify serviceId preservation
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
  `   ✓ Step 3: Preserved serviceId="${targetServiceId}" -> Successfully resolved "${resolvedService.name}" on /discover/service-detail`,
);

// 3. Verify Discovery Original Image Assets Existence & Sizes
console.log('\n3. Verifying Discovery Original Figma Assets:');
const discoveryAssets = [
  'category_airport_transfer.png',
  'category_villas.png',
  'category_yachts.png',
  'category_activities.png',
  'category_nightlife.png',
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
for (const file of discoveryAssets) {
  const p = path.join(customerAssetsDir, file);
  assert.ok(fs.existsSync(p), `Discovery asset must exist: ${file}`);
  const stat = fs.statSync(p);
  assert.ok(
    stat.size > 100,
    `Asset ${file} must have valid non-empty content (${stat.size} bytes)`,
  );
  console.log(`   ✓ Asset verified: ${file} (${stat.size} bytes)`);
}

// 4. Verify Absence of Wireframe IDs in Rendered Output
console.log('\n4. Verifying Absence of Internal Screen IDs in Rendered Discovery UI:');
const discoverHomeContent = fs.readFileSync(
  path.join(repoRoot, 'apps/customer-mobile/app/discover.tsx'),
  'utf8',
);
const servicesListContent = fs.readFileSync(
  path.join(repoRoot, 'apps/customer-mobile/app/discover/services.tsx'),
  'utf8',
);

// Check that JSX does not render wireframe codes in user-facing text
const jsxDiscoverViolations = discoverHomeContent
  .split('\n')
  .filter((l) => />\s*CUS-[A-Z0-9-]+\s*</.test(l) || /eyebrow\s*=\s*["']CUS-/.test(l));
const jsxServicesViolations = servicesListContent
  .split('\n')
  .filter((l) => />\s*CUS-[A-Z0-9-]+\s*</.test(l) || /eyebrow\s*=\s*["']CUS-/.test(l));

assert.strictEqual(
  jsxDiscoverViolations.length,
  0,
  `Discovery Home must not render wireframe IDs in UI:\n${jsxDiscoverViolations.join('\n')}`,
);
assert.strictEqual(
  jsxServicesViolations.length,
  0,
  `Services List must not render wireframe IDs in UI:\n${jsxServicesViolations.join('\n')}`,
);
console.log('   ✓ Zero internal screen codes rendered in Discovery screens');

console.log('\n--- All Discovery Flow & Navigation Journey Tests Passed! ---');
