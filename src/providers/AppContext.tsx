'use strict';
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User, Organization } from '@/types';

interface AppContextProps {
  user: User | null;
  organizations: Organization[];
  currentOrg: Organization | null;
  setCurrentOrg: (org: Organization) => void;
  isLoading: boolean;
  isError: boolean;
  refetchOrgs: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentOrg, setCurrentOrgState] = useState<Organization | null>(null);

  // 1. Fetch current fake authenticated user
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: api.getMe,
  });

  // 2. Fetch organizations the user belongs to
  const {
    data: organizations = [],
    isLoading: isOrgsLoading,
    isError: isOrgsError,
    refetch: refetchOrgs,
  } = useQuery<Organization[]>({
    queryKey: ['userOrganizations', user?.id],
    queryFn: api.getOrganizations,
    enabled: !!user?.id,
  });

  // 3. Set default active organization once loaded
  useEffect(() => {
    if (organizations.length > 0 && !currentOrg) {
      // Find Vortex Labs by default, or just grab the first one
      const defaultOrg = organizations.find((o) => o.slug === 'vortex-labs') || organizations[0];
      setCurrentOrgState(defaultOrg);
    }
  }, [organizations, currentOrg]);

  const setCurrentOrg = (org: Organization) => {
    setCurrentOrgState(org);
    // Trigger window custom event for layout updates if needed
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orgChanged', { detail: org }));
    }
  };

  const isLoading = isUserLoading || isOrgsLoading;
  const isError = isUserError || isOrgsError;

  return (
    <AppContext.Provider
      value={{
        user: user || null,
        organizations,
        currentOrg,
        setCurrentOrg,
        isLoading,
        isError,
        refetchOrgs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
