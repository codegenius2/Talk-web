import {WhisperOption} from "../../../api/restful/model.ts";
import {ChooseOne, getOrDefault, mergeChoice} from "./types.ts";
import {ServerWhisper} from "../../../api/sse/server-ability.ts";

export type ClientWhisper = {
    enabled: boolean // represents user's choice to disable ChatGPT, irrespective of its availability - preventing use of TTS.
    available: boolean // indicates if server provides support for ChatGPT
    models: ChooseOne<string>
}

export const adjustWhisper = (c: ClientWhisper, s: ServerWhisper): void => {
    c.available = s.available
    if (s.available) {
        c.models.choices = s.models?.map((m) => ({name: m, value: m, tags: []})) ?? []
        c.models.chosen = mergeChoice(c.models, s.models ?? [])
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
        enabled: true,
        available: false,
        models: {
            choices: [{name: "whisper-1", value: "whisper-1", tags: []}]
        }
    }
}