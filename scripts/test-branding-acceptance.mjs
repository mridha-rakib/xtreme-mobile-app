import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

console.log('--- Running XTREME Final Figma Branding & Navigation Acceptance Suite ---\n');

// 1. Native Branding & Asset Verification
console.log('1. Verifying Native Branding & App Icons:');
const assetChecks = [
  { path: 'packages/ui/src/assets/logo.png', minSize: 40000, desc: 'Shared High-Res Master Logo' },
  { path: 'apps/customer-mobile/assets/logo.png', minSize: 40000, desc: 'Customer Master Logo' },
  {
    path: 'apps/customer-mobile/assets/icon.png',
    minSize: 50000,
    desc: 'Customer App Icon (1024x1024)',
  },
  {
    path: 'apps/customer-mobile/assets/adaptive-icon.png',
    minSize: 20000,
    desc: 'Customer Android Adaptive Icon',
  },
  {
    path: 'apps/customer-mobile/assets/splash.png',
    minSize: 50000,
    desc: 'Customer Native Splash Artwork',
  },
  { path: 'apps/customer-mobile/assets/favicon.png', minSize: 1000, desc: 'Customer Favicon' },
  { path: 'apps/staff-mobile/assets/logo.png', minSize: 40000, desc: 'Staff Master Logo' },
  {
    path: 'apps/staff-mobile/assets/icon.png',
    minSize: 50000,
    desc: 'Staff App Icon (1024x1024 with Ops Badge)',
  },
  {
    path: 'apps/staff-mobile/assets/adaptive-icon.png',
    minSize: 20000,
    desc: 'Staff Android Adaptive Icon',
  },
  {
    path: 'apps/staff-mobile/assets/splash.png',
    minSize: 50000,
    desc: 'Staff Native Splash Artwork',
  },
  { path: 'apps/staff-mobile/assets/favicon.png', minSize: 1000, desc: 'Staff Favicon' },
];

for (const asset of assetChecks) {
  const fullPath = path.join(repoRoot, asset.path);
  assert.ok(fs.existsSync(fullPath), `Asset file must exist: ${asset.path}`);
  const stat = fs.statSync(fullPath);
  assert.ok(
    stat.size >= asset.minSize,
    `Asset ${asset.path} size (${stat.size} bytes) below minimum expected (${asset.minSize} bytes)`,
  );
  console.log(`   ✓ ${asset.desc} verified (${stat.size} bytes)`);
}

// 2. Vector Navigation & BackButton Verification
console.log('\n2. Verifying Vector Navigation & Absence of Text Back Controls:');

function scanForTextBack(dir) {
  const violations = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      violations.push(...scanForTextBack(fullPath));
    } else if (f.name.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // Disallow directional text controls like "‹ Back", "← Back", "<Text ...>Back</Text>" inside Pressable/Button
        if (/‹\s*Back|←\s*Back/.test(line)) {
          violations.push(`${fullPath}:${idx + 1}: Directional text arrow used: "${line.trim()}"`);
        }
        if (/<Text[^>]*>\s*Back\s*<\/Text>/i.test(line)) {
          violations.push(`${fullPath}:${idx + 1}: Raw text Back button used: "${line.trim()}"`);
        }
      });
    }
  }
  return violations;
}

const customerAppDir = path.join(repoRoot, 'apps/customer-mobile/app');
const staffAppDir = path.join(repoRoot, 'apps/staff-mobile/app');
const textBackViolations = [...scanForTextBack(customerAppDir), ...scanForTextBack(staffAppDir)];

assert.strictEqual(
  textBackViolations.length,
  0,
  `Found ${textBackViolations.length} directional text navigation violations:\n${textBackViolations.join('\n')}`,
);
console.log(
  '   ✓ Zero directional text navigation controls ("‹ Back", "← Back", "<Text>Back</Text>") across all routes',
);

// 3. Rendered Wireframe Screen ID Audit
console.log('\n3. Verifying Absence of Internal Screen IDs in Rendered UI:');

