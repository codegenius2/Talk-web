import {create} from 'zustand';
import {generateHash} from "../util/util.tsx";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {zustandStorage} from "../persist/zustant-db.tsx"

type Auth = {
    passwordHash?: string
    setPassword: (password: string) => void
    getPasswordHash: () => string | undefined
    verified: boolean
    setVerified: (verified: boolean) => void
}

export const useAuthStore = create<Auth>()(
    devtools(
        persist((set, get) => ({
            passwordHash: undefined,
            verified: false,
            setPassword: (password: string) => set(() => ({
                passwordHash: generateHash(password)
            })),
            getPasswordHash: () => get().passwordHash,
            setVerified: (verified: boolean) => set(() => ({
                verified: verified
            })),
        }), {
            name: 'auth',
            storage: createJSONStorage<string>(() => zustandStorage), // (optional) by default the 'localStorage' is used
        })
    )
);
