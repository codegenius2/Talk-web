import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {zustandStorage} from "../persist/zustant-db.tsx";

type InputStore = {
    inputText: string
    setInputText: (text: string) => void
}
// store text in the input area into db
export const useInputStore = create<InputStore>()(
    devtools(
        persist((set) => (
                {
                    inputText: "",
                    setInputText: (text: string) => set({inputText: text})
                }),
            {
                name: 'inputText',
                storage: createJSONStorage<string>(() => zustandStorage), // (optional) by default the 'localStorage' is used
            })
    )
)

type SendingTextStore = {
    sendingTexts: string[]
    push: (e: string) => void,
    pop: () => string | undefined,
}

export const useSendingTextStore = create<SendingTextStore>(
    (set, get) => ({
        sendingTexts: [],
        push: (audio: string) => set((state) => ({
            ...state,
            sendingTexts: [...state.sendingTexts, audio]
        })),
        pop: () => {
            const [first, ...rest] = get().sendingTexts
            if (first !== undefined) {
                set((state) => ({...state, sendingAudios: rest}))
            }
            return first
        },
    })
)

export type SendingAudio = {
    blob: Blob
    // duration is in ms
    duration: number
}

type SendingAudioStore = {
    sendingAudios: SendingAudio[]
    push: (audio: SendingAudio) => void,
    pop: () => SendingAudio | undefined,

}

export const useSendingAudioStore = create<SendingAudioStore>(
    (set, get) => ({
        sendingAudios: [],
        push: (audio: SendingAudio) => set((state) => ({
            ...state,
            sendingAudios: [...state.sendingAudios, audio]
        })),
        pop: () => {
            const [first, ...rest] = get().sendingAudios
            if (first !== undefined) {
                set((state) => ({...state, sendingAudios: rest}))
            }
            return first
        },
    })
)
