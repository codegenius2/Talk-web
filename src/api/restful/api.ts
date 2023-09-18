import axios, {AxiosError} from "axios";
import {ChatReq} from "./model.ts";
import {generateHash} from "../../util/util.tsx";
import {networkState} from "../../state/network-state.ts";
import {appState, setLoggedIn} from "../../state/app-state.ts";
import {APIEndpoint} from "../../config.ts";

const axiosInstance = axios.create({
    baseURL: APIEndpoint(),
    timeout: 5000,
})

axiosInstance.interceptors.request.use((config) => {
    config.headers['Stream-ID'] = networkState.streamId;
    if (!config.headers['Authorization']) {
        // do not override Authorization headerZ
        config.headers['Authorization'] = 'Bearer ' + appState.auth.passwordHash;
    }
    return config;
});

axiosInstance.interceptors.response.use(response => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            setLoggedIn(false)
            console.info('Unauthorized', error.response);
        }
        return Promise.reject(error);
    }
);

export const postChat = (chat: ChatReq) => {
    return axiosInstance.post("chat", chat)
}

export const postAudioChat = (audio: Blob, fileName: string, chat: ChatReq) => {
    const formData = new FormData();
    formData.append('audio', audio, fileName);
    formData.append('chat', JSON.stringify(chat));
    return axiosInstance.postForm("audio-chat", formData);
}

export const login = (password?: string) => {
    return axiosInstance.get("health", {
        headers: password ? {
            'Authorization': 'Bearer ' + generateHash(password)
        } : {}
    });
}
