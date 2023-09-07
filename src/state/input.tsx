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

export type SendingMessage = {
    chatId: string
    text: string
    // if message
    audioBlob?: Blob
    durationMs?: number
}

type SendingMessageStore = {
    sendingMessages: SendingMessage[]
    push: (sm: SendingMessage) => void,
    pop: () => SendingMessage | undefined,

}

export const useSendingMessageStore = create<SendingMessageStore>(
    (set, get) => ({
        sendingMessages: [],
        push: (sm: SendingMessage) => set((state) => ({
            ...state,
            sendingMessages: [...state.sendingMessages, sm]
        })),
        pop: () => {
            const [first, ...rest] = get().sendingMessages
            if (first !== undefined) {
                set((state) => ({...state, sendingMessages: rest}))
            }
            return first
        },
    })
)
