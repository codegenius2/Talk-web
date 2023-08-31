import axios, {AxiosError} from "axios";
import {joinUrl} from "../util/Util";
import {currentProtocolHostPortPath} from "../util/Util.tsx";
import {useSSEStore} from "../state/SSE.tsx";
import {ConversationReq} from "./restful.ts";
import {useAuthStore} from "../state/Auth.tsx";

export function SSEEndpoint(): string {
    let sseEp = joinUrl(Endpoint(), "events")
    sseEp = sseEp + "?stream=" + useSSEStore.getState().streamId
    console.debug("SSEEndpoint:", sseEp)
    return sseEp
}

export function Endpoint(): string {
    let ep = import.meta.env.VITE_REACT_APP_ENDPOINT
    if (ep) {
        return ep
    }
    ep = joinUrl(currentProtocolHostPortPath(), "api")
    console.debug("RestfulEndpoint:", ep)
    return ep
}

export const axiosInstance = axios.create({
    baseURL: Endpoint(),
    timeout: 5000,
})

axiosInstance.interceptors.request.use((config) => {
    config.headers['stream-id'] = useSSEStore.getState().streamId;
    config.headers['Authorization'] = 'Bearer ' + useAuthStore.getState().getPasswordHash();
    return config;
});

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            useAuthStore.setState({...useAuthStore.getState, verified: false})
            console.info('Unauthorized', error.response);
        }
        return Promise.reject(error);
    }
);


export const postConv = async (conv: ConversationReq) => {
    return axiosInstance.post("conversation", conv);
};

export const postAudioConv = async (audio: Blob, fileName: string, conv: ConversationReq) => {
    const formData = new FormData();
    formData.append('audio', audio, fileName);
    formData.append('conversation', JSON.stringify(conv));

    return axiosInstance.postForm("audio-conversation", formData);
};

export const getHealth = async () => {
    return axiosInstance.get("health");
};