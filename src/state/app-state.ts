import {proxy, snapshot, subscribe} from 'valtio'
import {appDb, appStateKey} from "./db.ts"
import {Message, onMarkDeleted} from "../data-structure/message.tsx"
import {ClientOption, defaultOption} from "../data-structure/client-option.tsx"
import {defaultServerAbility, ServerAbility} from "../api/sse/server-ability.ts"
import {generateHash} from "../util/util.tsx"
import {migrate} from "./migration.ts"
import * as packageJson from '../../package.json'

const currentVersion = packageJson.version

export type AuthState = {
    passwordHash: string,
    loggedIn: boolean,
}

export type Chat = {
    id: string
    name: string
    messages: Message[]
    option: ClientOption,
    inputText: string
}

export type PanelSelection = 'chats' | 'global' | 'current'
export type Wallpaper = {
    index: number,
    previewIndex?: number
}
export type UserPreference = {
    butterflyOnHistoryMessage: boolean
    wallpaper: Wallpaper
}

export interface AppState {
    version: string
    auth: AuthState
    ability: ServerAbility,
    option: ClientOption,
    chats: Chat[],
    currentChatId: string
    panelSelection: PanelSelection
    pref: UserPreference
}

export const hydrationState = proxy({
    hydrated: false
})

export const persistState = proxy({
    changedAt: Date.now(),
})

export const appState = proxy<AppState>({
    version: packageJson.version,
    auth: {
        passwordHash: "",
        loggedIn: false,
    },
    ability: defaultServerAbility(),
    option: defaultOption(),
    chats: [],
    currentChatId: "",
    panelSelection: "chats",
    pref: {
        butterflyOnHistoryMessage: true,
        wallpaper: {
            index: 0,
        }
    }
})

const defaultAppState = (): AppState => ({
    version: currentVersion,
    auth: {
        passwordHash: "",
        loggedIn: false,
    },
    ability: defaultServerAbility(),
    option: defaultOption(),
    chats: [],
    currentChatId: "",
    panelSelection: "chats",
    pref: {
        butterflyOnHistoryMessage: true,
        wallpaper: {
            index: 0,
        }
    }
})

export const resetAppState = () => {
    const dft = defaultAppState()
    Object.keys(appState).forEach((key) => {
        console.debug("resetting appState, key:", key)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        appState[key as keyof AppState] = dft[key]
    })
}

