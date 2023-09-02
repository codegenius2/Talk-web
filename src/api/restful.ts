import {ChatGPTOption, TalkOption} from "../ds/ability/option.ts";
import {Ability, ChatGPTLLM} from "../ds/ability/client-ability.tsx";

export type Message = {
    role: string;
    content: string;
}

export type ConversationReq = {
    id: string; // unique ID for every conversation
    ms: Message[];
    talkOption: TalkOption
}

export const toTalkOption = (ability: Ability): TalkOption => {
    return {
        llm: ability.llm.available ? {
            chatGPT: toChatGPTOption(ability.llm.chatGPT)
        } : undefined
    }
}

export const toChatGPTOption = (chatGPT: ChatGPTLLM): ChatGPTOption | undefined => {
    if (chatGPT.enabled && chatGPT.available) {
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
}