import { Redirect } from 'expo-router';

/**
 * Concierge Index route -> Redirects to Concierge Requests list
 */
export default function ConciergeIndex() {
  return <Redirect href="/concierge/requests" />;
}
