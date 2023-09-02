import {Ability, ChatGPTLLM, Choice, LLM} from "./client-ability.tsx";

// see https://platform.openai.com/docs/api-reference/chat/create
export const defaultChatGPTLLM = (): ChatGPTLLM => ({
    enabled: true,
    available: false,
    models: {
        choices: [],
    },
    maxHistory: {
        rangeStart: 0,
        rangeEnd: Number.MAX_SAFE_INTEGER,
        default: 4,
    },
    maxTokens: {
        rangeStart: 0,
        rangeEnd: Number.MAX_SAFE_INTEGER,
        default: 2000,
    },
    temperature: {
        rangeStart: 0,
        rangeEnd: 2,
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
})

export const defaultLLM = (): LLM => ({
    available: false,
    chatGPT: defaultChatGPTLLM(),
})

export const defaultAbility = (): Ability => ({
    llm: defaultLLM()
})

export const historyChoices: Choice[] = [
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
    {value: 100, name: "100", tags: []}
]

export const tokenChoices: Choice[] = [
    {value: 50, name: "50", tags: []},
    {value: 100, name: "100", tags: []},
    {value: 200, name: "200", tags: []},
    {value: 500, name: "500", tags: []},
    {value: 1000, name: "1k", tags: []},
    {value: 2000, name: "2k", tags: []},
    {value: 4000, name: "4k", tags: []},
    {value: 8000, name: "8k", tags: []},
    {value: 16000, name: "16k", tags: []},
    {value: 32000, name: "32k", tags: []},
    {value: Number.MAX_SAFE_INTEGER, name: "∞", tags: []},
]