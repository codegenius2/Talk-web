import {create} from 'zustand';
import ReconnectingWebSocket from "reconnecting-websocket";

export const useSocketStore =
    create(() => ({socket: new ReconnectingWebSocket(import.meta.env.VITE_REACT_APP_WEBSOCKET_BASE_URL)}))
console.info("websocket base url", import.meta.env.VITE_REACT_APP_WEBSOCKET_BASE_URL);

