import {ChatGPTOption, TalkOption} from "../data-structure/ability/option.ts";
import {Ability, ChatGPTLLM} from "../data-structure/ability/client-ability.tsx";
import axios, {AxiosError, AxiosInstance} from "axios";
import {generateHash} from "../util/util.tsx";

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

export class RestfulAPI {
    private axios: AxiosInstance

    constructor(axiosInstance: AxiosInstance) {
        this.axios = axiosInstance
    }

    async postConv(conv: ConversationReq) {
        return this.axios.post("conversation", conv)
    }

    async postAudioConv(audio: Blob, fileName: string, conv: ConversationReq) {
        const formData = new FormData();
        formData.append('audio', audio, fileName);
        formData.append('conversation', JSON.stringify(conv));

        return this.axios.postForm("audio-conversation", formData);
    }

    async getHealth(password?: string) {
        return this.axios.get("health", {
            headers: password ? {
                'Authorization': 'Bearer ' + generateHash(password)
            } : {}
        });
    }
}

export const defaultRestfulAPI = (): RestfulAPI => {
    const axiosInstance = axios.create({
        baseURL: "https://240.0.0.0",// black hole,see https://superuser.com/questions/698244/ip-address-that-is-the-equivalent-of-dev-null
        timeout: 2000,
    })
    axiosInstance.interceptors.request.use(() => {
            throw new Error('default RestfulAPI rejects all request');
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );

    return new RestfulAPI(axiosInstance)
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