import {LLM, STT, TTS} from "./ability.ts";

export const EventAudio = "audio"
export const EventAnswer = "answer"
export const EventTrans = "trans"
export const EventAbility = "ability"

export type EventMeta = {
    convId: string; // unique ID for every Q&A
    eMsg: string;
}

export type Answer = EventMeta & {
    text: string;
    eof: boolean; // whether it is the last piece of content
}

export type Audio = EventMeta & {
    audio: string; // base64 of byte array
}

export type Trans = EventMeta & {
    text: string;
}

// Ability guide clients in adjusting all parameters.
export type AbilityEvent = {
    llm: LLM
    tts: TTS
    stt: STT
}
