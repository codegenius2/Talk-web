import {Ability, ChatGPTLLM, Choice, LLM} from "./client-ability.tsx";

// see https://platform.openai.com/docs/api-reference/chat/create
export const defaultChatGPTLLM = (): ChatGPTLLM => ({
    enabled: true,
    available: false,
    models: {
        available: false,
        choices: [],
    },
    maxTokens: {
        available: true,
        rangeStart: 0,
        rangeEnd: Number.MAX_SAFE_INTEGER,
        default: 16,
    },
    temperature: {
        available: true,
        rangeStart: 0,
        rangeEnd: 2,
        default: 1,
    },
    presencePenalty: {
        available: true,
        rangeStart: -2,
        rangeEnd: 2,
        default: 0,
    },
    frequencyPenalty: {
        available: true,
        rangeStart: -2,
        rangeEnd: 2,
        default: 0,
    },

    // additional
    maxHistory: {
        available: true,
        rangeStart: 0,
        rangeEnd: Number.MAX_SAFE_INTEGER,
        default: 4,
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