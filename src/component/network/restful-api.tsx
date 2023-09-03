import axios, {AxiosError} from "axios";
import {useSSEStore} from "../../state/sse.tsx";
import {useAuthStore} from "../../state/auth.tsx";
import {Endpoint} from "../../config.ts";
import {RestfulAPI} from "../../api/restful.ts";
import {useRestfulAPIStore} from "../../state/axios.tsx";
import {useEffect} from "react";

export const RestfulAPIComponent = () => {
    const streamId = useSSEStore(state => state.streamId)
    const passwordHash = useAuthStore(state => state.passwordHash)
    const setVerified = useAuthStore(state => state.setVerified)
    const setRestfulAPI = useRestfulAPIStore(state => state.setRestfulAPI)

    useEffect(() => {
        const axiosInstance = axios.create({
            baseURL: Endpoint(),
            timeout: 5000,
        })

        const source = axios.CancelToken.source();
        axiosInstance.interceptors.request.use((config) => {
            config.headers['stream-id'] = streamId;
            if (!config.headers['Authorization']) {
                // do not override Authorization headerZ
                config.headers['Authorization'] = 'Bearer ' + passwordHash;
            }
            config.cancelToken = source.token;
            return config;
        });

        axiosInstance.interceptors.response.use(
            response => {
                return response;
            },
            (error: AxiosError) => {
                if (error.response && error.response.status === 401) {
                    setVerified(false)
                    console.info('Unauthorized', error.response);
                }
                return Promise.reject(error);
            }
        );
        const api = new RestfulAPI(axiosInstance)

        setRestfulAPI(api)

        return () => {
            source.cancel("destroying axios instance")
        }
    }, [passwordHash, streamId, setRestfulAPI, setVerified])
    return null
}