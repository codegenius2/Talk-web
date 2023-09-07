import {ServerSTT} from "../../api/sse/server-ability.ts";
import {ClientWhisper, defaultClientWhisper, mergeWhisper, toWhisperOption} from "./whisper.ts";
import {STTOption} from "../../api/option.ts";

export type ClientSTT = {
    available: boolean
    whisper: ClientWhisper
}

export const mergeSTT = (c: ClientSTT, s: ServerSTT): ClientSTT => {
    return {
        ...c,
        available: s.available,
        whisper: mergeWhisper(c.whisper, s.whisper)
    }
}

export const toSTTOption = (tts: ClientSTT): STTOption | undefined => {
    return tts.available ? {
        whisper: toWhisperOption(tts.whisper),
    } : undefined
}
export const defaultClientSTT = (): ClientSTT => ({
    available: false,
    whisper: defaultClientWhisper()
})

