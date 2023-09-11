// TTS


import {adjustGoogleTTS, ClientGoogleTTS, defaultClientGoogleTTS, toGoogleTTSOption} from "./google-tts.ts";
import {adjustElevenlabs, ClientElevenlabs, defaultClientElevenlabs, toElevenlabsTTSOption} from "./elevenlabs-tts.ts";
import {ServerTTS} from "../../../api/sse/server-ability.ts";
import {TTSOption} from "../../../api/restful/model.ts";

export type ClientTTS = {
    available: boolean
    google: ClientGoogleTTS
    elevenlabs: ClientElevenlabs
}

export const adjustTTS = (c: ClientTTS, s: ServerTTS): void => {
    c.available = s.available
    adjustGoogleTTS(c.google, s.google)
    adjustElevenlabs(c.elevenlabs, s.elevenlabs)
}

export const toTTSOption = (tts: ClientTTS): TTSOption | undefined => {
    return tts.available ? {
        google: toGoogleTTSOption(tts.google),
        elevenlabs: toElevenlabsTTSOption(tts.elevenlabs)
    } : undefined
}

export const defaultClientTTS = (): ClientTTS => ({
    available: false,
    google: defaultClientGoogleTTS(),
    elevenlabs: defaultClientElevenlabs()
})
