import {ClientChatGPT, defaultClientChatGPT, adjustChatGPT, toChatGPTOption} from "./chat-gpt.ts";
import {ServerLLM} from "../../../api/sse/server-ability.ts";
import {LLMOption} from "../../../api/restful/model.ts";

export type ClientLLM = {
    available: boolean
    chatGPT: ClientChatGPT
}

export const maxHistory = (llm: ClientLLM): number => {
    if (!llm.available) {
        return 0;
    }
    const gpt = llm.chatGPT;
    if (gpt.available && gpt.enabled) {
        return gpt.maxHistory.chosen ?? gpt.maxHistory.default;
    }
    return 0;
}

export const adjustLLM = (c: ClientLLM, s: ServerLLM): void => {
    c.available = s.available
    adjustChatGPT(c.chatGPT, s.chatGPT)
}

export const toLLMOption = (llm: ClientLLM): LLMOption | undefined => {
    return llm.available ? {
        chatGPT: toChatGPTOption(llm.chatGPT)
    } : undefined
}

export const defaultClientLLM = (): ClientLLM => ({
    available: false,
    chatGPT: defaultClientChatGPT(),
})
