// TTS
import {ClientGoogleTTS, defaultClientGoogleTTS, mergeGoogleTTS, toGoogleTTSOption} from "./google-tts.ts";
import {ClientElevenlabs, defaultClientElevenlabs, mergeElevenlabs, toElevenlabsTTSOption} from "./elevenlabs-tts.ts";
import {ServerTTS} from "../../api/sse/server-ability.ts";
import {TTSOption} from "../../api/option.ts";

export type ClientTTS = {
    available: boolean
    google: ClientGoogleTTS
    elevenlabs: ClientElevenlabs
}

export const mergeTTS = (c: ClientTTS, s: ServerTTS): ClientTTS => {
    return {
        ...c,
        available: s.available,
        google: mergeGoogleTTS(c.google, s.google),
        elevenlabs: mergeElevenlabs(c.elevenlabs, s.elevenlabs)
    }
}

export const toTTSOption = (tts: ClientTTS): TTSOption|undefined => {
    return  tts.available ? {
        google: toGoogleTTSOption(tts.google),
        elevenlabs: toElevenlabsTTSOption(tts.elevenlabs)
    } : undefined
}

export const defaultClientTTS = (): ClientTTS => ({
    available: false,
    google: defaultClientGoogleTTS(),
    elevenlabs: defaultClientElevenlabs()
})
