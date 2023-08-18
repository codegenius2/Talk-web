import {create} from 'zustand';
import {Conversation, QueAns} from "../ds/Conversation.tsx";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {zustandStorage} from "../store/ZustandDB.tsx";

export const useConvStore = create<Conversation>()(
    devtools(
        persist((set) => ({
            qaSlice: [],
            pushQueAns: (queAns: QueAns) => set((state) => ({qaSlice: [...state.qaSlice, queAns]})),
            removeQueAns: (queAns: QueAns) =>
                set((state) => ({
                    qaSlice: state.qaSlice.filter((qa) => qa.id !== queAns.id),
                })),
            replaceQueAns: (queAns: QueAns) =>
                set((state) => ({
                    qaSlice: state.qaSlice.map((qa) => qa.id === queAns.id ? queAns : qa),
                })),
        }), {
            name: 'conversation',
            storage: createJSONStorage<string>(() => zustandStorage), // (optional) by default the 'localStorage' is used
        })
    )
);
