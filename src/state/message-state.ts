import {proxy} from "valtio";


export interface MState {
    loadAudio: boolean
    attached: boolean
}

const defaultMState = (): MState => ({
    loadAudio: false,
    attached: false
})

export interface MessageState {
    record: Record<string, MState>
}

export const messageState = proxy<MessageState>({
    record: {}
})

export const clearMessageState = () => {
    const keys = Object.keys(messageState.record);
    for (const key of keys) {
        delete messageState.record[key]
    }
}

export const setMState = (messageId: string, key: keyof MState, value: boolean) => {
    let m = messageState.record[messageId]
    if (m) {
        m[key] = value
    } else {
        m = defaultMState()
        m[key] = value
        messageState.record[messageId] = m
    }
}