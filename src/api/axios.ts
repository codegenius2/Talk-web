import axios from "axios";
import { joinUrl } from "../util/Util";
import {currentProtocolHostPortPath} from "../util/Util.tsx";
import {useSSEStore} from "../state/SSE.tsx";
import {ConversationReq} from "./restful.ts";

export function SSEEndpoint(): string {
    let ep = import.meta.env.VITE_REACT_APP_SSE_ENDPOINT
    if (!ep) {
        ep = joinUrl(currentProtocolHostPortPath(), "events")
    }
    ep = ep + "?stream=" + useSSEStore.getState().streamId
    console.debug("SSEEndpoint:", ep)
    return ep
}

export function RestfulEndpoint(): string {
    let ep = import.meta.env.VITE_REACT_APP_RESTFUL_ENDPOINT
    if (ep) {
        return ep
    }
    ep = joinUrl(currentProtocolHostPortPath(), "api")
    console.debug("RestfulEndpoint:", ep)
    return ep
}

export const axiosInstance = axios.create({
    baseURL: RestfulEndpoint(),
    timeout: 5000,
    headers: {'stream-id': useSSEStore.getState().streamId}
})

export const postConv = async (conv: ConversationReq) => {
    return axiosInstance.post("conversation", conv);
};

export const postAudioConv = async (audio: Blob, fileName: string, conv: ConversationReq) => {
    const formData = new FormData();
    formData.append('audio', audio, fileName);
    formData.append('conversation', JSON.stringify(conv));

    return axiosInstance.postForm("audio-conversation", formData);
};