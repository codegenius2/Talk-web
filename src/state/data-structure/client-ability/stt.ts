import {adjustWhisper, ClientWhisper, defaultClientWhisper, toWhisperOption,} from "./whisper.ts";
import {ServerSTT} from "../../../api/sse/server-ability.ts";
import {STTOption} from "../../../api/restful/model.ts";

export type ClientSTT = {
    available: boolean
    whisper: ClientWhisper
}

export const applySTT = (c: ClientSTT, s: ServerSTT): void => {
    c.available = s.available
    adjustWhisper(c.whisper, s.whisper)
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

