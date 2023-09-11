import {ChooseOne, FloatRange, mergeChoice} from "./types.ts";
import {ElevenlabsTTSOption} from "../../../api/restful/model.ts";
import {ServerElevenlabs} from "../../../api/sse/server-ability.ts";

export type ClientElevenlabs = {
    enabled: boolean
    available: boolean
    voice: ChooseOne<string>
    stability: FloatRange
    clarity: FloatRange
}

export const adjustElevenlabs = (c: ClientElevenlabs, s: ServerElevenlabs): void => {
    c.available = s.available
    if (s.available) {
        c.voice.choices = s.voices?.map((v) => ({name: v.name, value: v.id, tags: v.tags ?? []})) ?? []
        c.voice.chosen = mergeChoice(c.voice, s.voices?.map(it => it.id) ?? [])
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
