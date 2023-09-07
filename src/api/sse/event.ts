export const EventMessageThinking = "message/thinking"
export const EventMessageTextTyping = "message/text/typing"
export const EventMessageTextEOF = "message/text/EOF"
export const EventMessageAudio = "message/audio"
export const EventMessageError = "message/error"
export const EventSystemAbility = "system/ability"
export const EventSystemNotification = "system/notification"

export type Role = 'user' | 'assistant' | 'system'

export type MessageMeta = {
    // unique ID for the whole chat(contains maybe hundreds of messages)
    chatId: string;
    // unique ID for each request
    ticketId: string;
    // unique ID for each message
    messageID: string;
    role: Role;
}

export type Text = MessageMeta & {
    text: string;
}

export type Audio = MessageMeta & {
    audio: string; // base64 of byte array
    durationMs?: number
}

export type Error = MessageMeta & {
    eMessage: string;
}

