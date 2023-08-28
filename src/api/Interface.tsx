export interface Message {
    role: string;
    content: string;
}

export interface ConversationReq {
    id: string; // unique ID for every conversation
    ms: Message[];
}

export const EventAudio = "audio"
export const EventAnswer = "answer"
export const EventTrans = "trans"

export interface EventMeta {
    convId: string; // unique ID for every Q&A
    eMsg: string;
}

export interface Answer extends EventMeta {
    text: string;
    eof: boolean; // whether it is the last piece of content
}

export interface Audio extends EventMeta {
    audio: string; // base64 of byte array
}

export interface Trans extends EventMeta {
    text: string;
}
