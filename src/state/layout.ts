import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {zustandStorage} from "../persist/zustant-db.tsx";

export type PanelType = 'chats' | 'global' | 'current'

export type Layout = {
    panel: PanelType
    setPanel: (panel: PanelType) => void
}

export const useLayoutStore = create<Layout>()(
    immer(persist(devtools((set) => ({
        panel: 'chats',
        setPanel: (panel: PanelType) => set(
            (state) => {
                state.panel = panel
            }),
    })), {
        name: 'layout',
        storage: createJSONStorage<string>(() => zustandStorage,), // (optional) by default the 'localStorage' is used
    }))
)