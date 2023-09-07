import {Choice, mergeChoice, ChooseOne, FloatRange, IntRange} from "./types.ts";
import {ServerChatGPT} from "../../api/sse/server-ability.ts";
import {ChatGPTOption} from "../../api/option.ts";

export type ClientChatGPT = {
    // there is diff between 'enabled' and 'available'
    enabled: boolean // represents user's choice to disable ChatGPT, irrespective of its availability - preventing use of LLM.
    available: boolean // indicates if server provides support for ChatGPT
    models: ChooseOne<string>
    maxHistory: IntRange
    maxTokens: IntRange;
    temperature: FloatRange;
    presencePenalty: FloatRange;
    frequencyPenalty: FloatRange;
}

export const mergeChatGPT = (c: ClientChatGPT, s: ServerChatGPT): ClientChatGPT => {
    return {
        ...c,
        available: s.available,
        models: {
            ...c.models,
            choices: s.models.map((m) => ({name: m, value: m, tags: []})),
            chosen: mergeChoice(c.models, s.models)
        }
    }
}

export const toChatGPTOption = (chatGPT: ClientChatGPT): ChatGPTOption | undefined => {
    if (!chatGPT.enabled || !chatGPT.available) {
        return undefined
    }
    let model = ""
    if (chatGPT.models.chosen !== undefined) {
        model = chatGPT.models.chosen as string
    } else if (chatGPT.models.choices.length != 0) {
        model = chatGPT.models.choices[0].value as string
    } else {
        console.warn("model not found")
    }
    return {
        model: model,
        maxTokens: chatGPT.maxTokens.chosen ?? chatGPT.maxTokens.default,
        temperature: chatGPT.temperature.chosen ?? chatGPT.temperature.default,
        presencePenalty: chatGPT.presencePenalty.chosen ?? chatGPT.presencePenalty.default,
        frequencyPenalty: chatGPT.frequencyPenalty.chosen ?? chatGPT.frequencyPenalty.default,
    }
}

// see https://platform.openai.com/docs/api-reference/chat/create
export const defaultClientChatGPT = (): ClientChatGPT => ({
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

export const historyChoices: Choice<number>[] = [
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

export const tokenChoices: Choice<number>[] = [
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

export const temperatureChoices: Choice<number>[] = [
    {value: 0, name: "0", tags: []},
    {value: 0.2, name: "0.2", tags: []},
    {value: 0.4, name: "0.4", tags: []},
    {value: 0.6, name: "0.6", tags: []},
    {value: 0.8, name: "0.8", tags: []},
    {value: 1, name: "1", tags: []},
    {value: 1.2, name: "1.2", tags: []},
    {value: 1.4, name: "1.4", tags: []},
    {value: 1.6, name: "1.6", tags: []},
    {value: 1.8, name: "1.8", tags: []},
    {value: 2, name: "2", tags: []},
]

export const presencePenaltyChoices: Choice<number>[] = [
    {value: -2, name: "-2", tags: []},
    {value: -1.5, name: "-1.5", tags: []},
    {value: -1, name: "-1", tags: []},
    {value: -0.5, name: "-0.5", tags: []},
    {value: 0, name: "0", tags: []},
    {value: 0.5, name: "0.5", tags: []},
    {value: 1, name: "1", tags: []},
    {value: 1.5, name: "1.5", tags: []},
    {value: 2, name: "2", tags: []},
]

export const frequencyPenaltyChoices = presencePenaltyChoices
