import { atom } from 'jotai';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

// Direct session atom (you update this from useSession)
export const sessionAtom = atom<Session | null>(null);

// Derived atoms
export const userIdAtom = atom((get) => get(sessionAtom)?.user?.id ?? null);
export const usernameAtom = atom((get) => get(sessionAtom)?.user?.username ?? null);

// Write-only atom to set session
export const loginAtom = atom(null, (_get, set, session: Session) => {
    set(sessionAtom, session);
});

// Write-only atom to clear session (on signOut)
export const logoutAtom = atom(null, (_get, set) => {
    signOut({ callbackUrl: "/" });
});