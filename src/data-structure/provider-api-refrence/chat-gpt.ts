import {Choice, FloatRange, IntRange, k} from "./types.ts"

export type ChatGPTAPIReference = {
    readonly maxTokens: IntRange
    readonly temperature: FloatRange
    readonly topP: FloatRange
    readonly presencePenalty: FloatRange
    readonly frequencyPenalty: FloatRange
}

// see https://platform.openai.com/docs/api-reference/chat/create
export const chatGPTAPIReference: ChatGPTAPIReference = {
    maxTokens: {
        rangeStart: 0,
        rangeEnd: Number.MAX_SAFE_INTEGER,
        default: k,
    },
    temperature: {
        rangeStart: 0,
        rangeEnd: 2,
        default: 1,
    },
    topP: {
        rangeStart: 0,
        rangeEnd: 1,
        default: 1,
    },
    presencePenalty: {
        rangeStart: -2,
        rangeEnd: 2,
        default: 0,
    },
    frequencyPenalty: {
        rangeStart: -2,
        rangeEnd: 2,
        default: 0,
    },
}

export const attachNumberChoices: Choice<number>[] = [
    {value: 1, name: "1", tags: []},
    {value: 2, name: "2", tags: []},
    {value: 3, name: "3", tags: []},
    {value: 4, name: "4", tags: []},
    {value: 5, name: "5", tags: []},
    {value: 6, name: "6", tags: []},
    {value: 7, name: "7", tags: []},
    {value: 8, name: "8", tags: []},
    {value: 9, name: "9", tags: []},
    {value: 10, name: "10", tags: []},
    {value: 20, name: "20", tags: []},
    {value: 30, name: "30", tags: []},
    {value: 40, name: "40", tags: []},
    {value: 50, name: "50", tags: []},
    {value: 100, name: "100", tags: []},
    {value: Number.MAX_SAFE_INTEGER, name: "∞", tags: []}
]

export const tokenChoices: Choice<number>[] = [
    {value: 50, name: "50", tags: []},
    {value: 100, name: "100", tags: []},
    {value: 200, name: "200", tags: []},
    {value: 500, name: "500", tags: []},
    {value: k, name: "1k", tags: []},
    {value: 2 * k, name: "2k", tags: []},
    {value: 4 * k, name: "4k", tags: []},
    {value: 8 * k, name: "8k", tags: []},
    {value: 16 * k, name: "16k", tags: []},
    {value: 32 * k, name: "32k", tags: []},
    {value: 64 * k, name: "64k", tags: []},
    {value: Number.MAX_SAFE_INTEGER, name: "∞", tags: []},
]