import {Choice, FloatRange, IntRange, k} from "./types.ts"

export type GeminiAPIReference = {
    readonly maxOutputTokens: IntRange
    readonly temperature: FloatRange
    readonly topP: FloatRange
    readonly topK: IntRange
}

// https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini
export const geminiAPIReference: GeminiAPIReference = {
    maxOutputTokens: {
        rangeStart: 1,
        rangeEnd: 8 * k,
        default: 8 * k,
    },
    temperature: {
        rangeStart: 0,
        rangeEnd: 1,
        default: 0.9,
    },
    topP: {
        rangeStart: 0,
        rangeEnd: 1,
        default: 1,
    },
    topK: {
        rangeStart: 1,
        rangeEnd: 40,
        default: 32,
    },
}

export const maxOutputTokens: Choice<number>[] = [
    {value: 50, name: "50", tags: []},
    {value: 100, name: "100", tags: []},
    {value: 200, name: "200", tags: []},
    {value: 500, name: "500", tags: []},
    {value: k, name: "1k", tags: []},
    {value: 2 * k, name: "2k", tags: []},
    {value: 4 * k, name: "4k", tags: []},
    {value: 8 * k, name: "8k", tags: []},
]