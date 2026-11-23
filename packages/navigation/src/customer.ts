export const customerScreens = [
  {
    id: 'CUS-AUTH-01',
    title: 'Sign In',
    path: '/auth/sign-in',
  },
  {
    id: 'CUS-AUTH-02',
    title: 'Create Account',
    path: '/auth/register',
  },
  {
    id: 'CUS-AUTH-03',
    title: 'Phone OTP Verification',
    path: '/auth/verify-phone',
  },
  {
    id: 'CUS-AUTH-04',
    title: 'Forgot Password Method',
    path: '/auth/forgot-password',
  },
  {
    id: 'CUS-AUTH-05',
    title: 'Phone Password Reset Request',
    path: '/auth/reset-phone',
  },
  {
    id: 'CUS-AUTH-06',
    title: 'Phone Reset Confirmation',
    path: '/auth/reset-phone-confirm',
  },
  {
    id: 'CUS-AUTH-07',
    title: 'Email Password Reset Request',
    path: '/auth/reset-email',
  },
  {
    id: 'CUS-AUTH-08',
    title: 'Email Reset Confirmation',
    path: '/auth/reset-email-confirm',
  },
  {
    id: 'CUS-PRO-01',
    title: 'Profile',
    path: '/account/profile',
  },
  {
    id: 'CUS-PRO-02',
    title: 'Edit Profile',
    path: '/account/edit-profile',
  },
  {
    id: 'CUS-SUP-01',
    title: 'Support & Legal',
    path: '/support',
  },
  {
    id: 'CUS-LEG-01',
    title: 'Legal Document Viewer',
    path: '/legal/document',
  },
  {
    id: 'CUS-DISC-01',
    title: 'Home / Service Categories',
    path: '/discover',
  },
  {
    id: 'CUS-DISC-02',
    title: 'Services List',
    path: '/discover/services',
  },
  {
    id: 'CUS-DISC-03',
    title: 'Service Detail',
    path: '/discover/service-detail',
  },
  {
    id: 'CUS-DISC-04',
    title: 'Geography Selector',
    path: '/discover/location',
  },
  {
    id: 'CUS-BKG-01',
    title: 'Dynamic Booking Input',
    path: '/booking/input',
  },
  {
    id: 'CUS-BKG-02',
    title: 'Availability Selection',
    path: '/booking/availability',
  },
  {
    id: 'CUS-BKG-03',
    title: 'Booking Review',
    path: '/booking/review',
  },
  {
    id: 'CUS-BKG-04',
    title: 'Booking Submitted / Reference',
    path: '/booking/submitted',
  },
  {
    id: 'CUS-BKG-05',
    title: 'My Bookings',
    path: '/bookings',
  },
  {
    id: 'CUS-BKG-06',
    title: 'Booking Detail',
    path: '/bookings/detail',
  },
  {
    id: 'CUS-PAY-01',
    title: 'Payment Choice',
    path: '/payments/choice',
  },
  {
    id: 'CUS-PAY-02',
    title: 'Stripe Payment Action',
    path: '/payments/checkout-preview',
  },
  {
    id: 'CUS-PAY-03',
    title: 'Payment Detail / Status',
    path: '/payments/status',
  },
  {
    id: 'CUS-CHG-01',
    title: 'Request Booking Modification',
    path: '/bookings/request-change',
  },
  {
    id: 'CUS-CHG-02',
    title: 'Request Booking Cancellation',
    path: '/bookings/request-cancel',
  },
  {
    id: 'CUS-TRIP-01',
    title: 'My Trips',
    path: '/trips',
  },
  {
    id: 'CUS-TRIP-02',
    title: 'Trip Detail / Itinerary',
    path: '/trips/detail',
  },
  {
    id: 'CUS-CON-01',
    title: 'Plan My Entire Trip / Concierge Request',
    path: '/concierge/plan-trip',
  },
  {
    id: 'CUS-CON-02',
    title: 'Concierge Requests',
    path: '/concierge/requests',
  },
  {
    id: 'CUS-CON-03',
    title: 'Concierge Request Detail',
    path: '/concierge/request-detail',
  },
  {
    id: 'CUS-CON-04',
    title: 'Concierge Conversations',
    path: '/concierge/conversations',
  },
  {
    id: 'CUS-CON-05',
    title: 'Concierge Conversation Detail',
    path: '/concierge/conversation-detail',
  },
] as const;
