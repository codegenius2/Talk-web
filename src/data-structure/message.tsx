// do not change these types by modifying fields, using the defined functions instead

import {Role} from "../api/sse/event.ts";
import {messageTimeoutSeconds} from "../config.ts";
import {randomHash} from "../util/util.tsx";

export type MessageStatus =
    'sending'
    | 'sent'
    | 'thinking'
    | 'typing'
    | 'received'
    | 'error'
    | 'deleted'

export type MessageAudio = {
    id: string
    durationMs?: number
}

export type Message = {
    id: string
    role: Role
    status: MessageStatus
    audio?: MessageAudio
    text: string
    errorMessage?: string
    createdAt: number
    lastUpdatedAt: number
}

export const newThinking = (id: string): Message => ({
    id: id,
    role: 'assistant',
    status: "thinking",
    text: "",
    createdAt: Date.now(),
    lastUpdatedAt: Date.now()
})

export const newSending = (): Message => ({
    id: randomHash(),
    role: 'user',
    status: "sending",
    text: "",
    createdAt: Date.now(),
    lastUpdatedAt: Date.now()
})

export const onSent = (prev: Message): Message => {
    switch (prev.status) {
        case "sending":
            return {...prev, status: 'sent', lastUpdatedAt: Date.now()}
        case "sent":
        case "thinking":
        case "typing":
        case "received":
        case "error":
            console.error("onSent is invalid, prev status:", prev.status);
            return {...prev}
        case "deleted":
            return prev
    }
}

export const onTyping = (prev: Message, text: string): Message => {
    switch (prev.status) {
        case "thinking":
        case "typing":
            return {...prev, status: "typing", text: prev.text + text}
        case "sending":
        case "sent":
        case "received":
        case "error":
            console.error("onTyping is invalid, prev status:", prev.status, text);
            return {...prev}
        case "deleted":
            return prev
    }
}

export const onEOF = (prev: Message, text: string): Message => {
    switch (prev.status) {
        case "thinking":
        case "typing":
            return {...prev, text: prev.text + text, status: "received", lastUpdatedAt: Date.now()}
        case "sending":
        case "sent":
        case "received":
        case "error":
            console.error("onEOF is invalid, prev status:", prev.status);
            return {...prev}
        case "deleted":
            return prev
    }
}

export const onAudio = (prev: Message, audio: MessageAudio): Message => {
    switch (prev.status) {
        case "sending":
        case "sent":
            return {...prev, status: "sent", audio: audio, lastUpdatedAt: Date.now()}
        case "thinking":
            return {...prev, status: "received", audio: audio, lastUpdatedAt: Date.now()}
        case "received":
        case "typing":
        case "error":
            console.error("onAudio is invalid, prev status:", prev.status);
            return {...prev}
        case "deleted":
            return prev
    }
}

export const onError = (prev: Message, errMsg: string): Message => {
    switch (prev.status) {
        case "sending":
        case "sent":
        case "thinking":
        case "typing":
            return {...prev, errorMessage: errMsg, status: 'error', lastUpdatedAt: Date.now()}
        case "error":
        case "received":
            console.error("onError is invalid, prev status:" + prev.status)
            return {...prev,}
        case "deleted":
            return prev
    }
}

export const onDelete = (prev: Message): Message => {
    switch (prev.status) {
        case "sending":
        case "sent":
        case "thinking":
        case "typing":
        case "received":
        case "error":
            return {...prev, status: "deleted", audio: undefined, text: "", errorMessage: ""}
        case "deleted":
            console.error("onDelete is invalid, prev status:", prev.status)
            return prev
    }
}


const pending: MessageStatus[] = ["sending", "thinking", "typing"]
export const errorIfTimeout = (prev: Message): [Message, boolean] => {
    if (pending.includes(prev.status) && Date.now() - prev.lastUpdatedAt < messageTimeoutSeconds * 1000) {
        return [onError(prev, "Time out"), true]
    }
    return [prev, false]
}

const inHistory: MessageStatus[] = ["received", "sent"]
export const isInHistory = (m: Message): boolean => {
    return m.text !== "" && inHistory.includes(m.status)
}