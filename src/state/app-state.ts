import {proxy, snapshot, subscribe} from 'valtio'
import {appDb, appStateKey} from "./db.ts";
import {ClientAbility, defaultAbility} from "./data-structure/client-ability/client-ability.tsx";
import {Message} from "./data-structure/message.tsx";

export type AuthState = {
    passwordHash: string,
    loggedIn: boolean,
}

export type Chat = {
    id: string
    name: string
    messages: Message[]
    ability: ClientAbility,
    inputText: string
}

export type PanelSelection = 'chats' | 'global' | 'current'

export interface AppState {
    auth: AuthState
    ability: ClientAbility,
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
    ability: defaultAbility(),
    chats: {},
    currentChatId: "",
    panelSelection: "chats"
})

const defaultAppState = (): AppState => ({
    auth: {
        passwordHash: "",
        loggedIn: false,
    },
    ability: defaultAbility(),
    chats: {},
    currentChatId: "",
    panelSelection: "chats"
})

export const resetAppState = () => {
    const dft = defaultAppState()
    appState.auth = dft.auth
    appState.ability = dft.ability
    appState.chats = dft.chats
    appState.panelSelection = dft.panelSelection
}

appDb.getItem<AppState>(appStateKey).then((as) => {
    console.debug("loading from db:", as)
    if (as) {
        if (as.auth) {
            appState.auth = as.auth
        }
        if (as.ability) {
            appState.ability = as.ability
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

export const deleteMessage = (chatId: string, messageId: string): void => {
    const chat = appState.chats[chatId]
    if (!chat) {
        console.error("cannot delete message, because the chat is gone. this usually happens when the chat is deleted. " +
            "chatId,messageId:", chatId, messageId)
        return
    }
    chat.messages = chat.messages.filter(msg => msg.id !== messageId)
}

// password hash will be embedded within the header of subsequent requests
export const savePassword = (password: string) => {
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

            // 1. select the chat in front of current chat if this chat is at the tail
            // 2. select the chat behind current chat if this chat is not at the tail
            // 3. select no chat if current chat is the only chat in list

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
