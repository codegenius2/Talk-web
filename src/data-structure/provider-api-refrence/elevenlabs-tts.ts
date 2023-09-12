import {FloatRange} from "./types.ts";

export type ElevenlabsAPIReference = {
    stability: FloatRange
    clarity: FloatRange
}

// see https://platform.openai.com/docs/models/whisper
export const elevenlabsAPIReference: ElevenlabsAPIReference = {
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
