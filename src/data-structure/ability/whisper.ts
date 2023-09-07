import {ServerWhisper} from "../../api/sse/server-ability.ts";
import {ChooseOne, getOrDefault} from "./types.ts";
import {WhisperOption} from "../../api/option.ts";

export type ClientWhisper = {
    enabled: boolean // represents user's choice to disable ChatGPT, irrespective of its availability - preventing use of TTS.
    available: boolean // indicates if server provides support for ChatGPT
    models: ChooseOne<string>
}

export function mergeWhisper(c: ClientWhisper, s: ServerWhisper): ClientWhisper {
    return {
        ...c,
        available: s.available,
        models: {
            choices: s.models.map((m) => ({name: m, value: m, tags: []})),
        }
    }
}

export const toWhisperOption = (whisper: ClientWhisper): WhisperOption | undefined => {
    if (!whisper.enabled || !whisper.available) {
        return undefined
    }
    return {
        model: getOrDefault(whisper.models, "")
    }
}

// see https://platform.openai.com/docs/api-reference/audio/createTranscription
export const defaultClientWhisper = (): ClientWhisper => {
    return {
        enabled: false,
        available: false,
        models: {
            choices: [{name: "whisper-1", value: "whisper-1", tags: []}]
        }
    }
}