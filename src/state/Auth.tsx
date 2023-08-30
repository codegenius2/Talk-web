import {create} from 'zustand';
import {generateHash} from "../util/Util.tsx";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {zustandStorage} from "../store/ZustandDB.tsx";

type Auth = {
    passwordHash?: string
    setPassword: (password: string) => void
    verified: boolean
    setVerified: (verified: boolean) => void
}

export const useAuthStore = create<Auth>()(
    devtools(
        persist((set) => ({
            passwordHash: undefined,
            verified: false,
            setPassword: (password: string) => set(() => ({
                passwordHash: generateHash(password)
            })),
            setVerified: (verified: boolean) => set(() => ({
                verified: verified
            })),
        }), {
            name: 'auth',
            storage: createJSONStorage<string>(() => zustandStorage), // (optional) by default the 'localStorage' is used
        })
    )
);
