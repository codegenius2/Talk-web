// import {create} from 'zustand';
//
// export type SendingMessage = {
//     chatId: string
//     text: string
//     // if message
//     audioBlob?: Blob
//     durationMs?: number
// }
//
// type SendingMessageStore = {
//     sendingMessages: SendingMessage[]
//     push: (sm: SendingMessage) => void,
//     pop: () => SendingMessage | undefined,
// }
//
// export const useSendingMessageStore = create<SendingMessageStore>(
//     (set, get) => ({
//         sendingMessages: [],
//         push: (sm: SendingMessage) => set((state) => ({
//             ...state,
//             sendingMessages: [...state.sendingMessages, sm]
//         })),
//         pop: () => {
//             const [first, ...rest] = get().sendingMessages
//             if (first !== undefined) {
//                 set((state) => ({...state, sendingMessages: rest}))
//             }
//             return first
//         },
//     })
// )
