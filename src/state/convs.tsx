import {create} from 'zustand';
import {ClientAbility} from "../data-structure/ability/client-ability.tsx";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {zustandStorage} from "../persist/zustant-db.tsx";
import {immer} from 'zustand/middleware/immer'
import {isInHistory, Message} from "../data-structure/message.tsx";
import {Message as APIMessage} from "../api/restful.ts";
import {deleteBlobs} from "../persist/blob-db.tsx";

export type Chat = {
    id: string
    name: string
    ms: Message[]
    ability: ClientAbility,
}

export type Chats = {
    cs: Record<string, Chat>
    currentChatId?: string
    setCurrentChatId: (id: string) => void
    getCurrentChat: () => Chat | undefined
    getChat: (id: string) => Chat | undefined
    pushChat: (c: Chat) => void
    updateChat: (c: Chat) => void
    removeChat: (id: string) => void
    clearChats: () => void

    getMessage: (chatId: string, mId: string) => Message | undefined
    pushMessage: (chatId: string, m: Message) => void
    updateMessage: (chatId: string, mNew: Message) => void
    removeMessage: (chatId: string, id: string) => void
    clearMessages: (chatId: string) => void

    getAbility: (id: string) => ClientAbility | undefined
    setAbility: (id: string, ab: ClientAbility) => void
}

export const useChatStore = create<Chats>()(
    immer(persist(devtools((set, get) => ({
        cs: {},
        currentChatId: undefined,
        setCurrentChatId: (id: string | undefined) => set(
            (state) => {
                state.currentChatId = id
            }),
        getCurrentChat: () => {
            const state = get()
            const id = state.currentChatId
            return id === undefined ? undefined : state.cs[id]
        },
        getChat: (id: string) => get().cs[id],
        pushChat: (c: Chat) => set(
            (state) => {
                state.cs[c.id] = c
            }),
        updateChat: (c: Chat) => set(
            (state) => {
                state.cs[c.id] = c
            }),
        removeChat: (id: string) => set(
            (state) => {
                delete state.cs[id]
            }),
        clearChats: () => set(
            (state) => {
                state.cs = {}
            }),

        getMessage: (chatId: string, mId: string) => get()
            .cs[chatId].ms.slice().reverse()
            .filter(m => m.id === mId)?.[0],
        pushMessage: (chatId: string, m: Message) => set(
            (state) => {
                state.cs[chatId].ms.push(m)
            }),
        updateMessage: (chatId: string, mNew: Message) => set(
            (state) => {
                state.cs[chatId].ms = state.cs[chatId].ms
                    .map(m => m.id === mNew.id ? m : mNew)
            }),
        removeMessage: (chatId: string, id: string) => set(
            (state) => {
                state.cs[chatId].ms = state.cs[chatId].ms
                    .filter(m => m.id !== id)
            }),
        clearMessages: (chatId: string) => set(
            (state) => {
                if (state.cs[chatId]) {
                    const audioIds = state.cs[chatId].ms
                        .filter(m => m.audio !== undefined)
                        .map(m => m.audio!.id)
                    state.cs[chatId].ms = []
                    // noinspection JSIgnoredPromiseFromCall
                    deleteBlobs(audioIds)
                }
            }),
        getAbility: (id: string) => get().cs[id]?.ability,
        setAbility: (id: string, ab: ClientAbility) => set(
            (state) => {
                state.cs[id].ability = ab
            }),


    })), {
        name: 'chats',
        storage: createJSONStorage<string>(() => zustandStorage,), // (optional) by default the 'localStorage' is used
    }))
)

export const historyMessages = (chat: Chat, maxHistory: number): APIMessage[] => {
    if (maxHistory <= 0) {
        return []
    }
    const messages: APIMessage[] = []
    for (let i = chat.ms.length; i >= 0; i--) {
        if (messages.length === maxHistory) {
            break
        }
        const m = chat.ms[i]
        if (isInHistory(m)) {
            messages.push({role: m.role, content: m.text})
        }
    }
    return messages.reverse()
}