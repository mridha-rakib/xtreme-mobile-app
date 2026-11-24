# XTREME Concierge MVP — Staff Mobile 6-Screen Acceptance & Audit Matrix

**Repository:** `https://github.com/mridha-rakib/xtreme-mobile-app`  
**Authoritative Figma File:** `aiQY8SMEt3PTWfZn7js7l1` (XTREME Concierge MVP —
UI/UX Design & Copy)  
**Phase:** Phase 3.1: Staff Mobile Complete Implementation  
**Target Coverage:** Exactly 6 Staff Mobile Screens (100% Implemented &
Figma-Verified)  
**Audit Date:** November 24, 2026

---

## 1. Executive Summary

This document presents the formal acceptance and audit matrix for the complete
**Staff Mobile** application of the XTREME Concierge MVP.

All six (6) approved Staff Mobile screens (`STF-AUTH-01` through `STF-ASG-05`)
have been fully implemented in React Native + Expo Router + TypeScript, matching
the authoritative Figma frame designs (`04_Staff_App` section of
`aiQY8SMEt3PTWfZn7js7l1`). Each screen utilizes authentic brand marks, exact
color tokens (`#164D53` deep emerald teal, `#1A2530` charcoal body, `#FAF8F4`
warm cream background, `#EAE5DB` container borders, `#E85D45` operational alert
red, `#2E7D32` completed green), compliant typography, responsive auto-layout
geometry, and complete operational state management.

### Honest Acceptance Disclaimers

1. **Physical Device Runtime Evidence:** All six screens have been executed and
   verified on a physical Android device (**Realme RMX3930**, Android 15). Both
   authoritative Figma exported frames and live physical device screenshots are
   committed directly in `docs/audit/staff/` (`figma_*.png` and `device_*.png`).
2. **iOS Runtime Status:** Static TypeScript typechecking, layout bounds, and
   React Native platform abstractions are 100% clean and cross-platform safe.
   However, physical iOS hardware runtime verification is pending Apple
   TestFlight provisioning and distribution.
3. **Operational State Isolation:** Staff operational status transitions
   (`ASSIGNED` → `ACCEPTED` → `EN_ROUTE` → `ARRIVED` → `IN_PROGRESS` →
   `COMPLETED` / `UNABLE_TO_COMPLETE`) and issue reports are maintained in a
   dedicated reactive staff operational store (`@xtreme/mock-data`). Operational
   status changes strictly never mutate customer financial state
   (`BookingRecord.paymentStatus`).
4. **Mock Backend Boundary:** All state transitions, issue logging, and persona
   switching operate entirely client-side with realistic mock fixtures and
   reactive listeners without external server dependencies.

---

## 2. Complete Staff 6-Screen Audit Matrix

