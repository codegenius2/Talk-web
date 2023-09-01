import {create} from "zustand";
import {Answer, Audio, Trans} from "../api/sse/event.ts";

interface Events {
    answers: Answer[]
    pushAnswer: (e: Answer) => void
    popAnswer: () => Answer

    audios: Audio[]
    pushAudio: (e: Audio) => void
    popAudio: () => Audio

    trans: Trans[]
    pushTrans: (e: Trans) => void
    popTrans: () => Trans
}

export const useEvensStore = create<Events>()((set, get) => ({
    answers: [],
    pushAnswer: (e: Answer) => set((state) => ({
        ...state,
        answers: [...state.answers, e]
    })),
    popAnswer: () => {
        const [first, ...rest] = get().answers
        set((state) => ({...state, answers: rest}))
        return first
    },
    audios: [],
    pushAudio: (e: Audio) => set((state) => ({
        ...state,
        audios: [...state.audios, e]
    })),
    popAudio: () => {
        const [first, ...rest] = get().audios
        set((state) => ({...state, audios: rest}))
        return first
    },
    trans: [],
    pushTrans: (e: Trans) => set((state) => ({
        ...state,
        trans: [...state.trans, e]
    })),
    popTrans: () => {
        const [first, ...rest] = get().trans
        set((state) => ({...state, trans: rest}))
        return first
    },
}))