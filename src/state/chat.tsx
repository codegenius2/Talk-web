import {create} from 'zustand';
import {ClientAbility} from "../data-structure/ability/client-ability.tsx";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {zustandStorage} from "../persist/zustant-db.tsx";
import {immer} from 'zustand/middleware/immer'
import {isInHistory, Message} from "../data-structure/message.tsx";
import {Message as APIMessage} from "../api/restful.ts";
import {deleteBlobs} from "../persist/blob-db.tsx";
import {randomHash} from "../util/util.tsx";

export type Chat = {
    id: string
    name: string
    ms: Message[]
    ability: ClientAbility,
}

export type OnDup = 'update' | 'ignore' | 'throw'
export type OnMissing = 'push' | 'ignore' | 'throw'
export type LastUpdatedMessage = {
    chatIds: string[]
    messageIds: string[]
    hash: string
}
const dummyUpdate = (): LastUpdatedMessage => ({chatIds: [], messageIds: [], hash: ""})
const newUpdate = (chatIds: string[], messageIds: string[]): LastUpdatedMessage => ({
    chatIds: chatIds,
    messageIds: messageIds,
    hash: randomHash()
})

export type Chats = {
    cs: Record<string, Chat>
    currentChatId: string
    setCurrentChatId: (id: string) => void
    getCurrentChat: () => Chat | undefined
    getChat: (id: string) => Chat | undefined
    pushChat: (c: Chat) => void
    updateChat: (c: Chat) => void
    removeChat: (id: string) => void
    clearChats: () => void

    lastUpdate: LastUpdatedMessage // components can watch on this
    getMessage: (chatId: string, mId: string) => Message | undefined
    pushMessageOr: (chatId: string, m: Message, onDup: OnDup) => void
    replaceMessageOr: (chatId: string, mNew: Message, onMissing: OnMissing) => void
    removeMessage: (chatId: string, id: string) => void
    clearMessages: (chatId: string) => void // clear audio blob too

    getAbility: (id: string) => ClientAbility | undefined
    setAbility: (id: string, ab: ClientAbility) => void
}

export const useChatStore = create<Chats>()(
    immer(persist(devtools((set, get) => ({
            cs: {},
            currentChatId: "",
            setCurrentChatId: (id: string) => set(
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
                    state.lastUpdate = newUpdate([c.id], [])
                }),
            updateChat: (c: Chat) => set(
                (state) => {
                    state.cs[c.id] = c
                    state.lastUpdate = newUpdate([c.id], [])
                }),
            removeChat: (id: string) => set(
                (state) => {
                    delete state.cs[id]
                    state.lastUpdate = newUpdate([id], [])
                }),
            clearChats: () => set(
                (state) => {
                    state.lastUpdate = newUpdate(Object.keys(state.cs), [])
                    state.cs = {}
                }),

            lastUpdate: dummyUpdate(),
            getMessage: (chatId: string, mId: string) => get()
                .cs[chatId].ms.slice().reverse()
                .find(m => m.id === mId),
            pushMessageOr: (chatId: string, m: Message, onDup: OnDup) => set(
                (state) => {
                    const chat = state.cs[chatId]
                    if (chat === undefined) {
                        return
                    }
                    for (let i = chat.ms.length - 1; i >= 0; i--) {
                        const prev = chat.ms[i]
                        if (prev.id == m.id) {
                            switch (onDup) {
                                case "update":
                                    chat.ms[i] = m
                                    state.lastUpdate = newUpdate([chatId], [m.id])
                                    return;
                                case "ignore":
                                    return
                                case "throw":
                                    throw new Error("duplicated message, chatId,messageId:" + chat.id + "," + m.id)
                            }
                        }
                    }
                    chat.ms.push(m)
                    state.lastUpdate = newUpdate([chatId], [m.id])
                }),
            replaceMessageOr: (chatId: string, m: Message, onMissing: OnMissing) => set(
                (state) => {
                    const chat = state.cs[chatId]
                    if (chat === undefined) {
                        return
                    }
                    for (let i = chat.ms.length - 1; i >= 0; i--) {
                        const prev = chat.ms[i]
                        if (prev.id == m.id) {
                            chat.ms[i] = m
                            state.lastUpdate = newUpdate([chatId], [m.id])
                            return;
                        }
                    }
                    switch (onMissing) {
                        case "push":
                            chat.ms.push(m)
                            state.lastUpdate = newUpdate([chatId], [m.id])
                            break;
                        case "ignore":
                            return;
                        case "throw":
                            throw new Error("missing message, chatId,messageId:" + chat.id + "," + m.id)
                    }
                }),
            removeMessage:
                (chatId: string, messageId: string) => set(
                    (state) => {
                        state.cs[chatId].ms = state.cs[chatId].ms
                            .filter(m => m.id !== messageId)
                        state.lastUpdate = newUpdate([chatId], [messageId])
                    }),
            clearMessages:
                (chatId: string) => set(
                    (state) => {
                        if (state.cs[chatId]) {
                            state.lastUpdate = newUpdate([chatId], state.cs[chatId].ms.map(it => it.id))
                            const audioIds = state.cs[chatId].ms
                                .filter(m => m.audio !== undefined)
                                .map(m => m.audio!.id)
                            state.cs[chatId].ms = []
                            // noinspection JSIgnoredPromiseFromCall
                            deleteBlobs(audioIds)
                        }
                    }),
            getAbility:
                (id: string) => get().cs[id]?.ability,
            setAbility:
                (id: string, ab: ClientAbility) => set(
                    (state) => {
                        state.cs[id].ability = ab
                    }),


        })),
        {
            name: 'chats',
            storage:
                createJSONStorage<string>(() => zustandStorage,), // (optional) by default the 'localStorage' is used
        }
    ))
)


export const historyMessages = (chat: Chat, maxHistory: number): APIMessage[] => {
    if (maxHistory <= 0) {
        return []
    }
    const messages: APIMessage[] = []
    for (let i = chat.ms.length - 1; i >= 0; i--) {
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