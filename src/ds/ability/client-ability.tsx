// Data structure that represents the parameters to be displayed on the settings page.

import {AbilityEvent as ServerAbility} from "../../api/sse/event.ts"
import {ChatGPTLLM as ServerChatGPTLLM, LLM as ServerLLM,} from "../../api/sse/ability.ts"

export  type Ability = {
    llm: LLM
}

// server tells client what models, languages and other parameters it supports
export const mergeAbility = (c: Ability, s: ServerAbility): Ability => {
    return {
        llm: mergeLLM(c.llm, s.llm)
    }
}

// LLM
export type LLM = {
    available: boolean
    chatGPT: ChatGPTLLM
}

export const maxHistory = (llm: LLM): number => {
    if (!llm.available) {
        return 0;
    }
    const gpt = llm.chatGPT;
    if (gpt.available && gpt.enabled && gpt.maxHistory.available) {
        return gpt.maxHistory.chosen ?? gpt.maxHistory.default;
    }
    return 0;
}


export const mergeLLM = (c: LLM, s: ServerLLM): LLM => {
    return {
        ...c,
        available: s.available,
        chatGPT: mergeChatGPTAbility(c.chatGPT, s.chatGPT)
    }
}

export  type ChatGPTLLM = {
    // there is diff between 'enabled' and 'available'
    enabled: boolean // represents user's choice to disable ChatGPT, irrespective of its availability - preventing use of LLM.
    available: boolean // indicates if server provides support for ChatGPT
    models: ChooseOne
    maxHistory: IntRange
    maxTokens: IntRange;
    temperature: FloatRange;
    presencePenalty: FloatRange;
    frequencyPenalty: FloatRange;
}

export const mergeChatGPTAbility = (c: ChatGPTLLM, s: ServerChatGPTLLM): ChatGPTLLM => {
    return {
        ...c,
        available: s.available,
        models: {
            available: s.models.length > 0,
            choices: s.models.map((m) => ({name: m, value: m, tags: []})),
        }
    }
}

export interface Boolean {
    available: boolean;
    default: boolean;
    chosen?: boolean;
}

export interface IntRange {
    available: boolean;
    rangeStart: number;
    rangeEnd: number;
    default: number;
    chosen?: number;
}

export interface FloatRange {
    available: boolean;
    rangeStart: number;
    rangeEnd: number;
    default: number;
    chosen?: number;
}

export type NumStr = number | string

export interface ChooseOne {
    available: boolean;
    choices: Choice[];
    chosen?: NumStr;
}

export interface Choice {
    name: string;
    value: NumStr;
    tags: string[];
}