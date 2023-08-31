import {LLM, STT, TTS} from "./ability.ts";

export const EventAudio = "audio"
export const EventAnswer = "answer"
export const EventTrans = "trans"
export const EventAbility = "ability"

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

// Ability guide clients in adjusting all parameters.
export type AbilityEvent = {
    llm: LLM
    tts: TTS
    stt: STT
}
