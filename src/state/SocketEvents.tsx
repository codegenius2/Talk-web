import {InAudio, InMessage, InTranscription} from "../api/API.tsx";
import {create} from "zustand";

interface SocketEvents {
    inMessages: InMessage[]
    pushInMessage: (e: InMessage) => void
    popInMessage: () => InMessage

    inAudios: InAudio[]
    pushInAudio: (e: InAudio) => void
    popInAudio: () => InAudio

    inTranscriptions: InTranscription[]
    pushInTranscription: (e: InTranscription) => void
    popInTranscription: () => InTranscription
}

export const useSocketEvensStore = create<SocketEvents>()((set, get) => ({
    inMessages: [],
    pushInMessage: (e: InMessage) => set((state) => ({
        ...state,
        inMessages: [...state.inMessages, e]
    })),
    popInMessage: () => {
        const [first, ...rest] = get().inMessages
        set((state) => ({...state, inMessages: rest}))
        return first
    },
    inAudios: [],
    pushInAudio: (e: InAudio) => set((state) => ({
        ...state,
        inAudios: [...state.inAudios, e]
    })),
    popInAudio: () => {
        const [first, ...rest] = get().inAudios
        set((state) => ({...state, inAudios: rest}))
        return first
    },
    inTranscriptions: [],
    pushInTranscription: (e: InTranscription) => set((state) => ({
        ...state,
        inTranscriptions: [...state.inTranscriptions, e]
    })),
    popInTranscription: () => {
        const [first, ...rest] = get().inTranscriptions
        set((state) => ({...state, inTranscriptions: rest}))
        return first
    },
}))

// export const useInMessageStore = create<InMessage[]>(() => ([]))
// export const useInTranscriptionStore = create<InTranscription[]>(() => ([]))
// export const useInAudioStore = create<InAudio[]>(() => ([]))
