import axios, {AxiosError, AxiosInstance} from "axios";
import {generateHash} from "../util/util.tsx";
import {TalkOption} from "./option.ts";
import {Role} from "./sse/event.ts";

export type Message = {
    role: Role;
    content: string;
}

export type ChatReq = {
    id: string; // unique ID for every chat
    ms: Message[];
    talkOption: TalkOption
}

export class RestfulAPI {
    private axios: AxiosInstance

    constructor(axiosInstance: AxiosInstance) {
        this.axios = axiosInstance
    }

    async postChat(chat: ChatReq) {
        return this.axios.post("chat", chat)
    }

    async postAudioChat(audio: Blob, fileName: string, chat: ChatReq) {
        const formData = new FormData();
        formData.append('audio', audio, fileName);
        formData.append('chat', JSON.stringify(chat));

        return this.axios.postForm("audio-chat", formData);
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