| ID              | Screen Title                    | Route Path                   | Figma Node ID & Frame Name                                       | Component Source File                                 | Verification Level                     | Fidelity & Implementation Notes                                                                                                                                                                                                                                                                     |
| :-------------- | :------------------------------ | :--------------------------- | :--------------------------------------------------------------- | :---------------------------------------------------- | :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **STF-AUTH-01** | Staff Sign In                   | `/auth/sign-in`              | `71:2`<br>`STF-AUTH-01__Sign_In__Ready`                          | `apps/staff-mobile/app/auth/sign-in.tsx`              | Approved (Committed Physical Evidence) | Staff operational logo badge (`STAFF OPERATIONS`), identifier & password inputs, operational notice callout, legal footer links, and unauthenticated demo access.                                                                                                                                   |
| **STF-ASG-01**  | Assignment Home                 | `/assignments`               | `71:23`<br>`STF-ASG-01__Assignment_Home__Ready`                  | `apps/staff-mobile/app/assignments.tsx`               | Approved (Committed Physical Evidence) | Segmented tab control (Today, Upcoming, History), responsive assignment cards with status badges (`ASSIGNED`, `ACCEPTED`, `EN_ROUTE`, `IN_PROGRESS`), chevron links, empty state, and 2-item staff bottom navigation.                                                                               |
| **STF-ASG-02**  | Assignment Detail               | `/assignments/detail`        | `71:71`<br>`STF-ASG-02__Assignment_Detail__Ready`                | `apps/staff-mobile/app/assignments/detail.tsx`        | Approved (Committed Physical Evidence) | Detailed cards for Service, Customer, Schedule, Location, Asset, and Flight. Action links for Navigate (maps), Call (`tel:`), and WhatsApp (`whatsapp:`). Primary CTAs for status update and issue reporting. Full `NotFoundCard` fallback for invalid IDs.                                         |
| **STF-ASG-03**  | Update Assignment Status        | `/assignments/update-status` | `71:113`<br>`STF-ASG-03__Update_Assignment_Status__Ready`        | `apps/staff-mobile/app/assignments/update-status.tsx` | Approved (Committed Physical Evidence) | Current status pill display, strict allowed-next-status modal dropdown, optional operational note input (2000-char limit), notice callout box, Confirm status mutation, and Cancel CTA.                                                                                                             |
| **STF-ASG-04**  | Operational Note / Report Issue | `/assignments/report-issue`  | `71:142`<br>`STF-ASG-04__Operational_Note_/_Report_Issue__Ready` | `apps/staff-mobile/app/assignments/report-issue.tsx`  | Approved (Committed Physical Evidence) | Selectors for Issue Context (Traffic, Customer, Mechanical, Weather, Security, Other), Visibility Scope (Operations Only vs Operations & Customer), Multiline Note textarea (required, 4000-char max), and Assignment Outcome (Continue, Delay, Unable to Complete). Submits to reactive issue log. |
| **STF-ASG-05**  | Assignment History              | `/assignments/history`       | `71:177`<br>`STF-ASG-05__Assignment_History__Ready`              | `apps/staff-mobile/app/assignments/history.tsx`       | Approved (Committed Physical Evidence) | Filtered historical records list showing `COMPLETED` and `UNABLE_TO_COMPLETE` assignments with date, time, and service title. Direct tap to inspect detail, "Back to Assignments" link, and bottom navigation.                                                                                      |

---

## 3. Screen-by-Screen Visual & Functional Evidence

### STF-AUTH-01: Staff Sign In

- **Route:** `/auth/sign-in`
- **Figma Reference:** `docs/audit/staff/figma_stf_auth_01.png` (Node `71:2`)
- **Real Device Screenshot:** `docs/audit/staff/device_stf_auth_01.png`
- **Visual Match:** Authentic XTREME Concierge brand mark with deep emerald
  `STAFF OPERATIONS` pill. Warm cream background (`#FAF8F4`), clean charcoal
  headings, bordered input fields with eye toggle for password visibility, and
  amber operational notice box.
- **Interactions:** Allows sign-in with staff credentials (`staff@xtreme.sn` /
  `driver@xtreme.sn`), auto-authenticating into the operational store. Full demo
  bypass and sign-out supported.

### STF-ASG-01: Assignment Home

- **Route:** `/assignments`
- **Figma Reference:** `docs/audit/staff/figma_stf_asg_01.png` (Node `71:23`)
- **Real Device Screenshot:** `docs/audit/staff/device_stf_asg_01.png`
- **Visual Match:** Header with XTREME Concierge logo and quick sign-out/QA
  access icon. 3-segment filter bar (Today / Upcoming / History) with bold
  active underline. Assignment cards styled with `#FAF8F4` fill, `#EAE5DB`
  border, and rounded corners (`12px`). Status badge pill displayed on the right
  with dot indicator (`ASSIGNED`, `ACCEPTED`, `EN_ROUTE`, `IN_PROGRESS`). Bottom
  bar with Assignments and History tabs.
- **Interactions:** Switching tabs dynamically filters assignments from the
  reactive store. Tapping any card navigates to
  `/assignments/detail?assignmentId=<id>`.

### STF-ASG-02: Assignment Detail

- **Route:** `/assignments/detail?assignmentId=<id>`
- **Figma Reference:** `docs/audit/staff/figma_stf_asg_02.png` (Node `71:71`)
- **Real Device Screenshot:** `docs/audit/staff/device_stf_asg_02.png`
- **Visual Match:** Back chevron, centered logo, and settings icon in header.
  Status badge pill prominently displayed below title. Structured info rows for
  Service, Customer, Schedule, Location, Asset, and Flight with crisp
  label/value alignment. Teal text links for Navigate, Call, and WhatsApp.
  High-contrast primary black CTA (`Update status`) and bordered secondary CTA
  (`Add note / report issue`).
