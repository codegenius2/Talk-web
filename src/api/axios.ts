import axios, {AxiosError} from "axios";
import {joinUrl} from "../util/util";
import {currentProtocolHostPortPath} from "../util/util.tsx";
import {useSSEStore} from "../state/sse.tsx";
import {ConversationReq} from "./restful.ts";
import {useAuthStore} from "../state/auth.tsx";

export function SSEEndpoint(): string {
    const ep = joinUrl(Endpoint(), "events")
    console.debug("SSEEndpoint:", ep)
    return ep
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
    console.debug('Request Body:', config.data)
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