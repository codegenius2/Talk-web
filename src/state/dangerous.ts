import {AppState, appState, defaultAppState} from "./app-state.ts";
import {defaultPromptState, PromptState, promptState} from "./promt-state.ts";
import {audioDb} from "./db.ts";

export const resetPromptState = () => {
    const dft = defaultPromptState()
    Object.keys(promptState).forEach((key) => {
        console.debug("resetting promptState, key:", key)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        promptState[key as keyof PromptState] = dft[key]
    })
}

export const resetAppState = () => {
    const dft = defaultAppState()
    Object.keys(appState).forEach((key) => {
        console.debug("resetting appState, key:", key)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        appState[key as keyof AppState] = dft[key]
    })
}

export const resetEverything = (callback: () => void) => {
    audioDb.clear(() => {
    }).catch(e => {
            console.error("failed to clear audio blobs:", e)
        }
    ).finally(() => {
        resetAppState()
        resetPromptState()
        console.info("all reset")
        callback()
    })
}

export const clearSettings = () => {
    const dft = defaultAppState()
    Object.keys(appState).forEach((key) => {
        if (key !== "chats") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            appState[key as keyof AppState] = dft[key]
        }
    })
    resetPromptState()
}

export const clearChats = () => {
    const dft = defaultAppState()
    appState.chats.splice(0, appState.chats.length)
    appState.currentChatId = dft.currentChatId
}
