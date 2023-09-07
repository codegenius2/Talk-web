import {ServerElevenlabs} from "../../api/sse/server-ability.ts";
import {ChooseOne, FloatRange, mergeChoice} from "./types.ts";
import {ElevenlabsTTSOption} from "../../api/option.ts";

export type ClientElevenlabs = {
    enabled: boolean
    available: boolean
    voice: ChooseOne<string>
    stability: FloatRange
    clarity: FloatRange
}

export function mergeElevenlabs(c: ClientElevenlabs, s: ServerElevenlabs): ClientElevenlabs {
    return {
        ...c,
        available: s.available,
        voice: {
            choices: s.voices.map((v) => ({name: v.name, value: v.id, tags: v.tags})),
            chosen: mergeChoice(c.voice, s.voices.map(it => it.id))
        }
    }
}

export const toElevenlabsTTSOption = (elevenlabs: ClientElevenlabs): ElevenlabsTTSOption | undefined => {
    if (!elevenlabs.enabled || !elevenlabs.available) {
        return undefined
    }
    return {
        voiceId: elevenlabs.voice.chosen as string ?? "",
        stability: elevenlabs.stability.chosen ?? elevenlabs.stability.default,
        clarity: elevenlabs.clarity.chosen ?? elevenlabs.clarity.default,
    }
}

export const defaultClientElevenlabs = (): ClientElevenlabs => {
    return {
        enabled: true,
        available: false,
        voice: {
            choices: [],
        },
        stability: {
            rangeStart: 0,
            rangeEnd: 1,
            default: 0.5,
        },
        clarity: {
            rangeStart: 0,
            rangeEnd: 1,
            default: 0.75,
        },
    }
}