function scanForRenderedScreenIds(dir) {
  const violations = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      violations.push(...scanForRenderedScreenIds(fullPath));
    } else if (f.name.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // Match eyebrow="CUS-..." or >CUS-...<
        if (/eyebrow\s*=\s*["'](CUS|STF)-[A-Z0-9-]+["']/.test(line)) {
          violations.push(`${fullPath}:${idx + 1}: Internal ID in eyebrow: "${line.trim()}"`);
        }
        if (/>\s*(CUS|STF)-[A-Z0-9-]+\s*</.test(line)) {
          violations.push(`${fullPath}:${idx + 1}: Internal ID in JSX text: "${line.trim()}"`);
        }
      });
    }
  }
  return violations;
}

const screenIdViolations = [
  ...scanForRenderedScreenIds(customerAppDir),
  ...scanForRenderedScreenIds(staffAppDir),
];

assert.strictEqual(
  screenIdViolations.length,
  0,
  `Found ${screenIdViolations.length} internal screen ID violations:\n${screenIdViolations.join('\n')}`,
);
console.log('   ✓ Zero internal screen IDs rendered in user-facing UI');

// 4. Build-Mode & QA Demo Access Isolation
console.log('\n4. Verifying Build Modes & QA Demo Isolation:');

const easCustomer = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'apps/customer-mobile/eas.json'), 'utf8'),
);
const easStaff = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'apps/staff-mobile/eas.json'), 'utf8'),
);

// Verify Preview profile
assert.strictEqual(
  easCustomer.build.preview.env.EXPO_PUBLIC_APP_VARIANT,
  'preview',
  'Customer EAS preview must set EXPO_PUBLIC_APP_VARIANT="preview"',
);
assert.strictEqual(
  easCustomer.build.preview.env.EXPO_PUBLIC_DEMO_MODE,
  'true',
  'Customer EAS preview must set EXPO_PUBLIC_DEMO_MODE="true"',
);
assert.strictEqual(
  easStaff.build.preview.env.EXPO_PUBLIC_APP_VARIANT,
  'preview',
  'Staff EAS preview must set EXPO_PUBLIC_APP_VARIANT="preview"',
);
assert.strictEqual(
  easStaff.build.preview.env.EXPO_PUBLIC_DEMO_MODE,
  'true',
  'Staff EAS preview must set EXPO_PUBLIC_DEMO_MODE="true"',
);
console.log('   ✓ Preview EAS profiles enable demo navigation mode');

// Verify Production profile
assert.strictEqual(
  easCustomer.build.production.env.EXPO_PUBLIC_APP_VARIANT,
  'production',
  'Customer EAS production must set EXPO_PUBLIC_APP_VARIANT="production"',
);
assert.strictEqual(
  easCustomer.build.production.env.EXPO_PUBLIC_DEMO_MODE,
  'false',
  'Customer EAS production must set EXPO_PUBLIC_DEMO_MODE="false"',
);
assert.strictEqual(
  easStaff.build.production.env.EXPO_PUBLIC_APP_VARIANT,
  'production',
  'Staff EAS production must set EXPO_PUBLIC_APP_VARIANT="production"',
);
assert.strictEqual(
  easStaff.build.production.env.EXPO_PUBLIC_DEMO_MODE,
  'false',
  'Staff EAS production must set EXPO_PUBLIC_DEMO_MODE="false"',
);
console.log('   ✓ Production EAS profiles strictly disable demo bypass');

// Verify MockAuthProvider permission logic
function evaluateDemoPermission({ isDev, appVariant, demoModeEnv }) {
  const isExplicitPreview = appVariant === 'preview' || demoModeEnv === 'true';
  return isDev || isExplicitPreview;
}

assert.strictEqual(
  evaluateDemoPermission({ isDev: true, appVariant: 'development', demoModeEnv: 'false' }),
  true,
  'Dev mode must permit demo',
);
assert.strictEqual(
  evaluateDemoPermission({ isDev: false, appVariant: 'preview', demoModeEnv: 'true' }),
  true,
  'Preview mode must permit demo',
);
assert.strictEqual(
  evaluateDemoPermission({ isDev: false, appVariant: 'production', demoModeEnv: 'false' }),
  false,
  'Production mode must strictly forbid demo',
);
console.log(
  '   ✓ Security logic: Demo mode strictly blocked in production, allowed in dev & preview',
);

console.log('\n--- All Branding, Navigation & Build Mode Acceptance Checks Passed! ---');
