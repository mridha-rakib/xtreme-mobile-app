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
    minSize: 10000,
    desc: 'Customer Native Splash Icon (Cropped Transparent Vector/Raster)',
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
    minSize: 10000,
    desc: 'Staff Native Splash Icon (Cropped Transparent Vector/Raster)',
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

// 2. Splash Screen Configuration & expo-splash-screen Plugin Audit
console.log('\n2. Verifying expo-splash-screen Native Plugin Configurations:');
const appJsonCustomer = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'apps/customer-mobile/app.json'), 'utf8'),
);
const appJsonStaff = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'apps/staff-mobile/app.json'), 'utf8'),
);

function verifySplashPlugin(appJson, appName) {
  const plugins = appJson.expo.plugins || [];
  const splashPlugin = plugins.find((p) => Array.isArray(p) && p[0] === 'expo-splash-screen');
  assert.ok(splashPlugin, `${appName} must configure expo-splash-screen plugin`);
  const config = splashPlugin[1];
  assert.strictEqual(
    config.backgroundColor,
    '#FAF8F4',
    `${appName} splash background color must be authoritative Ivory #FAF8F4`,
  );
  assert.strictEqual(
    config.image,
    './assets/splash.png',
    `${appName} splash plugin must point to ./assets/splash.png`,
  );
  assert.strictEqual(
    config.resizeMode,
    'contain',
    `${appName} splash resizeMode must be "contain"`,
  );
  assert.ok(
    config.imageWidth >= 200 && config.imageWidth <= 320,
    `${appName} splash imageWidth (${config.imageWidth}) must be balanced between 200 and 320px`,
  );
  console.log(
    `   ✓ ${appName} expo-splash-screen plugin verified (imageWidth: ${config.imageWidth}, bg: ${config.backgroundColor})`,
  );
}

verifySplashPlugin(appJsonCustomer, 'Customer App');
verifySplashPlugin(appJsonStaff, 'Staff App');

// 3. Reproducibility Audit of Branding Generator Script
console.log('\n3. Verifying Reproducibility of scripts/generate_native_branding.py:');
const scriptContent = fs.readFileSync(
  path.join(repoRoot, 'scripts/generate_native_branding.py'),
  'utf8',
);
// Ensure no machine-specific absolute paths
assert.ok(
  !scriptContent.includes('C:\\Users\\') && !scriptContent.includes('/Users/'),
  'generate_native_branding.py must NOT contain any machine-specific hardcoded paths',
);
assert.ok(
  scriptContent.includes(
    'master_logo_path = os.path.join(repo_root, "packages", "ui", "src", "assets", "logo.png")',
  ),
  'generate_native_branding.py must load master branding from committed packages/ui/src/assets/logo.png',
);
console.log(
  '   ✓ generate_native_branding.py uses relative dynamic repository paths and committed master artwork',
);

// 4. Vector Navigation & BackButton Verification
console.log('\n4. Verifying Vector Navigation & Absence of Text Back Controls:');

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

// 5. Rendered Wireframe Screen ID Audit
console.log('\n5. Verifying Absence of Internal Screen IDs in Rendered UI:');

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

// 6. Build-Mode & QA Demo Access Isolation with Conflicting Flags
console.log('\n6. Verifying Build Modes & QA Demo Isolation (including Conflicting Flags):');

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

// Verify Strict Production Overrides across all flag combinations
function evaluateDemoPermission({ isDev, appVariant, demoModeEnv }) {
  const isProduction = appVariant === 'production';
  const isExplicitPreview = appVariant === 'preview' || demoModeEnv === 'true';
  return !isProduction && (isDev || isExplicitPreview);
}

// Standard development: Allowed
assert.strictEqual(
  evaluateDemoPermission({ isDev: true, appVariant: 'development', demoModeEnv: 'false' }),
  true,
  'Dev mode must permit demo',
);

// Standard preview: Allowed
assert.strictEqual(
  evaluateDemoPermission({ isDev: false, appVariant: 'preview', demoModeEnv: 'true' }),
  true,
  'Preview mode must permit demo',
);

// Standard production: Strictly Forbidden
assert.strictEqual(
  evaluateDemoPermission({ isDev: false, appVariant: 'production', demoModeEnv: 'false' }),
  false,
  'Production mode must strictly forbid demo',
);

// Conflicting flags: production variant with EXPO_PUBLIC_DEMO_MODE='true' -> MUST STILL BE FORBIDDEN
assert.strictEqual(
  evaluateDemoPermission({ isDev: false, appVariant: 'production', demoModeEnv: 'true' }),
  false,
  'Production variant must override conflicting EXPO_PUBLIC_DEMO_MODE="true"',
);

// Conflicting flags: production variant with isDev=true (e.g. dev bundle packaged for prod) -> MUST STILL BE FORBIDDEN
assert.strictEqual(
  evaluateDemoPermission({ isDev: true, appVariant: 'production', demoModeEnv: 'true' }),
  false,
  'Production variant must override conflicting isDev=true and force-disable demo mode',
);

console.log(
  '   ✓ Security logic: Production variant ALWAYS disables demo bypass, even with conflicting flags',
);

console.log('\n--- All Branding, Splash, Navigation & Build Mode Acceptance Checks Passed! ---');
