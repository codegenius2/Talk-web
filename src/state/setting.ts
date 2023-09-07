import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {zustandStorage} from "../persist/zustant-db.tsx";
import {ClientAbility, defaultAbility} from "../data-structure/ability/client-ability.tsx";

export type Setting = {
    ability: ClientAbility,
    setAbility: (ab: ClientAbility) => void
    getAbility: () => ClientAbility
}

export const useSettingStore = create<Setting>()(
    immer(persist(devtools((set, get) => ({

        ability: defaultAbility(),
        getAbility: () => get().ability,
        setAbility: (ab: ClientAbility) => set(
            (state) => {
                state.ability = ab
            }),
    })), {
        name: 'setting',
        storage: createJSONStorage<string>(() => zustandStorage,), // (optional) by default the 'localStorage' is used
    }))
)