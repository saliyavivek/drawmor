import { TokenPayload } from '@/types/types';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { jwtDecode } from "jwt-decode";

const decodeToken = (token: string) => {
    try {
        const payload = jwtDecode<TokenPayload>(token);
        return {
            userId: payload.userId,
            username: payload.username,
        };
    } catch (error) {
        return null;
    }
};

// Base atoms
export const tokenAtom = atomWithStorage('authToken', null); // Jotai's atomWithStorage automatically handles localStorage persistence.

// Derived atoms
export const userAtom = atom((get) => {
    const token = get(tokenAtom);
    return token ? decodeToken(token) : null;
});

export const userIdAtom = atom((get) => {
    const user = get(userAtom);
    return user?.userId || null;
});

export const nameAtom = atom((get) => {
    const user = get(userAtom);
    return user?.username || null;
});

//Action atoms (Write-Only)
export const loginAtom = atom(null, (get, set, token: string) => {
    //@ts-ignore
    set(tokenAtom, token);
});

// Logout atom (Write-only)
export const logoutAtom = atom(null, (_get, set) => {
    set(tokenAtom, null); // This clears it from atom + localStorage
});
