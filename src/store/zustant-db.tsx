import {get, set, del} from 'idb-keyval'
import {StateStorage} from "zustand/middleware"; // can use anything: IndexedDB, Ionic Storage, etc.

// Custom storage object
export const zustandStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        console.log("[Persist] retrieving", name)
        return (await get(name)) || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
        console.log("[Persist]", 'saving value(truncated to 100)', value.slice(0, 100), 'to', name)
        await set(name, value)
    },
    removeItem: async (name: string): Promise<void> => {
        console.log("[Persist] deleting ", name)
        await del(name)
    },
}

