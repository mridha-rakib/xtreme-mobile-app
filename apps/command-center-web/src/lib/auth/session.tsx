'use client';

import {
  authenticateCommandCenter,
  getCommandCenterUserByRole,
  resetCommandCenterState,
  sampleCommandCenterUsers,
} from '@xtreme/mock-data';
import type React from 'react';
import { createContext, useContext, useState } from 'react';
import type { CommandCenterRole, CommandCenterSession, CommandCenterUser } from '@/types';

interface SessionContextType extends CommandCenterSession {
  loginAsRole: (role: CommandCenterRole) => void;
  loginWithCredentials: (email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  resetState: () => void;
  switchPersona: (role: CommandCenterRole) => void;
}

const isProduction =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_ENV === 'production';
const demoBypassEnabled = !isProduction && process.env.NEXT_PUBLIC_ENABLE_DEMO_BYPASS !== 'false';

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function CommandCenterSessionProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CommandCenterUser | null>(() => {
    if (demoBypassEnabled) {
      return getCommandCenterUserByRole('SUPER_ADMIN') || sampleCommandCenterUsers[0];
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const loginAsRole = (role: CommandCenterRole) => {
    if (!demoBypassEnabled) return;
    const user = getCommandCenterUserByRole(role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const loginWithCredentials = (email: string, password?: string) => {
    setIsLoading(true);
    const result = authenticateCommandCenter(email, password);
    setIsLoading(false);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error || 'Authentication failed' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const resetState = () => {
    resetCommandCenterState();
    if (demoBypassEnabled) {
      setCurrentUser(getCommandCenterUserByRole('SUPER_ADMIN') || sampleCommandCenterUsers[0]);
    } else {
      setCurrentUser(null);
    }
  };

  const switchPersona = (role: CommandCenterRole) => {
    loginAsRole(role);
  };

  return (
    <SessionContext.Provider
      value={{
        user: currentUser,
        isAuthenticated: !!currentUser,
        isDemoMode: demoBypassEnabled,
        isLoading,
        loginAsRole,
        loginWithCredentials,
        logout,
        resetState,
        switchPersona,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useCommandCenterSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useCommandCenterSession must be used within a CommandCenterSessionProvider');
  }
  return context;
}
