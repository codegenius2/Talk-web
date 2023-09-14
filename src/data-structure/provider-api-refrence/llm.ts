import {IntRange} from "./types.ts";

export type LLMAPIReference = {
    readonly maxHistory: IntRange
}

export const llmAPIReference: LLMAPIReference = {
    maxHistory: {
        rangeStart: 0,
        rangeEnd: Number.MAX_SAFE_INTEGER,
        default: 4,
    },
}