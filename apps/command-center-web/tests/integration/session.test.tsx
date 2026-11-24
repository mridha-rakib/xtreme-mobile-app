import { act, renderHook } from '@testing-library/react';
import { authenticateCommandCenter } from '@xtreme/mock-data';
import type React from 'react';
import { describe, expect, it } from 'vitest';
import { CommandCenterSessionProvider, useCommandCenterSession } from '@/lib/auth/session';

describe('Command Center Session & Mock Auth Provider', () => {
  it('initializes session with default Super Admin in demo mode', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CommandCenterSessionProvider>{children}</CommandCenterSessionProvider>
    );

    const { result } = renderHook(() => useCommandCenterSession(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.role).toBe('SUPER_ADMIN');
    expect(result.current.isDemoMode).toBe(true);
  });

  it('allows switching personas in demo mode', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CommandCenterSessionProvider>{children}</CommandCenterSessionProvider>
    );

    const { result } = renderHook(() => useCommandCenterSession(), { wrapper });

    act(() => {
      result.current.switchPersona('VENDOR');
    });

    expect(result.current.user?.role).toBe('VENDOR');
    expect(result.current.user?.vendorId).toBe('vnd-dakar-fleet-01');

    act(() => {
      result.current.switchPersona('CONCIERGE');
    });

    expect(result.current.user?.role).toBe('CONCIERGE');
  });

  it('allows logging out and clearing session', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CommandCenterSessionProvider>{children}</CommandCenterSessionProvider>
    );

    const { result } = renderHook(() => useCommandCenterSession(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('authenticates valid operational credentials and rejects invalid ones', () => {
    const validResult = authenticateCommandCenter('superadmin@xtreme.sn');
    expect(validResult.success).toBe(true);
    expect(validResult.user?.role).toBe('SUPER_ADMIN');

    const invalidResult = authenticateCommandCenter('unauthorized@gmail.com');
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error).toContain('Invalid credentials or wrong role');
  });
});
