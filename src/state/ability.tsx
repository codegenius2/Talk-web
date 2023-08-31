import {create} from 'zustand';
import {Ability} from "../ds/ability/client-ability.tsx";
import {defaultAbility} from "../ds/ability/defauts.ts";

// todo preserved for session list
export const useGlobalAbilityStore = create<Ability>(() => ({...defaultAbility()}))
