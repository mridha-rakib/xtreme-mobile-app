import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const expectations = { customer: 34, staff: 6 };

console.log('--- Validating XTREME Mobile Route & Profile Architecture ---');

for (const [app, expected] of Object.entries(expectations)) {
  const appDir = new URL(`../apps/${app}-mobile/`, import.meta.url);
  const routeDataUrl = new URL(`../packages/navigation/src/${app}.json`, import.meta.url);

  // 1. Validate route definition manifest
  assert.ok(existsSync(routeDataUrl), `Missing route manifest for ${app}`);
  const routes = JSON.parse(readFileSync(routeDataUrl, 'utf8'));

  assert.equal(routes.length, expected, `${app} route count mismatch`);
  assert.equal(new Set(routes.map((x) => x.id)).size, expected, `${app} screen IDs must be unique`);
  assert.equal(new Set(routes.map((x) => x.path)).size, expected, `${app} routes must be unique`);

  // 2. Validate route source file existence
  for (const r of routes) {
    const routeFile = new URL(`app${r.path}.tsx`, appDir);
    assert.ok(existsSync(routeFile), `Missing route file for ${r.id}: ${r.path}.tsx`);
  }
  console.log(
    `✓ ${app.toUpperCase()} APP: All ${routes.length}/${expected} screen routes verified`,
  );

  // 3. Validate app.json configuration
  const appJsonUrl = new URL('app.json', appDir);
  assert.ok(existsSync(appJsonUrl), `Missing app.json for ${app}`);
  const appConfig = JSON.parse(readFileSync(appJsonUrl, 'utf8')).expo;
  assert.ok(appConfig.name, `${app} missing expo.name`);
  assert.ok(appConfig.slug, `${app} missing expo.slug`);
  assert.ok(appConfig.scheme, `${app} missing expo.scheme`);
  assert.ok(appConfig.ios?.bundleIdentifier, `${app} missing ios.bundleIdentifier`);
  assert.ok(appConfig.android?.package, `${app} missing android.package`);
  console.log(
    `✓ ${app.toUpperCase()} CONFIG: app.json verified (ID: ${appConfig.ios.bundleIdentifier})`,
  );

  // 4. Validate EAS build configuration
  const easJsonUrl = new URL('eas.json', appDir);
  assert.ok(existsSync(easJsonUrl), `Missing eas.json for ${app}`);
  const easConfig = JSON.parse(readFileSync(easJsonUrl, 'utf8'));
  assert.ok(easConfig.build?.development, `${app} missing development profile in eas.json`);
  assert.ok(easConfig.build?.preview, `${app} missing preview profile in eas.json`);
  assert.ok(easConfig.build?.production, `${app} missing production profile in eas.json`);
  console.log(`✓ ${app.toUpperCase()} EAS: dev/preview/prod build profiles verified`);
}

console.log('--- All monorepo navigation & build requirements passed! ---');
