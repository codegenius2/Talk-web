// do not change these types by modifying fields, using the defined functions instead

import {Role} from "../api/sse/event.ts";
import {messageTimeoutSeconds} from "../config.ts";

export type MessageStatus =
    'sending'
    | 'sent'
    | 'thinking'
    | 'typing'
    | 'received'
    | 'error'

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

export const newSending = (id: string): Message => ({
    id: id,
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
    }
}

export const onTyping = (prev: Message, text: string): Message => {
    switch (prev.status) {
        case "thinking":
        case "typing":
            return {...prev, status: "typing", text: prev.text + text, lastUpdatedAt: Date.now()}
        case "sending":
        case "sent":
        case "received":
        case "error":
            console.error("onTyping is invalid, prev status:", prev.status, text);
            return {...prev}
    }
}

export const onEOF = (prev: Message): Message => {
    switch (prev.status) {
        case "thinking":
        case "typing":
            return {...prev, status: "received", lastUpdatedAt: Date.now()}
        case "sending":
        case "sent":
        case "received":
        case "error":
            console.error("onEOF is invalid, prev status:", prev.status);
            return {...prev}
    }
}

export const onAudio = (prev: Message, audio: MessageAudio): Message => {
    switch (prev.status) {
        case "thinking":
            return {...prev, status: "received", audio: audio, lastUpdatedAt: Date.now()}
        case "typing":
        case "sending":
        case "sent":
        case "received":
        case "error":
            console.error("onAudio is invalid, prev status:", prev.status);
            return {...prev}
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