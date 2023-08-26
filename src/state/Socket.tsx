import {create} from 'zustand';
import ReconnectingWebSocket from "reconnecting-websocket";
import {socketEndpoint} from "../Config.tsx";

export const useSocketStore =
    create(() => ({socket: new ReconnectingWebSocket(socketEndpoint())}))
console.info("websocket base url", import.meta.env.VITE_REACT_APP_WEBSOCKET_BASE_URL);

