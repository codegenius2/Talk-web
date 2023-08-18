import {get, set, del} from 'idb-keyval'
import {StateStorage} from "zustand/middleware"; // can use anything: IndexedDB, Ionic Storage, etc.

// Custom storage object
export const zustandStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        console.log("[Persist]",name, 'has been retrieved')
        return (await get(name)) || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
        console.log("[Persist]",name, 'with value(truncated to 100)', value.slice(0, 100), 'has been saved')
        await set(name, value)
    },
    removeItem: async (name: string): Promise<void> => {
        console.log("[Persist]",name, 'has been deleted')
        await del(name)
    },
}

