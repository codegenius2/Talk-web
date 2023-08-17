import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {
    InAudio,
    inEventTypeAudio,
    inEventTypeMessage,
    inEventTypeTranscription,
    InMessage, InMeta,
    InTranscription
} from '../api/API.tsx'
import ReconnectingWebSocket from 'reconnecting-websocket';

interface WebsocketProps {
    setSocket: Dispatch<SetStateAction<ReconnectingWebSocket | undefined>>
    setPendingInTranscription: Dispatch<SetStateAction<InTranscription[]>>
    setPendingInMessage: Dispatch<SetStateAction<InMessage[]>>
    setPendingInAudio: Dispatch<SetStateAction<InAudio[]>>
}

const Websocket: React.FC<WebsocketProps> = ({
                                                 setSocket,
                                                 setPendingInMessage,
                                                 setPendingInTranscription,
                                                 setPendingInAudio
                                             }) => {


    useEffect(() => {

        console.info("websocket base url", import.meta.env.VITE_REACT_APP_WEBSOCKET_BASE_URL);
        const socket = new ReconnectingWebSocket(import.meta.env.VITE_REACT_APP_WEBSOCKET_BASE_URL);
        setSocket(socket)
        socket.onopen = () => {
            console.log("Connected to socket server");
        };

        socket.onclose = () => {
            console.log("Disconnected from socket server");
        };

        socket.onerror = (error) => {
            console.error("Error on socket:", error);
        };

        socket.onmessage = (payload) => {
            const data = payload.data;
            console.log("Received message from server(truncated to 100 char):", data.slice(0, 100));
            const event: InMeta = JSON.parse(data)
            switch (event.type) {
                case inEventTypeMessage:
                    setPendingInMessage(p => [...p, event as InMessage])
                    break
                case inEventTypeTranscription:
                    setPendingInTranscription(p => [...p, event as InTranscription])
                    break
                case inEventTypeAudio:
                    setPendingInAudio(p => [...p, event as InAudio])
                    break
                default:
                    console.log("unknown message type", event.type);
            }
        };
        console.debug("all socket event handler registered");
    }, []);

    return null
};
export default Websocket;