import {create} from 'zustand';
import {Ability} from "../data-structure/ability/client-ability.tsx";
import {defaultAbility} from "../data-structure/ability/defauts.ts";

// todo preserved for session list
export const useGlobalAbilityStore = create<Ability>(() => ({...defaultAbility()}))
