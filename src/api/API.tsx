export const outEventTypeAudio = "audio";
export const outEventTypeConversation = "conversation";

export interface Message {
    role: string;
    content: string;
}

export interface OutMeta {
    type: string;
    id: string; // unique ID for every event
}

export interface OutConversation extends OutMeta {
    conversation: Message[];
}

export interface OutAudio extends OutMeta {
    audio: string; // base64 of byte array
    fileName: string;
    conversation: Message[];
}

export const inEventTypeAudio = "audio";
export const inEventTypeMessage = "message";
export const inEventTypeTranscription = "transcription";

export interface InMeta {
    type: string;
    id: string; // unique ID for every event
    replyToId: string;
    err: string;
    eof: boolean;
}

export interface InMessage extends InMeta {
    message: Message;
}

export interface InAudio extends InMeta {
    audio: string; // base64 of byte array
    format: string;
}

export interface InTranscription extends InMeta {
    text: string;
}
