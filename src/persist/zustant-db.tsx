import {get, set, del, clear} from 'idb-keyval'
import {StateStorage} from "zustand/middleware"; // can use anything: IndexedDB, Ionic Storage, etc.

type Clearable ={
    clear:()=>Promise<void>
}

// Custom storage object
export const zustandStorage: StateStorage&Clearable = {
    getItem: async (name: string): Promise<string | null> => {
        console.debug("[Persist] retrieving", name)
        return (await get(name)) || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
        console.debug("[Persist]", 'saving value(truncated to 100)', value.slice(0, 100), 'to', name)
        await set(name, value)
    },
    removeItem: async (name: string): Promise<void> => {
        console.debug("[Persist] deleting ", name)
        await del(name)
    },
    clear: async (): Promise<void> => {
        console.debug("[Persist] clearing")
        await clear()
    },
}