- **Interactions:** External deep links (`geo:`, `tel:`, `whatsapp:`) open
  native device apps with fallback alerts. CTAs route to status update and
  report issue screens with preserved query parameters. If an invalid ID is
  provided, renders a clean `NotFoundCard` with a button to return to
  `/assignments`.

### STF-ASG-03: Update Assignment Status

- **Route:** `/assignments/update-status?assignmentId=<id>`
- **Figma Reference:** `docs/audit/staff/figma_stf_asg_03.png` (Node `71:113`)
- **Real Device Screenshot:** `docs/audit/staff/device_stf_asg_03.png`
- **Visual Match:** Clean form layout with "Current status" badge pill,
  interactive dropdown picker for "Allowed next status", optional note text
  input, beige callout with advisory text, and full-width Confirm / Cancel
  buttons.
- **Interactions:** Dropdown presents only legal forward transitions according
  to the state machine. Tapping "Confirm status" executes
  `updateStaffAssignmentStatus`, records an operational note if entered, updates
  all reactive views, and returns to Assignment Detail with success feedback.

### STF-ASG-04: Operational Note / Report Issue

- **Route:** `/assignments/report-issue?assignmentId=<id>`
- **Figma Reference:** `docs/audit/staff/figma_stf_asg_04.png` (Node `71:142`)
- **Real Device Screenshot:** `docs/audit/staff/device_stf_asg_04.png`
- **Visual Match:** 4-part operational report form matching Figma layout: Issue
  Context picker, Visibility Scope picker, Note textarea with placeholder,
  character counter (`max 4000 characters`), and Assignment Outcome picker.
- **Interactions:** Form validates that the note is non-empty before submission.
  Selecting `UNABLE_TO_COMPLETE` as outcome automatically transitions the
  assignment status to `UNABLE_TO_COMPLETE`. Submitting saves to
  `sampleStaffIssueReports` and alerts the user before navigating back.

### STF-ASG-05: Assignment History

- **Route:** `/assignments/history`
- **Figma Reference:** `docs/audit/staff/figma_stf_asg_05.png` (Node `71:177`)
- **Real Device Screenshot:** `docs/audit/staff/device_stf_asg_05.png`
- **Visual Match:** Lists completed and terminal assignments with green
  `COMPLETED` and red `UNABLE_TO_COMPLETE` status badges. Displays mission date,
  service title, and route summary. Features centered "Back to Assignments" link
  and active History tab in bottom navigation.
- **Interactions:** Tapping any card opens Assignment Detail for that historical
  record. "Back to Assignments" returns to `/assignments`.

---

## 4. State Machine & Operational Integrity Verification

The operational lifecycle is strictly defined by the following transition table:

| Initial Status       | Permitted Next Statuses                                    | Terminal? | Financial Impact on Customer? |
| :------------------- | :--------------------------------------------------------- | :-------- | :---------------------------- |
| `ASSIGNED`           | `ACCEPTED`, `UNABLE_TO_COMPLETE`                           | No        | None                          |
| `ACCEPTED`           | `EN_ROUTE`, `ARRIVED`, `IN_PROGRESS`, `UNABLE_TO_COMPLETE` | No        | None                          |
| `EN_ROUTE`           | `ARRIVED`, `IN_PROGRESS`, `UNABLE_TO_COMPLETE`             | No        | None                          |
| `ARRIVED`            | `IN_PROGRESS`, `UNABLE_TO_COMPLETE`                        | No        | None                          |
| `IN_PROGRESS`        | `COMPLETED`, `UNABLE_TO_COMPLETE`                          | No        | None                          |
| `COMPLETED`          | _(None)_                                                   | Yes       | None                          |
| `UNABLE_TO_COMPLETE` | _(None)_                                                   | Yes       | None                          |

### Verification Guarantees

1. **No Regressive Transitions:** Once an assignment reaches `COMPLETED` or
   `UNABLE_TO_COMPLETE`, no further status updates are permitted
   (`getAllowedNextAssignmentStatuses` returns `[]`).
2. **Strict Financial Separation:** Updating an assignment status or logging an
   operational note strictly mutates `StaffAssignment` and `StaffIssueReport`
   entities. It never alters customer payment statuses (`SUCCEEDED`, `HELD`,
   `PENDING_CARD_INPUT`).
3. **No Unauthenticated Blockers:** In development and QA preview modes, all 6
   routes are accessible directly with valid mock parameters without requiring
   manual authentication hurdles.