appDb.getItem<AppState>(appStateKey).then((as: AppState | null) => {
    console.debug("restoring from db:", as)

    if (as !== null) {
        const dft = defaultAppState()
        Object.keys(appState).forEach((key) => {
            console.debug("restoring from db, key:", key)
            const error = migrate(as)
            if (error) {
                throw error
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            appState[key as keyof AppState] = as[key] ?? dft[key]
        })
    }
    console.debug("restored")
    hydrationState.hydrated = true
})


subscribe(appState, () => {
    persistState.changedAt = Date.now()
})

setInterval(() => {
    if (Date.now() - persistState.changedAt < 500 && hydrationState.hydrated) {
        const as = snapshot(appState)
        // console.debug("saving appState:", as)
        appDb.setItem(appStateKey, as).then(() => {
            console.debug("appState saved")
        })
    }
}, 500)


export const clearSettings = () => {
    const dft = defaultAppState()
    appState.auth = dft.auth
    appState.ability = dft.ability
    appState.option = dft.option
    appState.panelSelection = dft.panelSelection
}

export const clearChats = () => {
    const dft = defaultAppState()
    appState.chats = dft.chats
    appState.currentChatId = dft.currentChatId
}

export const findChatProxy = (chatId: string, warning?: boolean): [Chat, number] | undefined => {
    for (let i = appState.chats.length - 1; i >= 0; i--) {
        const chat = appState.chats[i]
        if (chat.id === chatId) {
            return [chat, i]
        }
    }
    if (warning) {
        console.warn("received an event from server, but can't find a chat to deal with, " +
            "this usually happens when a chat has been deleted, or this would be fatal err that requires " +
            "developers to re-check the code. chatId:", chatId)
    }
    return undefined
}

export const findMessage = (chatProxy: Chat, messageId: string, warning?: boolean): Message | undefined => {
    const found = chatProxy.messages.find(m => m.id === messageId)
    if (!found && warning) {
        console.warn("received an event from server, but can't find a message to deal with, " +
            "this usually happens when a message has been deleted, or this would be fatal err that requires " +
            "developers to re-check the code. chatId,messageId:", chatProxy.id, messageId)
    }
    return found
}

export const findMessage2 = (chatId: string, messageId: string, warning?: boolean): Message | undefined => {
    const found = findChatProxy(chatId, warning)
    if (found) {
        return findMessage(found[0], messageId, warning)
    }
    return
}

export const dragChat = (draggingIndex: number, hoveringIndex: number) => {
    if (draggingIndex === hoveringIndex) {
        return
    }
    const chats = appState.chats
    if (draggingIndex < hoveringIndex) {
        const chat = appState.chats[draggingIndex]
        for (let i = draggingIndex; i < hoveringIndex; i++) {
            chats[i] = chats[i + 1]
        }
        chats[hoveringIndex] = chat
    } else {
        const chat = appState.chats[draggingIndex]
        for (let i = draggingIndex; i > hoveringIndex; i--) {
            chats[i] = chats[i - 1]
        }
        chats[hoveringIndex] = chat
    }
}

export const currentChatProxy = (): Chat | undefined => {
    if (appState.currentChatId === "") {
        return undefined
    }
    for (let i = appState.chats.length - 1; i >= 0; i--) {
        const chat = appState.chats[i]
        if (chat.id === appState.currentChatId) {
            return chat
        }
    }
    return undefined
}

export const currentChatSnap = (): Chat | undefined => {
    if (appState.currentChatId === "") {
        return undefined
    }
    for (let i = appState.chats.length - 1; i >= 0; i--) {
        const chat = appState.chats[i]
        if (chat.id === appState.currentChatId) {
            return snapshot(chat) as Chat
        }
    }
    return undefined
}

const removeChatByIndex = (index: number) => {
    appState.chats.splice(index, 1)
}

const removeChatById = (chatId: string) => {
    for (let i = appState.chats.length - 1; i >= 0; i--) {
        const chat = appState.chats[i]
        if (chat.id === chatId) {
            appState.chats.splice(i, 1)
            return
        }
    }
}

// The decision to not delete a message directly is based on the potential disruption caused by ongoing updates.
// If a message is continuously being updated, deleting it would result in the inability to locate the message,
// potentially leading to the creation of a new message and causing disorder.
// Messages will be completely deleted as user `Clear Messages` or deletes a chat
export const markMessageAsDeleted = (chatId: string, messageId: string): void => {
    const chat = findChatProxy(chatId)?.[0]
    if (!chat) {
        console.error("failed to mark the message as deleted, because the chat is gone. this usually happens when the" +
            " chat is deleted. chatId,messageId:", chatId, messageId)
        return
    }
    // Iterating from the end to the start. Users are more likely to interact with the latest messages.
    for (let i = chat.messages.length - 1; i >= 0; i--) {
        const message = chat.messages[i]
        if (message.id === messageId) {
            onMarkDeleted(message)
        }
    }
}

// password hash will be embedded within the header of subsequent requests
export const savePassAsHash = (password: string) => {
    appState.auth.passwordHash = generateHash(password)
}

export const setLoggedIn = (loggedIn: boolean) => {
    appState.auth.loggedIn = loggedIn
}

export const deleteChat = (id: string) => {
    const chats = appState.chats
    const currentChatId = appState.currentChatId

    if (currentChatId === "" || id != currentChatId) {
        // if there is no chat selected or user are deleting a chat other than current chat
        removeChatById(id)
    } else {
        const index = findChatProxy(currentChatId)?.[1]
        if (index === undefined) {
            // currentChatId is actually invalid, reset it
            appState.currentChatId = ""
        } else {
            // if user delete current chat
            if (chats.length === 0) {
                // chats are empty
                appState.currentChatId = ""
            } else if (chats.length === 1) {
                // current chat is the only chat in list
                removeChatByIndex(index)
                appState.currentChatId = ""
            } else {
                // in this branch, currentChatId is ensured to be in the chat list and chat list size is >= 2

                // 1. select the chat behind current chat if this chat is not at the tail
                // 2. select the chat in front of current chat if this chat is at the tail
                const newChatIndex = (index === chats.length - 1) ? index - 1 : index + 1
                const newChat = chats[newChatIndex]
                removeChatByIndex(index)
                appState.currentChatId = newChat.id
            }
        }
    }
}
