
// src/redux/features/auth/types.ts
import type { UserProfile } from '@/services/membership';

export interface AuthState {
    user: UserProfile | null;
    token: string | null;
    tokenExpiry: number | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}