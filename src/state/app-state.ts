import {proxy, snapshot, subscribe} from 'valtio'
import {appDb, appStateKey} from "./db.ts";
import {Message, onMarkDeleted} from "../data-structure/message.tsx";
import {ClientOption, defaultOption} from "../data-structure/client-option.tsx";
import {defaultServerAbility, ServerAbility} from "../api/sse/server-ability.ts";

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

export interface AppState {
    auth: AuthState
    ability: ServerAbility,
    option: ClientOption,
    chats: Record<string, Chat>
    currentChatId: string
    panelSelection: PanelSelection
}

export const hydrationState = proxy({
    hydrated: false
})

export const appState = proxy<AppState>({
    auth: {
        passwordHash: "",
        loggedIn: false,
    },
    ability: defaultServerAbility(),
    option: defaultOption(),
    chats: {},
    currentChatId: "",
    panelSelection: "chats"
})

const defaultAppState = (): AppState => ({
    auth: {
        passwordHash: "",
        loggedIn: false,
    },
    ability: defaultServerAbility(),
    option: defaultOption(),
    chats: {},
    currentChatId: "",
    panelSelection: "chats"
})

export const resetAppState = () => {
    const dft = defaultAppState()
    appState.auth = dft.auth
    appState.ability = dft.ability
    appState.option = dft.option
    appState.chats = dft.chats
    appState.currentChatId = dft.currentChatId
    appState.panelSelection = dft.panelSelection
}

appDb.getItem<AppState>(appStateKey).then((as) => {
    console.debug("loading from db:", as)
    if (as) {
        if (as.auth) {
            appState.auth = as.auth
        }
        if (as.option) {
            appState.option = as.option
        }
        if (as.chats) {
            appState.chats = as.chats
        }
        if (as.currentChatId) {
            appState.currentChatId = as.currentChatId
        }
        if (as.panelSelection) {
            appState.panelSelection = as.panelSelection
        }
    }
    hydrationState.hydrated = true
})

subscribe(appState, () => {
    const hySnp = snapshot(hydrationState)
    if (!hySnp.hydrated) {
        // never write to the state before hydration, or state in indexeddb will be overwritten by default state
        console.debug("skipping subscription due to not hydrated")
        return
    }
    const as = snapshot(appState)
    console.debug("saving appState:", as)
    appDb.setItem(appStateKey, as).then(() => {
        console.debug("saved")
    })
})

export const findMessage = (chatProxy: Chat, messageId: string): Message | undefined => {
    return chatProxy.messages.find(m => m.id === messageId)
}

// The decision to not delete a message directly is based on the potential disruption caused by ongoing updates.
// If a message is continuously being updated, deleting it would result in the inability to locate the message,
// potentially leading to the creation of a new message and causing disorder.
// Messages will be completely deleted as user `Clear Messages` or deletes a chat
export const markMessageAsDeleted = (chatId: string, messageId: string): void => {
    const chat = appState.chats[chatId]
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
    appState.auth.passwordHash = password
}

export const setLoggedIn = (loggedIn: boolean) => {
    appState.auth.loggedIn = loggedIn
}

export const clearChats = () => {
    appState.chats = {}
    appState.currentChatId = ""
}

export const deleteChat = (id: string) => {
    const chats = appState.chats
    const currentChatId = appState.currentChatId

    if (currentChatId === "" || id != currentChatId) {
        // if there is no chat selected or user are deleting a chat other than current chat
        delete chats[id]
    } else if (!chats[currentChatId]) {
        // currentChatId is actually invalid, reset it
        appState.currentChatId = ""
    } else {
        // if user delete current chat
        const keys = Object.keys(chats)
        if (keys.length === 0) {
            // chats are empty
            appState.currentChatId = ""
        } else if (keys.length === 1) {
            // current chat is the only chat in list
            delete chats[id]
            appState.currentChatId = ""
        } else {
            // in this branch, currentChatId is ensured to be in the chat list and chat list size is >= 2

            // 1. select the chat behind current chat if this chat is not at the tail
            // 2. select the chat in front of current chat if this chat is at the tail

            let i = keys.length - 1
            for (; i >= 0; i--) {
                if (keys[i] === currentChatId) {
                    break
                }
            }
            if (i < 0) {
                throw new Error("impossible")
            } else if (i < keys.length - 1) {
                // current chat is not at the tail
                const newId = keys[i + 1]
                delete chats[currentChatId]
                appState.currentChatId = newId
            } else if (i === keys.length - 1) {
                // current chat is at the tail
                const newId = keys[i - 1]
                delete chats[currentChatId]
                appState.currentChatId = newId
            } else {
                throw new Error("impossible")
            }

        }
    }
}
