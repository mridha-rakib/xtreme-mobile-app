import {
  getAllBookings,
  getAllCommandCenterUsers,
  getAllConciergeRequests,
  getAllStaffAssignments,
  getAllTrips,
  getCommandCenterKpis,
  getCommandCenterUserByRole,
  resetCommandCenterState,
  subscribeCommandCenter,
} from '@xtreme/mock-data';
import type { CommandCenterRole } from '@/types';

export interface MockQueryOptions {
  latencyMs?: number;
  shouldFail?: boolean;
  errorMessage?: string;
}

export async function simulateAsyncQuery<T>(
  dataFn: () => T,
  options: MockQueryOptions = {},
): Promise<T> {
  const latency = options.latencyMs ?? Number(process.env.NEXT_PUBLIC_MOCK_API_LATENCY ?? 0);

  if (latency > 0) {
    await new Promise((resolve) => setTimeout(resolve, latency));
  }

  if (options.shouldFail) {
    throw new Error(options.errorMessage || 'Simulated query failure');
  }

  return dataFn();
}

export const mockRepository = {
  getUsers: () => getAllCommandCenterUsers(),
  getUserByRole: (role: CommandCenterRole) => getCommandCenterUserByRole(role),
  getKpis: (role: CommandCenterRole, vendorId?: string) => getCommandCenterKpis(role, vendorId),
  getBookings: () => getAllBookings(),
  getAssignments: () => getAllStaffAssignments(),
  getConciergeRequests: () => getAllConciergeRequests(),
  getTrips: () => getAllTrips(),
  reset: () => resetCommandCenterState(),
  subscribe: (cb: () => void) => subscribeCommandCenter(cb),
};
