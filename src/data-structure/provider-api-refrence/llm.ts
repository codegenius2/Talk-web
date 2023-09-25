import {IntRange} from "./types.ts"

export type LLMAPIReference = {
    readonly maxAttached: IntRange
}

export const llmAPIReference: LLMAPIReference = {
    maxAttached: {
        rangeStart: 0,
        rangeEnd: Number.MAX_SAFE_INTEGER,
        default: 4,
    },
}