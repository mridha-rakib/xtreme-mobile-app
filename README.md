# XTREME Concierge MVP — Mobile Applications Monorepo

Frontend-only implementation of two independent mobile applications inside a
production-ready pnpm monorepo:

1. **XTREME Customer Mobile App** (`apps/customer-mobile`)
2. **XTREME Staff Mobile App** (`apps/staff-mobile`) — Dedicated to
   Chauffeurs/Drivers & On-site Operational Leads

---

## Monorepo Architecture

```text
xtreme-mobile/
├── apps/
│   ├── customer-mobile/       # 34 screens (Expo Router, EAS build profiles, bundle ID: com.xtremeconcierge.customer)
│   └── staff-mobile/          # 6 screens (Expo Router, EAS build profiles, bundle ID: com.xtremeconcierge.staff)
├── packages/
│   ├── design-tokens/         # Brand colors (including Atlantic #164D53), typography, spacing, radii, shadows, layout
│   ├── types/                 # Shared TypeScript domain contracts (Auth, Services, Bookings, Trips, Staff, etc.)
│   ├── mock-data/             # Realistic, privacy-safe Senegal demo data (Dakar, AIBD, Saly, Almadies, Gorée)
│   ├── navigation/            # Canonical screen manifests & routing metadata
│   └── ui/                    # Reusable React Native UI primitives (Button, Card, Badge, Header, TextField, NotFoundCard, ProtectedRoute)
├── scripts/
│   └── validate-routes.mjs    # Automated CI/CD script validating routes, app IDs, and EAS build profiles
├── .husky/                    # Git hooks (pre-commit with lint-staged, pre-push)
├── biome.json                 # Fast Biome linter, formatter, and import organizer configuration
├── pnpm-workspace.yaml        # pnpm monorepo workspace definition
├── package.json               # Root scripts, devDependencies, and lint-staged configuration
└── README.md
```

---

## Authority & Source References

- **Figma Design File**: `J7KHuyCO6uBh4BsKnUsGpG`
  - Node `1:5`: Mobile design target canvas
  - Node `1:4`: Mobile design target canvas
- **Functional Scope Authority**: Final SRS v1.1
- **Screen Inventory & Sitemap**: Role-Wise Screen Inventory v1.2, Mobile
  Sitemap v1.2, User Flows v1.2
- **Visual Foundation**: Visual Direction & Design System v1.0
  - Atlantic Deep Teal: `#164D53`
  - Ivory Warm Sand: `#FAF8F4`
  - Deep Obsidian: `#0B0C0E`
  - Champagne Gold: `#C6A15B`
  - Rich Terracotta: `#C85A32`
  - Subtle Warm Border: `#DDD8CF`
  - Slate Charcoal: `#5B616B`
  - Surface White: `#FFFFFF`

---

## Quick Start & Verification

### Prerequisites

- Node.js >= 22
- pnpm >= 10.15

### Commands

```bash
# 1. Install dependencies across all packages and apps
pnpm install

# 2. Run automated validation (Verifies all 40 screen routes, app.json IDs, and EAS build profiles)
pnpm test:routes

# 3. Code formatting & lint checks (Biome)
pnpm check

# 4. TypeScript compilation check (Strict mode across all packages and apps)
pnpm typecheck

# 5. Format markdown documentation
pnpm format:docs

# 6. Start Customer App independently
pnpm customer

# 7. Start Staff App independently
pnpm staff
```

---

## EAS Build Configuration

Both mobile applications are independently configured for Expo Application
Services (EAS) with:

- **Development Profile**: Local dev-client build with simulator / APK support
- **Preview Profile**: Internal QA and distribution build (`apk`)
- **Production Profile**: App Store / Play Store release profile with automatic
  version increments

---

## Safety, Privacy & Design Constraints

1. **Frontend-Only MVP Scaffolding**: No backend, production database, live
   Stripe billing, or actual auth integration.
2. **Approved Mobile Payment Model**: Under Final SRS v1.1, payment processing
   is exclusively Stripe Credit/Debit Card (simulated PaymentSheet action).
   Unsupported payment methods (Orange Money, Wave, wire transfer) are omitted.
3. **Independent Lifecycle States**: Payment transaction status (`SUCCEEDED`) is
   decoupled from authoritative booking operational status (`PENDING_VENDOR`).
4. **Resilient Parameter Handling**: All detail and action routes handle invalid
   or missing resource identifiers gracefully with `NotFoundCard` fallbacks.
5. **Dynamic Contract OTP**: Verification code length is non-hardcoded and
   adheres to `DEFAULT_OTP_CONFIG`.
6. **Realistic Fictional Demo Data**: All user records, telephone numbers, and
   addresses are fictional Senegal examples. Zero real customer personal data.
7. **Figma MCP Inspection Notice**: Direct automated node inspection via Figma
   MCP was blocked by the team tier rate limit (`429 / Starter plan limit`).
   Tokens are explicitly marked as specification-derived rather than
   Figma-verified.
8. **Platform Verification**: Real device execution verified on Android
   (`RMX3930`, Android 15). Physical iOS device and simulator runtime remains
   unverified due to Windows host limitations.
